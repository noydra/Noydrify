'use strict';

const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');

app.commandLine.appendSwitch('log-level', '3');

const path = require('path');
const fs   = require('fs');
const os   = require('os');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 950,
    minHeight: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    backgroundColor: '#121212',
    show: false,
    title: 'Noydrify',
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function assertString(v, max, name) {
  if (typeof v !== 'string' || v.length > max) {
    throw new Error('Invalid ' + name + '.');
  }
  return v;
}

function assertPlaylistId(v) {
  if (typeof v !== 'string' || !/^[A-Za-z0-9]{1,40}$/.test(v)) {
    throw new Error('Invalid playlistId.');
  }
  return v;
}

ipcMain.handle('setup:status', () => {
  const store = require('./src/store');
  return { configured: store.isCredentialsConfigured() };
});

ipcMain.handle('setup:getCredentials', () => {
  const store = require('./src/store');
  return store.getCredentials();
});

ipcMain.handle('setup:saveCredentials', (_e, payload) => {
  const store = require('./src/store');
  return store.setCredentials(payload || {});
});

ipcMain.handle('preferences:get', () => {
  const store = require('./src/store');
  return store.getPreferences();
});

ipcMain.handle('preferences:save', (_e, partial) => {
  const store = require('./src/store');
  return store.setPreferences(partial || {});
});

ipcMain.handle('playlists:list', async () => {
  const store   = require('./src/store');
  const linked  = store.getLinkedAccounts();
  if (!linked || !linked.spotify) throw new Error('SPOTIFY_NOT_CONNECTED');
  const creds   = store.getCredentials();
  const spotify = require('./src/spotify');
  const { access_token, newTokenData } = await spotify.getValidToken(
    creds.spotifyClientId, creds.spotifyClientSecret, linked.spotify
  );
  if (newTokenData) {
    store.saveLinkedAccount('spotify', Object.assign({}, linked.spotify, newTokenData));
  }
  return await spotify.fetchCurrentUserPlaylists(access_token);
});

ipcMain.handle('playlists:remove', (_e, playlistId) => {
  assertPlaylistId(playlistId);
  return { success: true };
});

ipcMain.handle('playlists:tracks', async (_e, playlistId) => {
  assertPlaylistId(playlistId);
  const store   = require('./src/store');
  const linked  = store.getLinkedAccounts();
  if (!linked || !linked.spotify) throw new Error('SPOTIFY_NOT_CONNECTED');
  const creds   = store.getCredentials();
  const spotify = require('./src/spotify');
  const { access_token, newTokenData } = await spotify.getValidToken(
    creds.spotifyClientId, creds.spotifyClientSecret, linked.spotify
  );
  if (newTokenData) {
    store.saveLinkedAccount('spotify', Object.assign({}, linked.spotify, newTokenData));
  }
  try {
    return await spotify.fetchAllTracks(playlistId, access_token);
  } catch (err) {
    const errMsg = (err && err.message) || '';
    if (/401/.test(errMsg) || /SPOTIFY_INSUFFICIENT_SCOPE/.test(errMsg)) {
      store.removeLinkedAccount('spotify');
      throw new Error('SPOTIFY_NOT_CONNECTED');
    }
    if (/SPOTIFY_403|403/.test(errMsg)) {
      throw new Error('SPOTIFY_PLAYLIST_FORBIDDEN');
    }
    throw err;
  }
});

ipcMain.handle('spotify:status', () => {
  const store  = require('./src/store');
  const linked = store.getLinkedAccounts();
  return { connected: !!(linked && linked.spotify && linked.spotify.access_token) };
});

ipcMain.handle('spotify:connect', async () => {
  const store  = require('./src/store');
  const creds  = store.getCredentials();
  if (!creds.spotifyClientId || !creds.spotifyClientSecret) {
    throw new Error('SPOTIFY_CREDENTIALS_MISSING');
  }
  const spotify   = require('./src/spotify');
  const tokenData = await spotify.authorizeSpotify(mainWindow, creds.spotifyClientId, creds.spotifyClientSecret);
  const user      = await spotify.getCurrentUser(tokenData.access_token);
  const accountData = {
    access_token:  tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry:        tokenData.expiry,
    userId:        user.id || '',
    userName:      user.display_name || '',
    connectedAt:   Date.now(),
  };
  store.saveLinkedAccount('spotify', accountData);
  return { connected: true, userName: user.display_name || '' };
});

