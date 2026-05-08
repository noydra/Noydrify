'use strict';

const http = require('http');
const { shell, BrowserWindow } = require('electron');
const axios = require('axios');

const YT_OAUTH_PORT = 8889;
const YT_REDIRECT_URI = `http://127.0.0.1:${YT_OAUTH_PORT}/callback`;
const YT_SCOPES = ['https://www.googleapis.com/auth/youtube'].join(' ');

async function authorizeYouTube(mainWindow, clientId, clientSecret) {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', YT_REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', YT_SCOPES);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  const code = await new Promise((resolve, reject) => {
    let settled = false;
    let authWin = null;
    let server = null;

    const settle = (resolveCode, rejectErr) => {
      if (settled) return;
      settled = true;
      try { if (server) server.close(); } catch (_) {}
      setImmediate(() => { try { if (authWin) authWin.close(); } catch (_) {} });
      if (resolveCode) resolve(resolveCode);
      else reject(rejectErr || new Error('YouTube authorization failed'));
    };

    server = http.createServer((req, res) => {
      try {
        const url = new URL(req.url, `http://127.0.0.1:${YT_OAUTH_PORT}`);
        if (url.pathname !== '/callback') { res.end(); return; }
        const returnedCode = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!DOCTYPE html><html><body style="background:#121212;color:#fff;
          font-family:sans-serif;text-align:center;padding:80px;font-size:18px">
          <p style="font-size:48px">✓</p>
          <p><strong>YouTube account connected!</strong></p>
          <p style="color:#b3b3b3;font-size:14px">You can close this window.</p>
          </body></html>`);
        if (returnedCode) settle(returnedCode, null);
        else settle(null, new Error(error || 'Authorization denied'));
      } catch (e) { settle(null, e); }
    });

    server.on('error', (err) => reject(new Error(`Port ${YT_OAUTH_PORT} in use: ${err.message}`)));

    server.listen(YT_OAUTH_PORT, '127.0.0.1', () => {
      authWin = new BrowserWindow({
        width: 500,
        height: 700,
        parent: mainWindow,
        modal: true,
        title: 'Connect YouTube Account',
        backgroundColor: '#121212',
        webPreferences: { nodeIntegration: false, contextIsolation: true },
      });
      authWin.setMenuBarVisibility(false);
      authWin.loadURL(authUrl.toString());
      authWin.on('closed', () => { if (!settled) settle(null, new Error('Window closed')); });
    });

    setTimeout(() => settle(null, new Error('Authorization timed out')), 5 * 60 * 1000);
  });

  const resp = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: YT_REDIRECT_URI,
    grant_type: 'authorization_code',
  }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  const { access_token, refresh_token, expires_in } = resp.data;
  return {
    access_token,
    refresh_token,
    expiry: Date.now() + expires_in * 1000,
  };
}

async function refreshYouTubeToken(clientId, clientSecret, refreshToken) {
  const resp = await axios.post('https://oauth2.googleapis.com/token', new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  return {
    access_token: resp.data.access_token,
    expiry: Date.now() + resp.data.expires_in * 1000,
  };
}

async function getYouTubeToken(clientId, clientSecret, storedTokens) {
  if (Date.now() < storedTokens.expiry - 60_000) {
    return { access_token: storedTokens.access_token, expiry: storedTokens.expiry, wasRefreshed: false };
  }
  const refreshed = await refreshYouTubeToken(clientId, clientSecret, storedTokens.refresh_token);
  return { access_token: refreshed.access_token, expiry: refreshed.expiry, wasRefreshed: true };
}

async function getYouTubeChannelInfo(accessToken) {
  const resp = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
    params: { part: 'snippet', mine: true },
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const channel = resp.data.items && resp.data.items[0];
  if (!channel) throw new Error('No YouTube channel found for this account');
  return {
    id: channel.id,
    title: channel.snippet.title,
    thumbnail: channel.snippet.thumbnails && channel.snippet.thumbnails.default && channel.snippet.thumbnails.default.url,
  };
}

async function createYouTubePlaylist(accessToken, { title, description, privacyStatus = 'private', tracks }) {
  const createResp = await axios.post(
    'https://www.googleapis.com/youtube/v3/playlists?part=snippet,status',
    {
      snippet: { title, description: description || '' },
      status: { privacyStatus },
    },
    { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
  );
  const playlistId = createResp.data.id;
  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

  const results = [];

  for (const track of tracks) {
    try {
      const artistNames = (track.artists || []).map((a) => a.name).join(' ');
      const query = `${track.name} ${artistNames}`;

      const searchResp = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults: 1,
          videoCategoryId: '10',
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const videoId = searchResp.data.items && searchResp.data.items[0] && searchResp.data.items[0].id && searchResp.data.items[0].id.videoId;
      if (!videoId) {
        results.push({ trackId: track.id, success: false, error: 'Video not found' });
        continue;
      }

      await axios.post(
        'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet',
        {
          snippet: {
            playlistId,
            resourceId: { kind: 'youtube#video', videoId },
          },
        },
        { headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
      );

      results.push({ trackId: track.id, success: true, videoId });
    } catch (err) {
      const msg = err.response && err.response.data && err.response.data.error && err.response.data.error.message;
      results.push({ trackId: track.id, success: false, error: msg || err.message });
    }
  }

  return { playlistUrl, playlistId, results };
}

module.exports = { authorizeYouTube, getYouTubeToken, getYouTubeChannelInfo, createYouTubePlaylist, refreshYouTubeToken };
