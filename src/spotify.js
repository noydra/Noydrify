'use strict';

const http   = require('http');
const crypto = require('crypto');
const { BrowserWindow } = require('electron');

const TOKEN_BUFFER_MS = 60_000;

async function exchangeCode(clientId, clientSecret, code, redirectUri) {
  const params = new URLSearchParams({
    grant_type:   'authorization_code',
    code,
    redirect_uri: redirectUri,
  });
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body:   params.toString(),
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Spotify token exchange failed (${resp.status}): ${text.slice(0, 200)}`);
  }
  const data = await resp.json();
  if (!data.access_token) throw new Error('Spotify returned no access token.');
  return {
    access_token:  data.access_token,
    refresh_token: data.refresh_token || '',
    expiry:        Date.now() + (data.expires_in || 3600) * 1000,
  };
}

async function refreshAccessToken(clientId, clientSecret, refreshToken) {
  const params = new URLSearchParams({
    grant_type:    'refresh_token',
    refresh_token: refreshToken,
  });
  const resp = await fetch('https://accounts.spotify.com/api/token', {
    method:  'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
    },
    body:   params.toString(),
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Token refresh failed (${resp.status}): ${text.slice(0, 200)}`);
  }
  const data = await resp.json();
  return {
    access_token:  data.access_token,
    refresh_token: data.refresh_token || refreshToken,
    expiry:        Date.now() + (data.expires_in || 3600) * 1000,
  };
}

async function getValidToken(clientId, clientSecret, storedTokens) {
  if (!storedTokens || !storedTokens.access_token || !storedTokens.refresh_token) {
    throw new Error('SPOTIFY_NOT_CONNECTED');
  }
  if (storedTokens.expiry && storedTokens.expiry - TOKEN_BUFFER_MS > Date.now()) {
    return { access_token: storedTokens.access_token, newTokenData: null };
  }
  const refreshed = await refreshAccessToken(clientId, clientSecret, storedTokens.refresh_token);
  return { access_token: refreshed.access_token, newTokenData: refreshed };
}

const REDIRECT_PORTS = [8888, 8889, 8890, 8891];

function listenOnAvailablePort(server) {
  return new Promise((resolve, reject) => {
    let idx = 0;
    const tryNext = () => {
      if (idx >= REDIRECT_PORTS.length) {
        reject(new Error('Could not bind to any local port for OAuth callback. Ports 8888-8891 are all in use.'));
        return;
      }
      const p = REDIRECT_PORTS[idx++];
      server.once('error', (e) => {
        if (e.code === 'EADDRINUSE') { tryNext(); }
        else reject(e);
      });
      server.listen(p, '127.0.0.1', () => resolve(p));
    };
    tryNext();
  });
}

function authorizeSpotify(parentWindow, clientId, clientSecret) {
  return new Promise((resolve, reject) => {
    const oauthState = crypto.randomBytes(16).toString('hex');
    let settled    = false;
    let server     = null;
    let authWindow = null;
    let port;

    const finish = (err, result) => {
      if (settled) return;
      settled = true;
      try { server    && server.close();    } catch (_) {}
      try { authWindow && authWindow.close(); } catch (_) {}
      if (err) reject(err);
      else     resolve(result);
    };

    server = http.createServer(async (req, res) => {
      try {
        const reqUrl = new URL(req.url, `http://127.0.0.1:${port}`);
        const error = reqUrl.searchParams.get('error');
        const code  = reqUrl.searchParams.get('code');
        const retSt = reqUrl.searchParams.get('state');

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(
          '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Stade</title></head>' +
          '<body style="background:#121212;color:#fff;font-family:sans-serif;display:flex;' +
          'align-items:center;justify-content:center;height:100vh;margin:0">' +
          '<p>Authentication complete. You may close this window.</p></body></html>'
        );

        if (error) {
          finish(new Error(error === 'access_denied' ? 'SPOTIFY_LOGIN_CANCELLED' : `OAuth error: ${error}`));
          return;
        }
        if (retSt !== oauthState) {
          finish(new Error('OAuth state mismatch.'));
          return;
        }
        if (!code) {
          finish(new Error('No authorization code received.'));
          return;
        }

        const redirectUri = `http://127.0.0.1:${port}/callback`;
        try {
          const tokenData = await exchangeCode(clientId, clientSecret, code, redirectUri);
          finish(null, tokenData);
        } catch (e) {
          finish(e);
        }
      } catch (e) {
        try { res.writeHead(500).end(); } catch (_) {}
        finish(e);
      }
    });

    listenOnAvailablePort(server).then((assignedPort) => {
      port = assignedPort;
      const redirectUri = `http://127.0.0.1:${port}/callback`;
      const scope = 'playlist-read-private playlist-read-collaborative user-library-read';

      const authUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
        client_id:     clientId,
        response_type: 'code',
        redirect_uri:  redirectUri,
        scope,
        state:         oauthState,
        show_dialog:   'true',
      }).toString();

      authWindow = new BrowserWindow({
        width:  520,
        height: 720,
        parent: parentWindow || undefined,
        modal:  !!parentWindow,
        title:  'Connect Spotify',
        backgroundColor: '#121212',
        autoHideMenuBar: true,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          sandbox: true,
        },
      });

      authWindow.on('closed', () => {
        if (!settled) finish(new Error('SPOTIFY_LOGIN_CANCELLED'));
      });

      authWindow.loadURL(authUrl).catch((e) => finish(e));
    }).catch((e) => finish(e));
  });
}

