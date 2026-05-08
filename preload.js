'use strict';

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  setupStatus:          () => ipcRenderer.invoke('setup:status'),
  setupGetCredentials:  () => ipcRenderer.invoke('setup:getCredentials'),
  setupSaveCredentials: (payload) => ipcRenderer.invoke('setup:saveCredentials', payload),

  getPreferences: () => ipcRenderer.invoke('preferences:get'),
  savePreferences: (partial) => ipcRenderer.invoke('preferences:save', partial),

  playlistsList:   () => ipcRenderer.invoke('playlists:list'),
  playlistsRemove: (id) => ipcRenderer.invoke('playlists:remove', id),
  playlistsTracks: (id) => ipcRenderer.invoke('playlists:tracks', id),

  spotifyStatus:     () => ipcRenderer.invoke('spotify:status'),
  spotifyConnect:    () => ipcRenderer.invoke('spotify:connect'),
  spotifyDisconnect: () => ipcRenderer.invoke('spotify:disconnect'),

  selectFolder:    () => ipcRenderer.invoke('dialog:selectFolder'),
  initDownloader:  () => ipcRenderer.invoke('downloader:init'),
  downloadTracks:  (payload) => ipcRenderer.invoke('download:tracks', payload),
  openFolder:      (folderPath) => ipcRenderer.invoke('shell:openPath', folderPath),
  openExternal:    (url)        => ipcRenderer.invoke('shell:openExternal', url),

  isOnline: () => ipcRenderer.invoke('app:isOnline'),

  getLinkedAccounts:   () => ipcRenderer.invoke('accounts:getLinked'),
  removeLinkedAccount: (payload) => ipcRenderer.invoke('accounts:remove', payload),

  youtubeConnect:     () => ipcRenderer.invoke('youtube:connect'),
  youtubeVerifyToken: () => ipcRenderer.invoke('youtube:verifyToken'),
  youtubeTransfer:    (payload) => ipcRenderer.invoke('youtube:transfer', payload),
  youtubeGetLogs:     () => ipcRenderer.invoke('youtube:getLogs'),

  onDownloadProgress: (cb) =>
    ipcRenderer.on('download:progress', (_e, data) => cb(data)),
  onDownloaderInitProgress: (cb) =>
    ipcRenderer.on('downloader:initProgress', (_e, msg) => cb(msg)),
  removeAllListeners: (channel) =>
    ipcRenderer.removeAllListeners(channel),
});
