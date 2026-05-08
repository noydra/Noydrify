'use strict';

const fs = require('fs');
const path = require('path');
const { app, safeStorage } = require('electron');

const STORE_VERSION = 1;

let _storePath = null;

function getStorePath() {
  if (!_storePath) {
    _storePath = path.join(app.getPath('userData'), 'store.json');
  }
  return _storePath;
}

function defaultData() {
  return {
    version: STORE_VERSION,
    credentials: {
      spotifyClientId: '',
      spotifyClientSecret: '',
      ytClientId: '',
      ytClientSecret: '',
    },
    preferences: {
      language: 'en',
      downloadDir: '',
    },
    playlists: [],
    linkedAccounts: {},
    transferLogs: [],
  };
}

function readRaw() {
  try {
    if (!fs.existsSync(getStorePath())) {
      return defaultData();
    }
    const txt = fs.readFileSync(getStorePath(), 'utf8');
    const parsed = JSON.parse(txt);
    return Object.assign(defaultData(), parsed);
  } catch (err) {
    console.error('[store] read failed, using defaults:', err.message);
    return defaultData();
  }
}

function writeRaw(data) {
  const out = JSON.stringify(data, null, 2);
  const target = getStorePath();
  const tmp = target + '.tmp';
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(tmp, out, { mode: 0o600 });
  fs.renameSync(tmp, target);
}

function update(mutator) {
  const data = readRaw();
  mutator(data);
  writeRaw(data);
  return data;
}

function encryptString(plain) {
  if (typeof plain !== 'string' || !plain) return '';
  if (safeStorage.isEncryptionAvailable()) {
    return 'enc:' + safeStorage.encryptString(plain).toString('base64');
  }
  return 'plain:' + Buffer.from(plain, 'utf8').toString('base64');
}

function decryptString(stored) {
  if (typeof stored !== 'string' || !stored) return '';
  if (stored.startsWith('enc:')) {
    try {
      const buf = Buffer.from(stored.slice(4), 'base64');
      return safeStorage.decryptString(buf);
    } catch (_) { return ''; }
  }
  if (stored.startsWith('plain:')) {
    try { return Buffer.from(stored.slice(6), 'base64').toString('utf8'); }
    catch (_) { return ''; }
  }
  return '';
}

function getCredentials() {
  const data = readRaw();
  const c = data.credentials || {};
  return {
    spotifyClientId: c.spotifyClientId || '',
    spotifyClientSecret: decryptString(c.spotifyClientSecret),
    ytClientId: c.ytClientId || '',
    ytClientSecret: decryptString(c.ytClientSecret),
  };
}

function setCredentials(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid credentials payload.');
  }
  update((d) => {
    d.credentials = d.credentials || {};
    if (typeof input.spotifyClientId === 'string') {
      d.credentials.spotifyClientId = input.spotifyClientId.trim();
    }
    if (typeof input.spotifyClientSecret === 'string') {
      d.credentials.spotifyClientSecret = input.spotifyClientSecret
        ? encryptString(input.spotifyClientSecret.trim())
        : '';
    }
    if (typeof input.ytClientId === 'string') {
      d.credentials.ytClientId = input.ytClientId.trim();
    }
    if (typeof input.ytClientSecret === 'string') {
      d.credentials.ytClientSecret = input.ytClientSecret
        ? encryptString(input.ytClientSecret.trim())
        : '';
    }
  });
  return getCredentials();
}

function isCredentialsConfigured() {
  const c = getCredentials();
  return !!(c.ytClientId && c.ytClientSecret && c.spotifyClientId && c.spotifyClientSecret);
}

function getPreferences() {
  const d = readRaw();
  return Object.assign({ language: 'en', downloadDir: '' }, d.preferences || {});
}

function setPreferences(prefs) {
  if (!prefs || typeof prefs !== 'object') return getPreferences();
  update((d) => {
    d.preferences = Object.assign({}, d.preferences || {}, prefs);
  });
  return getPreferences();
}