async function spotifyApiGet(accessToken, pathWithQuery) {
  const url = pathWithQuery.startsWith('http')
    ? pathWithQuery
    : `https://api.spotify.com/v1${pathWithQuery}`;
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept':        'application/json',
      'User-Agent':    'Stade/1.0',
    },
    signal:  AbortSignal.timeout(20_000),
  });
}

async function getCurrentUser(accessToken) {
  const resp = await spotifyApiGet(accessToken, '/me');
  if (!resp.ok) {
    const text = await resp.text().catch(() => '');
    throw new Error(`Spotify /me failed (${resp.status}): ${text.slice(0, 200)}`);
  }
  return resp.json();
}

async function fetchCurrentUserPlaylists(accessToken) {
  const playlists = [];
  let url = '/me/playlists?limit=50';
  for (let page = 0; page < 100 && url; page++) {
    const resp = await spotifyApiGet(accessToken, url);
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      throw new Error(`Spotify playlists error (${resp.status}): ${text.slice(0, 200)}`);
    }
    const data  = await resp.json();
    const items = (data && data.items) || [];
    for (const item of items) {
      if (!item || !item.id) continue;
      playlists.push({
        spotifyPlaylistId: item.id,
        name:        String(item.name        || '').slice(0, 500),
        description: String(item.description || '').slice(0, 1000),
        ownerName:   String((item.owner && item.owner.display_name) || '').slice(0, 200),
        imageUrl:    (item.images && item.images[0] && item.images[0].url)
                       ? String(item.images[0].url).slice(0, 500) : '',
        trackCount:  (item.tracks && item.tracks.total) || (item.items && item.items.total) || 0,
        snapshotId:  String(item.snapshot_id || '').slice(0, 100),
      });
    }
    url = (data && data.next) ? data.next : null;
  }
  return playlists;
}

function parsePlaylistId(input) {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (/^[A-Za-z0-9]{22}$/.test(trimmed)) return trimmed;
  const m = /(?:open\.spotify\.com\/(?:intl-[a-z]{2}\/)?playlist\/|spotify:playlist:)([A-Za-z0-9]{22})/.exec(trimmed);
  return m ? m[1] : null;
}

async function fetchAllTracks(playlistId, accessToken) {
  if (!/^[A-Za-z0-9]{1,40}$/.test(playlistId)) {
    throw new Error('Invalid playlist id.');
  }
  const tracks = [];
  // Use the main /playlists/{id} endpoint because /playlists/{id}/tracks
  // sometimes returns 403 on accounts where the parent endpoint works fine.
  // Spotify's response shape:
  //   page 0:  { ..., items: { items: [{ item: <track> }], next, total } }
  //   page N:  paged URLs from `next` return { items: [{ item: <track> }], next, total }
  let url = `/playlists/${encodeURIComponent(playlistId)}?market=from_token`;
  let isFirstPage = true;
  for (let page = 0; page < 100 && url; page++) {
    const resp = await spotifyApiGet(accessToken, url);
    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      let spotifyMsg = '';
      try { spotifyMsg = JSON.parse(text)?.error?.message || ''; } catch (_) {}
      if (resp.status === 401 || (resp.status === 403 && /insufficient client scope/i.test(spotifyMsg))) {
        throw new Error('SPOTIFY_INSUFFICIENT_SCOPE');
      }
      if (resp.status === 403) {
        throw new Error(`SPOTIFY_403: ${spotifyMsg || text.slice(0, 200)}`);
      }
      throw new Error(`Spotify error ${resp.status}: ${text.slice(0, 300)}`);
    }
    const data       = await resp.json();
    const itemsBlock = isFirstPage ? (data && data.items) : data;
    const items      = (itemsBlock && itemsBlock.items) || [];
    for (const wrapper of items) {
      const tr = wrapper && (wrapper.item || wrapper.track);
      if (!tr || !tr.id) continue;
      if (tr.type && tr.type !== 'track') continue;
      if (!tr.artists) continue;
      tracks.push(tr);
    }
    url = (itemsBlock && itemsBlock.next) ? itemsBlock.next : null;
    isFirstPage = false;
  }
  return tracks;
}

module.exports = {
  authorizeSpotify,
  refreshAccessToken,
  getValidToken,
  getCurrentUser,
  fetchCurrentUserPlaylists,
  fetchAllTracks,
  parsePlaylistId,
};