ipcMain.handle('spotify:disconnect', () => {
  const store = require('./src/store');
  store.removeLinkedAccount('spotify');
  return { success: true };
});

ipcMain.handle('dialog:selectFolder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: 'Select download folder',
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('downloader:init', async () => {
  const { ensureYtDlp } = require('./src/downloader');
  await ensureYtDlp((msg) => {
    if (mainWindow) mainWindow.webContents.send('downloader:initProgress', msg);
  });
  return { success: true };
});

ipcMain.handle('shell:openPath',     (_e, folderPath) => shell.openPath(folderPath));
ipcMain.handle('shell:openExternal', (_e, url)        => shell.openExternal(url));

ipcMain.handle('app:isOnline', () => {
  const { net } = require('electron');
  return net.isOnline();
});

ipcMain.handle('accounts:getLinked', () => {
  const store = require('./src/store');
  return store.getLinkedAccounts();
});

ipcMain.handle('accounts:remove', (_e, payload) => {
  const platform = (payload && payload.platform) || '';
  if (platform !== 'youtube') throw new Error('Invalid platform.');
  const store = require('./src/store');
  store.removeLinkedAccount(platform);
  return { success: true };
});

ipcMain.handle('youtube:verifyToken', async () => {
  const store = require('./src/store');
  const linked = store.getLinkedAccounts();
  if (!linked.youtube) return { valid: false };

  const creds = store.getCredentials();
  if (!creds.ytClientId || !creds.ytClientSecret) return { valid: false };

  const { getYouTubeToken, getYouTubeChannelInfo } = require('./src/youtube');

  let tokenResult;
  try {
    tokenResult = await getYouTubeToken(creds.ytClientId, creds.ytClientSecret, linked.youtube);
  } catch (err) {
    const errData = err.response && err.response.data;
    if (errData && errData.error === 'invalid_grant') {
      store.removeLinkedAccount('youtube');
      return { valid: false };
    }
    return { valid: true };
  }

  try {
    await getYouTubeChannelInfo(tokenResult.access_token);
    return { valid: true };
  } catch (err) {
    const status = err.response && err.response.status;
    if (status === 401 || status === 403) {
      store.removeLinkedAccount('youtube');
      return { valid: false };
    }
    return { valid: true };
  }
});

ipcMain.handle('youtube:connect', async () => {
  const store = require('./src/store');
  const creds = store.getCredentials();
  if (!creds.ytClientId || !creds.ytClientSecret) {
    throw new Error('YOUTUBE_CREDENTIALS_MISSING');
  }
  const { authorizeYouTube, getYouTubeChannelInfo } = require('./src/youtube');

  const tokenData   = await authorizeYouTube(mainWindow, creds.ytClientId, creds.ytClientSecret);
  const channelInfo = await getYouTubeChannelInfo(tokenData.access_token);

  const accountData = {
    access_token:  tokenData.access_token,
    refresh_token: tokenData.refresh_token,
    expiry:        tokenData.expiry,
    channelId:     channelInfo.id,
    channelTitle:  channelInfo.title,
    thumbnail:     channelInfo.thumbnail || '',
    connectedAt:   Date.now(),
  };

  store.saveLinkedAccount('youtube', accountData);
  return { channelTitle: channelInfo.title, thumbnail: channelInfo.thumbnail };
});

ipcMain.handle('youtube:transfer', async (_e, payload) => {
  const { title, description, privacyStatus, tracks } = payload || {};
  assertString(title, 200, 'title');
  assertString(description == null ? '' : description, 5000, 'description');
  if (!['private', 'public', 'unlisted'].includes(privacyStatus)) {
    throw new Error('Invalid privacyStatus.');
  }
  if (!Array.isArray(tracks) || tracks.length === 0 || tracks.length > 5000) {
    throw new Error('Invalid tracks list.');
  }
  for (const t of tracks) {
    if (!t || typeof t !== 'object') throw new Error('Invalid track entry.');
    if (t.name   != null) assertString(t.name,   500, 'track.name');
  }

  const store = require('./src/store');
  const creds = store.getCredentials();
  if (!creds.ytClientId || !creds.ytClientSecret) {
    throw new Error('YOUTUBE_CREDENTIALS_MISSING');
  }
  const linked = store.getLinkedAccounts();
  if (!linked.youtube) throw new Error('YouTube account not connected.');

  const { getYouTubeToken, createYouTubePlaylist } = require('./src/youtube');
  const tokenResult = await getYouTubeToken(creds.ytClientId, creds.ytClientSecret, linked.youtube);

  if (tokenResult.wasRefreshed) {
    store.saveLinkedAccount('youtube', Object.assign({}, linked.youtube, {
      access_token: tokenResult.access_token,
      expiry:       tokenResult.expiry,
    }));
  }

  const result = await createYouTubePlaylist(tokenResult.access_token, {
    title,
    description,
    privacyStatus,
    tracks,
  });

  try {
    const added  = result.results ? result.results.filter((r) =>  r.success).length : 0;
    const failed = result.results ? result.results.filter((r) => !r.success).length : 0;
    store.saveTransferLog({
      transferredAt: Date.now(),
      playlistTitle: title,
      playlistUrl:   result.playlistUrl || '',
      playlistId:    result.playlistId  || '',
      totalTracks:   tracks.length,
      addedTracks:   added,
      failedTracks:  failed,
    });
  } catch (_) {}

  return result;
});

ipcMain.handle('youtube:getLogs', () => {
  const store = require('./src/store');
  return store.getTransferLogs();
});

ipcMain.handle('download:tracks', async (_e, payload) => {
  const { tracks, outputDir } = payload || {};
  const { downloadTrack } = require('./src/downloader');

  if (!Array.isArray(tracks) || tracks.length === 0) {
    throw new Error('No tracks specified.');
  }
  if (!outputDir || typeof outputDir !== 'string') {
    throw new Error('No output directory specified.');
  }

  const resolved = path.resolve(outputDir);
  const safeRoots = [
    os.homedir(),
    os.tmpdir(),
    '/media',
    '/run/media',
    '/mnt',
  ].map((p) => path.resolve(p));
  const ok = safeRoots.some((root) => resolved === root || resolved.startsWith(root + path.sep));
  if (!ok) throw new Error('Refused to write outside allowed directories.');

  if (!fs.existsSync(resolved)) {
    fs.mkdirSync(resolved, { recursive: true });
  }

  const results = [];

  for (const track of tracks) {
    const artistNames = (track.artists || []).map((a) => a.name).join(', ');
    const query       = (track.name || '') + ' ' + artistNames;
    const albumName   = (track.album && track.album.name) || '';
    const albumArtUrl = (track.album && track.album.images && track.album.images[0] && track.album.images[0].url) || '';

    try {
      mainWindow.webContents.send('download:progress', {
        trackId: track.id, status: 'searching', message: '',
      });

      const filePath = await downloadTrack({
        query, trackName: track.name, artists: artistNames, albumName, albumArtUrl,
        outputDir: resolved,
        proxy: null,
        onProgress: (status, message) => {
          if (mainWindow) {
            mainWindow.webContents.send('download:progress', { trackId: track.id, status, message });
          }
        },
      });

      mainWindow.webContents.send('download:progress', {
        trackId: track.id, status: 'done', message: 'Done!', filePath,
      });
      results.push({ trackId: track.id, success: true, filePath });
    } catch (err) {
      if (mainWindow) {
        mainWindow.webContents.send('download:progress', {
          trackId: track.id, status: 'error', message: err.message,
        });
      }
      results.push({ trackId: track.id, success: false, error: err.message });
    }
  }

  return results;
});