function listPlaylists() {
  const d = readRaw();
  return Array.isArray(d.playlists) ? d.playlists.slice() : [];
}

function upsertPlaylist(playlist) {
  if (!playlist || !playlist.spotifyPlaylistId) {
    throw new Error('Invalid playlist payload.');
  }
  const id = playlist.spotifyPlaylistId;
  const row = {
    spotifyPlaylistId: id,
    name: String(playlist.name || '').slice(0, 500),
    description: String(playlist.description || '').slice(0, 1000),
    ownerName: String(playlist.ownerName || '').slice(0, 200),
    imageUrl: String(playlist.imageUrl || '').slice(0, 500),
    trackCount: Math.max(0, parseInt(playlist.trackCount) || 0),
    snapshotId: String(playlist.snapshotId || '').slice(0, 100),
    addedAt: new Date().toISOString(),
  };
  update((d) => {
    d.playlists = d.playlists || [];
    const idx = d.playlists.findIndex((p) => p.spotifyPlaylistId === id);
    if (idx >= 0) {
      row.addedAt = d.playlists[idx].addedAt || row.addedAt;
      d.playlists[idx] = row;
    } else {
      d.playlists.unshift(row);
    }
  });
  return row;
}

function removePlaylist(playlistId) {
  update((d) => {
    d.playlists = (d.playlists || []).filter((p) => p.spotifyPlaylistId !== playlistId);
  });
}

function getLinkedAccounts() {
  const d = readRaw();
  const out = {};
  const linked = d.linkedAccounts || {};
  for (const platform of Object.keys(linked)) {
    const stored = linked[platform];
    if (!stored) continue;
    try {
      const decrypted = decryptString(stored);
      if (!decrypted) continue;
      out[platform] = JSON.parse(decrypted);
    } catch (e) {
      console.error('[store] linked account decrypt failed for', platform, e.message);
    }
  }
  return out;
}

function saveLinkedAccount(platform, accountData) {
  if (typeof platform !== 'string' || !platform) {
    throw new Error('Invalid platform.');
  }
  if (!accountData || typeof accountData !== 'object') {
    throw new Error('Invalid account data.');
  }
  const blob = encryptString(JSON.stringify(accountData));
  update((d) => {
    d.linkedAccounts = d.linkedAccounts || {};
    d.linkedAccounts[platform] = blob;
  });
}

function removeLinkedAccount(platform) {
  update((d) => {
    if (d.linkedAccounts && d.linkedAccounts[platform]) {
      delete d.linkedAccounts[platform];
    }
  });
}

function getTransferLogs() {
  const d = readRaw();
  return Array.isArray(d.transferLogs) ? d.transferLogs.slice() : [];
}

function saveTransferLog(entry) {
  if (!entry || typeof entry !== 'object') {
    throw new Error('Invalid log entry.');
  }
  const safe = {
    transferredAt: entry.transferredAt || Date.now(),
    playlistTitle: String(entry.playlistTitle || '').slice(0, 500),
    playlistUrl: String(entry.playlistUrl || '').slice(0, 500),
    playlistId: String(entry.playlistId || '').slice(0, 100),
    totalTracks: parseInt(entry.totalTracks) || 0,
    addedTracks: parseInt(entry.addedTracks) || 0,
    failedTracks: parseInt(entry.failedTracks) || 0,
  };
  update((d) => {
    d.transferLogs = d.transferLogs || [];
    d.transferLogs.unshift(safe);
    if (d.transferLogs.length > 200) {
      d.transferLogs.length = 200;
    }
  });
}

module.exports = {
  getStorePath,
  getCredentials,
  setCredentials,
  isCredentialsConfigured,
  getPreferences,
  setPreferences,
  listPlaylists,
  upsertPlaylist,
  removePlaylist,
  getLinkedAccounts,
  saveLinkedAccount,
  removeLinkedAccount,
  getTransferLogs,
  saveTransferLog,
};
