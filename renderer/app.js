'use strict';

const TRANSLATIONS = {
  en: {
    'setup.subtitle': 'Enter your own API credentials to use Noydrify.',
    'setup.ytClientId': 'YouTube Client ID',
    'setup.ytClientSecret': 'YouTube Client Secret',
    'setup.spotifyClientId': 'Spotify Client ID',
    'setup.spotifyClientSecret': 'Spotify Client Secret',
    'setup.help': 'Create credentials at the Google Cloud Console (YouTube Data API v3) and the Spotify Developer Dashboard.<br/>• Spotify app → Redirect URIs: <strong>http://127.0.0.1:8888/callback</strong><br/>• Google Cloud Console → Authorized redirect URIs: <strong>http://127.0.0.1:8889/callback</strong><br/>You will be asked to sign in to your Spotify account after saving.',
    'setup.save': 'Save and continue',
    'setup.error.required': 'All four credentials are required.',
    'setup.error.save': 'Could not save credentials.',
    'credentials.title': 'API Credentials',
    'credentials.save': 'Save',
    'credentials.saved': 'Credentials saved.',
    'home.myPlaylists': 'My Playlists',
    'home.noPlaylists': 'No playlists found in your Spotify account.',
    'home.removePlaylist': 'Hide from Noydrify',
    'home.confirmRemove': 'Hide "{name}" from your Noydrify library?',
    'home.playlistRemoved': 'Playlist hidden.',
    'home.removeFailed': 'Could not hide playlist.',
    'home.search': 'Search playlists...',
    'common.loading': 'Loading...',
    'common.done': 'Done',
    'common.cancel': 'Cancel',
    'tracks.selectAll': 'Select All',
    'tracks.deselectAll': 'Deselect All',
    'tracks.loading': 'Loading tracks...',
    'tracks.selectFolder': 'Select Folder',
    'tracks.download': '↓ Download',
    'tracks.transfer': '→ Transfer',
    'tracks.selected': '{n} track selected',
    'tracks.selectedPlural': '{n} tracks selected',
    'tracks.col.number': '#',
    'tracks.col.title': 'Title',
    'tracks.col.artist': 'Artist',
    'tracks.col.duration': 'Duration',
    'tracks.trackCount': '{n} tracks',
    'download.title': 'Downloading',
    'download.preparing': 'Preparing...',
    'download.initMessage': 'Preparing...',
    'download.initSub': 'This only happens on the first run.',
    'download.openFolder': '📂 Open Folder',
    'download.progress': '{done} / {total} completed',
    'download.doneAll': '{n} track downloaded!',
    'download.doneErrors': '{ok} succeeded, {err} failed',
    'download.waiting': 'Waiting...',
    'download.searching': 'Searching...',
    'download.done': 'Done!',
    'download.downloading': 'Downloading... {pct}%',
    'download.converting': 'Converting to MP3…',
    'profile.linkedAccounts': 'Connected Accounts',
    'profile.editCredentials': 'Edit Credentials',
    'profile.refreshPlaylists': 'Refresh Playlists',
    'profile.reconnectSpotify': 'Reconnect Spotify',
    'accounts.ytRedirectHint': 'Add <strong>http://127.0.0.1:8889/callback</strong> to Authorized redirect URIs in Google Cloud Console.',
    'accounts.title': 'Connected Accounts',
    'accounts.subtitle': 'Connect your YouTube account to transfer playlists',
    'accounts.notConnected': 'Not connected',
    'accounts.connect': 'Connect',
    'accounts.disconnect': 'Disconnect',
    'accounts.connected': 'Connected',
    'accounts.connectFailed': 'Connection failed',
    'accounts.disconnected': 'Disconnected',
    'accounts.logs': 'Logs',
    'accounts.logsTitle': 'Transfer History',
    'accounts.logsEmpty': 'No transfers yet.',
    'accounts.logsAdded': '{added}/{total} tracks added',
    'accounts.youtubeMissingCreds': 'YouTube credentials missing. Open Settings → Edit Credentials.',
    'spotify.notConnectedTracks': 'Spotify permissions need to be refreshed. Please reconnect.',
    'spotify.playlistForbidden': 'Spotify denied access to this playlist (403). This usually means the playlist is owned by Spotify (e.g. Discover Weekly), or your app is in Development Mode and the account is not in the User Management list.',
    'spotify.loginRequired': 'Spotify sign-in is required to continue.',
    'transfer.title': 'Transfer Playlist',
    'transfer.playlistName': 'Playlist Name',
    'transfer.description': 'Description (optional)',
    'transfer.privacy': 'Privacy',
    'transfer.private': 'Private',
    'transfer.unlisted': 'Unlisted',
    'transfer.public': 'Public',
    'transfer.start': 'Transfer',
    'transfer.progressTitle': 'Transferring...',
    'transfer.openYT': 'Open on YouTube',
    'transfer.pending': 'Pending...',
    'transfer.added': 'Added',
    'transfer.notFound': 'Not found',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'offline.title': 'No Internet Connection',
    'offline.sub': 'Please check your internet connection and restart the application.',
    'offline.retry': 'Retry',
  },
  tr: {
    'setup.subtitle': 'Noydrify\'i kullanmak için kendi API bilgilerinizi girin.',
    'setup.ytClientId': 'YouTube Client ID',
    'setup.ytClientSecret': 'YouTube Client Secret',
    'setup.spotifyClientId': 'Spotify Client ID',
    'setup.spotifyClientSecret': 'Spotify Client Secret',
    'setup.help': 'Google Cloud Console (YouTube Data API v3) ve Spotify Developer Dashboard üzerinden kimlik bilgilerinizi oluşturun.<br/>• Spotify uygulaması → Redirect URIs: <strong>http://127.0.0.1:8888/callback</strong><br/>• Google Cloud Console → Authorized redirect URIs: <strong>http://127.0.0.1:8889/callback</strong><br/>Kaydettikten sonra Spotify hesabınıza giriş yapmanız istenecektir.',
    'setup.save': 'Kaydet ve devam et',
    'setup.error.required': 'Dört kimlik bilgisi de zorunludur.',
    'setup.error.save': 'Kimlik bilgileri kaydedilemedi.',
    'credentials.title': 'API Kimlik Bilgileri',
    'credentials.save': 'Kaydet',
    'credentials.saved': 'Kimlik bilgileri kaydedildi.',
    'home.myPlaylists': 'Çalma Listelerim',
    'home.noPlaylists': 'Spotify hesabında çalma listesi bulunamadı.',
    'home.removePlaylist': 'Noydrify\'den gizle',
    'home.confirmRemove': '"{name}" Noydrify kütüphanenden gizlensin mi?',
    'home.playlistRemoved': 'Playlist gizlendi.',
    'home.removeFailed': 'Playlist gizlenemedi.',
    'home.search': 'Çalma listesi ara...',
    'common.loading': 'Yükleniyor...',
    'common.done': 'Tamam',
    'common.cancel': 'İptal',
    'tracks.selectAll': 'Tümünü Seç',
    'tracks.deselectAll': 'Seçimi Kaldır',
    'tracks.loading': 'Şarkılar yükleniyor...',
    'tracks.selectFolder': 'Klasör Seç',
    'tracks.download': '↓ İndir',
    'tracks.transfer': '→ Aktar',
    'tracks.selected': '{n} şarkı seçildi',
    'tracks.selectedPlural': '{n} şarkı seçildi',
    'tracks.col.number': '#',
    'tracks.col.title': 'Şarkı',
    'tracks.col.artist': 'Sanatçı',
    'tracks.col.duration': 'Süre',
    'tracks.trackCount': '{n} şarkı',
    'download.title': 'İndirme',
    'download.preparing': 'Hazırlanıyor...',
    'download.initMessage': 'Hazırlanıyor...',
    'download.initSub': 'Bu işlem yalnızca ilk çalıştırmada gerçekleşir.',
    'download.openFolder': '📂 Klasörü Aç',
    'download.progress': '{done} / {total} tamamlandı',
    'download.doneAll': '{n} şarkı indirildi!',
    'download.doneErrors': '{ok} başarılı, {err} hatalı',
    'download.waiting': 'Bekliyor...',
    'download.searching': 'Aranıyor...',
    'download.done': 'Tamamlandı!',
    'download.downloading': 'İndiriliyor... {pct}%',
    'download.converting': "MP3'e dönüştürülüyor…",
    'profile.linkedAccounts': 'Bağlı Hesaplar',
    'profile.editCredentials': 'Kimlik Bilgilerini Düzenle',
    'profile.refreshPlaylists': 'Playlistleri Yenile',
    'profile.reconnectSpotify': 'Spotify’ı Yeniden Bağla',
    'accounts.ytRedirectHint': 'Google Cloud Console’da Authorized redirect URIs listesine <strong>http://127.0.0.1:8889/callback</strong> ekleyin.',
    'accounts.title': 'Bağlı Hesaplar',
    'accounts.subtitle': 'YouTube hesabınızı bağlayarak playlist aktarın',
    'accounts.notConnected': 'Bağlı değil',
    'accounts.connect': 'Bağla',
    'accounts.disconnect': 'Bağlantıyı Kes',
    'accounts.connected': 'Bağlandı',
    'accounts.connectFailed': 'Bağlantı başarısız',
    'accounts.disconnected': 'Bağlantı kesildi',
    'accounts.logs': 'Geçmiş',
    'accounts.logsTitle': 'Aktarım Geçmişi',
    'accounts.logsEmpty': 'Henüz aktarım yapılmadı.',
    'accounts.logsAdded': '{added}/{total} şarkı eklendi',
    'accounts.youtubeMissingCreds': 'YouTube kimlik bilgileri eksik. Ayarlar → Kimlik Bilgilerini Düzenle.',
    'spotify.notConnectedTracks': 'Spotify izinlerinin yenilenmesi gerekiyor. Lütfen yeniden bağlanın.',
    'spotify.playlistForbidden': 'Spotify bu playliste erişimi reddetti (403). Genellikle bu, playlist’in Spotify’a ait olması (ör. Discover Weekly) veya uygulamanızın Development Mode’da olup hesabın User Management listesinde olmaması anlamına gelir.',
    'spotify.loginRequired': 'Devam etmek için Spotify girişi gereklidir.',
    'transfer.title': 'Playlist Aktar',
    'transfer.playlistName': 'Playlist Adı',
    'transfer.description': 'Açıklama (isteğe bağlı)',
    'transfer.privacy': 'Gizlilik',
    'transfer.private': 'Özel',
    'transfer.unlisted': 'Listelenmemiş',
    'transfer.public': 'Herkese Açık',
    'transfer.start': 'Aktar',
    'transfer.progressTitle': 'Aktarılıyor...',
    'transfer.openYT': "YouTube'da Aç",
    'transfer.pending': 'Bekliyor...',
    'transfer.added': 'Eklendi',
    'transfer.notFound': 'Bulunamadı',
    'settings.title': 'Ayarlar',
    'settings.language': 'Dil',
    'offline.title': 'İnternet Bağlantısı Yok',
    'offline.sub': 'İnternet bağlantınızı kontrol edip uygulamayı yeniden başlatın.',
    'offline.retry': 'Tekrar Dene',
  },
};

let currentLang = 'en';

function t(key, vars) {
  let str = (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) ||
            (TRANSLATIONS.en[key]) || key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
    });
  }
  return str;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    el.innerHTML = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
}

function setLang(lang) {
  currentLang = lang;
  window.api.savePreferences({ language: lang }).catch(() => {});
  applyTranslations();
  updateAllDynamic();
  document.querySelectorAll('.btn-lang').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

const state = {
  playlists: [],
  currentPlaylist: null,
  tracks: [],
  selectedTrackIds: new Set(),
  downloadDir: null,
  sortBy: null,
  sortDir: 'asc',
  linkedAccounts: {},
  spotifyConnected: false,
  tracksCache: new Map(),
};

const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};

const VIEW_DEPTH = { 'view-setup': 0, 'view-home': 1, 'view-tracks': 2, 'view-download': 3, 'view-accounts': 1 };
const VIEW_ANIM_DUR = 220;

function showView(id) {
  const next = $(id);
  const current = document.querySelector('.view:not(.hidden)');

  if (!current || current === next) {
    document.querySelectorAll('.view').forEach((v) => v.classList.add('hidden'));
    next.classList.remove('hidden');
    return;
  }

  const dir = (VIEW_DEPTH[id] ?? 1) >= (VIEW_DEPTH[current.id] ?? 1) ? 1 : -1;
  const exitCls  = `anim-view-exit-${dir > 0 ? 'left' : 'right'}`;
  const enterCls = `anim-view-enter-${dir > 0 ? 'right' : 'left'}`;

  document.querySelectorAll('.view').forEach((v) => {
    if (v !== current && v !== next) v.classList.add('hidden');
  });

  current.classList.add(exitCls);
  next.classList.remove('hidden');
  next.classList.add(enterCls);

  setTimeout(() => {
    current.classList.add('hidden');
    current.classList.remove(exitCls);
    next.classList.remove(enterCls);
  }, VIEW_ANIM_DUR);
}

function showError(elemId, msg) {
  const e = $(elemId);
  e.textContent = msg;
  e.classList.remove('hidden');
}

function hideError(elemId) {
  $(elemId).classList.add('hidden');
}

function msToTime(ms) {
  if (!ms) return '--:--';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showSkeletonPlaylists(count = 8) {
  const grid = $('playlists-grid');
  grid.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const card = el('div', 'playlist-card skeleton');
    card.innerHTML = `
      <div class="skeleton-cover"></div>
      <div class="playlist-card-body">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>`;
    grid.appendChild(card);
  }
}

function showToast(message, type = 'success') {
  const container = $('toast-container');
  if (!container) return;
  const toast = el('div', `toast toast-${type}`);
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast-show'));
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function updateAllDynamic() {
  updateDownloadBar();
  document.querySelectorAll('.playlist-card-meta[data-track-count]').forEach((node) => {
    node.textContent = t('tracks.trackCount', { n: node.dataset.trackCount });
  });
}

function adaptPlaylist(row) {
  return {
    id: row.spotifyPlaylistId,
    name: row.name,
    description: row.description || '',
    images: row.imageUrl ? [{ url: row.imageUrl }] : [],
    tracks: { total: row.trackCount },
    owner: { display_name: row.ownerName || '' },
  };
}

function initSetupView() {
  $('btn-setup-save').addEventListener('click', async () => {
    const ytId     = $('setup-yt-id').value.trim();
    const ytSecret = $('setup-yt-secret').value;
    const spId     = $('setup-sp-id').value.trim();
    const spSecret = $('setup-sp-secret').value;

    hideError('setup-error');
    if (!ytId || !ytSecret || !spId || !spSecret) {
      showError('setup-error', t('setup.error.required'));
      return;
    }

    const btn = $('btn-setup-save');
    btn.disabled = true;
    try {
      await window.api.setupSaveCredentials({
        ytClientId: ytId,
        ytClientSecret: ytSecret,
        spotifyClientId: spId,
        spotifyClientSecret: spSecret,
      });
      $('setup-yt-secret').value = '';
      $('setup-sp-secret').value = '';
      try {
        await window.api.spotifyConnect();
        state.spotifyConnected = true;
      } catch (err) {
        const msg = (err && err.message) || '';
        showError('setup-error', /SPOTIFY_LOGIN_CANCELLED/.test(msg) ? t('spotify.loginRequired') : (msg || t('accounts.connectFailed')));
        return;
      }
      await loadHomeView();
    } catch (err) {
      showError('setup-error', (err && err.message) || t('setup.error.save'));
    } finally {
      btn.disabled = false;
    }
  });
}

function openCredentialsModal() {
  $('cred-yt-id').value     = '';
  $('cred-yt-secret').value = '';
  $('cred-sp-id').value     = '';
  $('cred-sp-secret').value = '';
  hideError('cred-error');
  window.api.setupGetCredentials().then((c) => {
    $('cred-yt-id').value     = c.ytClientId || '';
    $('cred-yt-secret').value = c.ytClientSecret || '';
    $('cred-sp-id').value     = c.spotifyClientId || '';
    $('cred-sp-secret').value = c.spotifyClientSecret || '';
  }).catch(() => {});
  $('modal-credentials').classList.remove('hidden');
}

function closeCredentialsModal() {
  $('modal-credentials').classList.add('hidden');
}

function initCredentialsModal() {
  const overlay = $('modal-credentials');
  $('btn-credentials-close').addEventListener('click', closeCredentialsModal);
  $('btn-credentials-cancel').addEventListener('click', closeCredentialsModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCredentialsModal(); });

  $('btn-credentials-save').addEventListener('click', async () => {
    hideError('cred-error');
    const ytId     = $('cred-yt-id').value.trim();
    const ytSecret = $('cred-yt-secret').value;
    const spId     = $('cred-sp-id').value.trim();
    const spSecret = $('cred-sp-secret').value;
    if (!ytId || !ytSecret || !spId || !spSecret) {
      showError('cred-error', t('setup.error.required'));
      return;
    }
    const btn = $('btn-credentials-save');
    btn.disabled = true;
    try {
      await window.api.setupSaveCredentials({
        ytClientId: ytId,
        ytClientSecret: ytSecret,
        spotifyClientId: spId,
        spotifyClientSecret: spSecret,
      });
      showToast(t('credentials.saved'));
      closeCredentialsModal();
    } catch (err) {
      showError('cred-error', (err && err.message) || t('setup.error.save'));
    } finally {
      btn.disabled = false;
    }
  });
}

async function loadHomeView() {
  showView('view-home');
  $('playlists-loading').classList.add('hidden');
  const searchInput = $('search-playlists');
  if (searchInput) searchInput.value = '';
  showSkeletonPlaylists();

  try {
    const playlists = await window.api.playlistsList();
    state.playlists = (Array.isArray(playlists) ? playlists : []).map(adaptPlaylist);
    state.spotifyConnected = true;
    renderPlaylists(state.playlists);

    window.api.getLinkedAccounts().then((linked) => {
      state.linkedAccounts = linked || {};
      updateDownloadBar();

      if (state.linkedAccounts.youtube) {
        window.api.youtubeVerifyToken().then((result) => {
          if (!result.valid) {
            delete state.linkedAccounts.youtube;
            updateDownloadBar();
            updateYtCardUI();
          }
        }).catch(() => {});
      }
    }).catch(() => {});
  } catch (err) {
    const msg = (err && err.message) || '';
    if (/SPOTIFY_NOT_CONNECTED/.test(msg)) {
      $('playlists-grid').innerHTML =
        `<div style="padding:32px;text-align:center">
           <p style="color:var(--text-secondary);margin-bottom:16px">${escHtml(t('spotify.notConnectedTracks'))}</p>
           <button id="btn-home-connect-sp" class="btn-primary">${escHtml(t('accounts.connect'))}</button>
         </div>`;
      const btn = $('btn-home-connect-sp');
      if (btn) btn.addEventListener('click', async () => {
        const ok = await ensureSpotifyConnected();
        if (ok) loadHomeView();
      });
    } else {
      $('playlists-grid').innerHTML =
        `<p style="color:var(--error);padding:24px 0">Error: ${escHtml(msg)}</p>`;
    }
  } finally {
    $('playlists-loading').classList.add('hidden');
  }
}

let _ctxMenuEl = null;
function hidePlaylistContextMenu() {
  if (_ctxMenuEl && _ctxMenuEl.parentNode) {
    _ctxMenuEl.parentNode.removeChild(_ctxMenuEl);
  }
  _ctxMenuEl = null;
}

function showPlaylistContextMenu(x, y, playlist) {
  hidePlaylistContextMenu();
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.innerHTML = `
    <div class="context-menu-item danger" data-action="remove">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path><path d="M14 11v6"></path>
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
      </svg>
      <span>${t('home.removePlaylist')}</span>
    </div>`;
  document.body.appendChild(menu);
  const rect = menu.getBoundingClientRect();
  const left = Math.min(x, window.innerWidth  - rect.width  - 6);
  const top  = Math.min(y, window.innerHeight - rect.height - 6);
  menu.style.left = `${left}px`;
  menu.style.top  = `${top}px`;
  _ctxMenuEl = menu;

  menu.querySelector('[data-action="remove"]').addEventListener('click', async () => {
    hidePlaylistContextMenu();
    if (!confirm(t('home.confirmRemove', { name: playlist.name || '' }))) return;
    try {
      await window.api.playlistsRemove(playlist.id);
      state.playlists = state.playlists.filter((p) => p.id !== playlist.id);
      renderPlaylists(state.playlists);
      showToast(t('home.playlistRemoved'));
    } catch (err) {
      showToast(err.message || t('home.removeFailed'), 'error');
    }
  });
}

document.addEventListener('click', (e) => {
  if (_ctxMenuEl && _ctxMenuEl.contains(e.target)) return;
  hidePlaylistContextMenu();
});
document.addEventListener('scroll',    hidePlaylistContextMenu, true);
window.addEventListener('blur',        hidePlaylistContextMenu);

document.addEventListener('contextmenu', (e) => {
  const card = e.target.closest && e.target.closest('.playlist-card:not(.skeleton)');
  if (!card) {
    hidePlaylistContextMenu();
    return;
  }
  e.preventDefault();
  e.stopPropagation();
  const id = card.dataset.playlistId;
  const pl = (state.playlists || []).find((p) => p.id === id);
  if (pl) showPlaylistContextMenu(e.clientX, e.clientY, pl);
}, true);

function renderPlaylists(playlists) {
  const grid = $('playlists-grid');
  grid.innerHTML = '';

  const countBadge = $('playlists-count');
  if (countBadge) {
    countBadge.textContent = playlists.length;
    countBadge.classList.toggle('hidden', playlists.length === 0);
  }

  if (!playlists.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="64" height="64">
          <path d="M9 18V5l12-2v13"></path>
          <circle cx="6" cy="18" r="3"></circle>
          <circle cx="18" cy="16" r="3"></circle>
        </svg>
        <p>${t('home.noPlaylists')}</p>
      </div>`;
    return;
  }

  playlists.forEach((pl) => {
    const imgUrl = pl.images && pl.images[0] ? pl.images[0].url : null;
    const total = (pl.tracks && pl.tracks.total != null) ? pl.tracks.total : null;
    const totalDisplay = total !== null ? total : '…';

    const card = el('div', 'playlist-card');
    card.dataset.playlistId = pl.id;
    card.innerHTML = `
      <div class="playlist-cover-wrap">
        ${imgUrl
          ? `<img class="playlist-cover" src="${imgUrl}" alt="${escHtml(pl.name)}" loading="lazy" />`
          : `<div class="playlist-cover-placeholder">
               <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                 <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
               </svg>
             </div>`}
        <button class="playlist-play-btn" tabindex="-1" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="#000" width="20" height="20"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="playlist-card-body">
        <div class="playlist-card-name">${escHtml(pl.name)}</div>
        <div class="playlist-card-meta" data-track-count="${totalDisplay}">${total !== null ? t('tracks.trackCount', { n: total }) : totalDisplay}</div>
      </div>`;

    if (imgUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = canvas.height = 4;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, 4, 4);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          card.style.setProperty('--card-glow', `rgba(${r},${g},${b},0.55)`);
          card.style.setProperty('--shadow-color', `${r},${g},${b}`);
        } catch (_) {}
      };
      img.src = imgUrl;
    }

    card.addEventListener('click', () => loadTracksView(pl));
    grid.appendChild(card);
  });
}

async function loadTracksView(playlist) {
  state.currentPlaylist = playlist;
  state.tracks = [];
  state.selectedTrackIds = new Set();
  state.sortBy = null;
  state.sortDir = 'asc';

  const imgUrl = playlist.images && playlist.images[0] ? playlist.images[0].url : '';
  $('track-playlist-img').src = imgUrl;
  $('track-playlist-img').style.display = imgUrl ? '' : 'none';

  const heroEl = $('tracks-hero');
  if (heroEl) {
    if (imgUrl) {
      $('tracks-hero-bg').src = imgUrl;
      heroEl.classList.remove('hidden');
    } else {
      heroEl.classList.add('hidden');
    }
  }
  $('track-playlist-name').textContent = playlist.name;
  const trackTotal = (playlist.tracks && playlist.tracks.total != null) ? playlist.tracks.total : '…';
  $('track-playlist-meta').textContent = t('tracks.trackCount', { n: trackTotal });

  showView('view-tracks');
  $('tracks-loading').classList.remove('hidden');
  $('tracks-list').innerHTML = '';
  $('download-bar').classList.add('hidden');

  if (state.tracksCache.has(playlist.id)) {
    const cached = state.tracksCache.get(playlist.id);
    state.tracks = cached;
    $('tracks-loading').classList.add('hidden');
    $('track-playlist-meta').textContent = t('tracks.trackCount', { n: cached.length });
    renderTracks(cached);
    return;
  }

  try {
    const tracks = await window.api.playlistsTracks(playlist.id);
    state.tracks = tracks;
    state.spotifyConnected = true;
    $('tracks-loading').classList.add('hidden');
    const realCount = tracks.length;
    $('track-playlist-meta').textContent = t('tracks.trackCount', { n: realCount });
    state.tracksCache.set(playlist.id, tracks);
    const card = document.querySelector(`.playlist-card[data-playlist-id="${escHtml(playlist.id)}"]`);
    if (card) {
      const meta = card.querySelector('.playlist-card-meta');
      if (meta) {
        meta.dataset.trackCount = String(realCount);
        meta.textContent = t('tracks.trackCount', { n: realCount });
      }
    }
    const pl = state.playlists.find((p) => p.id === playlist.id);
    if (pl) {
      if (!pl.tracks) pl.tracks = {};
      pl.tracks.total = realCount;
    }
    renderTracks(tracks);
  } catch (err) {
    $('tracks-loading').classList.add('hidden');
    const errMsg = (err && err.message) || '';
    if (/SPOTIFY_NOT_CONNECTED/.test(errMsg)) {
      state.spotifyConnected = false;
      $('tracks-list').innerHTML =
        `<div style="padding:32px;text-align:center">
           <p style="color:var(--text-secondary);margin-bottom:16px">${escHtml(t('spotify.notConnectedTracks'))}</p>
           <button id="btn-tracks-connect-sp" class="btn-primary">${escHtml(t('accounts.connect'))}</button>
         </div>`;
      const btn = $('btn-tracks-connect-sp');
      if (btn) btn.addEventListener('click', async () => {
        const ok = await ensureSpotifyConnected();
        if (ok) loadTracksView(playlist);
      });
      return;
    }
    if (/SPOTIFY_PLAYLIST_FORBIDDEN/.test(errMsg)) {
      $('tracks-list').innerHTML =
        `<p style="color:var(--text-sub);padding:32px;text-align:center">${escHtml(t('spotify.playlistForbidden'))}</p>`;
      return;
    }
    $('tracks-list').innerHTML = `<p style="color:var(--error);padding:24px 32px">Error: ${escHtml(errMsg)}</p>`;
  }
}

function getSortedTracks(tracks) {
  if (!state.sortBy) return tracks;
  return [...tracks].sort((a, b) => {
    let va, vb;
    if (state.sortBy === 'name') {
      va = (a.name || '').toLowerCase();
      vb = (b.name || '').toLowerCase();
    } else if (state.sortBy === 'artist') {
      va = ((a.artists || [])[0] || {}).name || '';
      vb = ((b.artists || [])[0] || {}).name || '';
      va = va.toLowerCase(); vb = vb.toLowerCase();
    } else if (state.sortBy === 'duration') {
      va = a.duration_ms || 0;
      vb = b.duration_ms || 0;
    }
    if (va < vb) return state.sortDir === 'asc' ? -1 : 1;
    if (va > vb) return state.sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

function makeSortHeader(col, label, style = '') {
  const active = state.sortBy === col;
  const arrow = active ? (state.sortDir === 'asc' ? ' ▲' : ' ▼') : '';
  return `<span class="sort-col${active ? ' sort-active' : ''}" data-sort="${col}" style="${style}">${label}${arrow}</span>`;
}

function renderTracks(tracks) {
  const list = $('tracks-list');
  list.innerHTML = '';

  const header = el('div', 'track-list-header');
  header.innerHTML = `
    <span></span>
    <span style="text-align:right;padding-right:16px">${t('tracks.col.number')}</span>
    <span></span>
    ${makeSortHeader('name', t('tracks.col.title'))}
    ${makeSortHeader('artist', t('tracks.col.artist'))}
    ${makeSortHeader('duration', t('tracks.col.duration'), 'text-align:right')}
    <span></span>`;
  header.querySelectorAll('.sort-col').forEach((span) => {
    span.addEventListener('click', () => {
      const col = span.dataset.sort;
      if (state.sortBy === col) {
        state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        state.sortBy = col;
        state.sortDir = 'asc';
      }
      renderTracks(state.tracks);
    });
  });
  list.appendChild(header);

  const displayTracks = getSortedTracks(tracks);

  displayTracks.forEach((track, i) => {
    const row = el('div', 'track-row');
    row.dataset.id = track.id;
    row.style.animationDelay = `${Math.min(i * 18, 360)}ms`;

    const checked = state.selectedTrackIds.has(track.id);
    if (checked) row.classList.add('selected');

    const artistNames = (track.artists || []).map((a) => a.name).join(', ');
    const imgs = track.album && track.album.images;
    const artUrl = imgs && imgs.length ? imgs[imgs.length - 1].url : '';

    row.innerHTML = `
      <input type="checkbox" class="track-checkbox" ${checked ? 'checked' : ''} />
      <span class="track-num">${i + 1}</span>
      ${artUrl
        ? `<img class="track-art" src="${escHtml(artUrl)}" alt="" loading="lazy" />`
        : `<div class="track-art"></div>`}
      <div class="track-info">
        <div class="track-name" title="${escHtml(track.name)}">${escHtml(track.name)}</div>
      </div>
      <div class="track-info">
        <div class="track-artist" title="${escHtml(artistNames)}">${escHtml(artistNames)}</div>
      </div>
      <span class="track-duration">${msToTime(track.duration_ms)}</span>
      <button class="track-dl-btn" data-tooltip="${currentLang === 'tr' ? 'İndir' : 'Download'}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
             stroke-linecap="round" stroke-linejoin="round" width="15" height="15">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </button>`;

    const checkbox = row.querySelector('.track-checkbox');

    checkbox.addEventListener('change', (e) => {
      e.stopPropagation();
      toggleTrackSelection(track.id, row, checkbox.checked);
    });

    row.addEventListener('click', (e) => {
      if (e.target === checkbox) return;
      const nowChecked = !checkbox.checked;
      checkbox.checked = nowChecked;
      toggleTrackSelection(track.id, row, nowChecked);
    });

    row.querySelector('.track-dl-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      if (!state.downloadDir) {
        const folder = await window.api.selectFolder();
        if (!folder) return;
        state.downloadDir = folder;
        updateDownloadBar();
      }
      startDownload([track]);
    });

    list.appendChild(row);
  });

  updateDownloadBar();
}

function toggleTrackSelection(trackId, row, selected) {
  if (selected) {
    state.selectedTrackIds.add(trackId);
    row.classList.add('selected');
  } else {
    state.selectedTrackIds.delete(trackId);
    row.classList.remove('selected');
  }
  updateDownloadBar();
}

function updateDownloadBar() {
  const count = state.selectedTrackIds.size;
  const bar = $('download-bar');

  if (!bar) return;

  if (count > 0) {
    bar.classList.remove('hidden');
    const key = count === 1 ? 'tracks.selected' : 'tracks.selectedPlural';
    $('download-bar-count').textContent = t(key, { n: count });
    $('btn-start-download').disabled = !state.downloadDir;
    const transferBtn = $('btn-start-transfer');
    if (transferBtn) {
      const hasYT = !!(state.linkedAccounts && state.linkedAccounts.youtube);
      transferBtn.disabled = !hasYT;
      if (!hasYT) {
        transferBtn.dataset.tooltip = currentLang === 'tr' ? 'Önce YouTube\'u bağlayın' : 'Connect YouTube first';
      } else {
        delete transferBtn.dataset.tooltip;
      }
    }
  } else {
    bar.classList.add('hidden');
  }

  if (state.downloadDir) {
    const parts = state.downloadDir.replace(/\\/g, '/').split('/');
    $('btn-select-folder-text').textContent = parts[parts.length - 1] || state.downloadDir;
  } else {
    $('btn-select-folder-text').textContent = t('tracks.selectFolder');
  }
}

function initTracksView() {
  $('btn-back-home').addEventListener('click', () => loadHomeView());

  $('btn-select-all').addEventListener('click', () => {
    state.tracks.forEach((tr) => state.selectedTrackIds.add(tr.id));
    $('tracks-list').querySelectorAll('.track-row').forEach((row) => {
      row.classList.add('selected');
      row.querySelector('.track-checkbox').checked = true;
    });
    updateDownloadBar();
  });

  $('btn-deselect-all').addEventListener('click', () => {
    state.selectedTrackIds.clear();
    $('tracks-list').querySelectorAll('.track-row').forEach((row) => {
      row.classList.remove('selected');
      row.querySelector('.track-checkbox').checked = false;
    });
    updateDownloadBar();
  });

  $('btn-select-folder').addEventListener('click', async () => {
    const folder = await window.api.selectFolder();
    if (folder) {
      state.downloadDir = folder;
      window.api.savePreferences({ downloadDir: folder }).catch(() => {});
      updateDownloadBar();
    }
  });

  $('btn-start-download').addEventListener('click', () => {
    if (!state.downloadDir || state.selectedTrackIds.size === 0) return;
    const selected = state.tracks.filter((tr) => state.selectedTrackIds.has(tr.id));
    startDownload(selected);
  });

  $('btn-start-transfer').addEventListener('click', () => {
    if (state.selectedTrackIds.size === 0) return;
    openTransferModal();
  });
}

async function startDownload(tracks) {
  const list = $('download-list');
  list.innerHTML = '';

  tracks.forEach((tr) => {
    const row = el('div', 'dl-row');
    row.id = `dl-row-${tr.id}`;
    row.innerHTML = `
      <div class="dl-status-icon searching">
        <div class="mini-spinner"></div>
      </div>
      <div class="dl-info">
        <div class="dl-track-name">${escHtml(tr.name)}</div>
        <div class="dl-message">${t('download.waiting')}</div>
        <div class="dl-progress hidden"><div class="dl-progress-fill"></div></div>
      </div>`;
    list.appendChild(row);
  });

  $('dl-summary').textContent = t('download.progress', { done: 0, total: tracks.length });
  $('download-done-bar').classList.add('hidden');
  $('btn-back-tracks').disabled = true;

  showView('view-download');

  const initOverlay = $('init-overlay');

  try {
    $('init-message').textContent = t('download.initMessage');
    initOverlay.classList.remove('hidden');
    await window.api.initDownloader();
  } catch (err) {
    initOverlay.classList.add('hidden');
    list.innerHTML = `<p style="color:var(--error);padding:24px">${escHtml(err.message)}</p>`;
    $('btn-back-tracks').disabled = false;
    return;
  }

  initOverlay.classList.add('hidden');
  window.api.removeAllListeners('downloader:initProgress');

  let doneCount = 0;

  window.api.onDownloadProgress((data) => {
    const row = $(`dl-row-${data.trackId}`);
    if (!row) return;

    const iconEl = row.querySelector('.dl-status-icon');
    const msgEl = row.querySelector('.dl-message');

    row.className = `dl-row ${data.status}`;
    const progressEl = row.querySelector('.dl-progress');
    const progressFill = progressEl && progressEl.querySelector('.dl-progress-fill');

    if (data.status === 'downloading' && data.message && data.message.startsWith('%')) {
      const pct = parseInt(data.message.slice(1), 10);
      msgEl.textContent = t('download.downloading', { pct });
      if (progressEl) progressEl.classList.remove('hidden');
      if (progressFill) progressFill.style.width = pct + '%';
    } else if (data.status === 'converting') {
      msgEl.textContent = t('download.converting');
      if (progressEl) progressEl.classList.remove('hidden');
      if (progressFill) progressFill.style.width = '100%';
    } else if (data.status === 'searching') {
      msgEl.textContent = t('download.searching');
      if (progressEl) progressEl.classList.add('hidden');
    } else if (data.status === 'done') {
      msgEl.textContent = t('download.done');
      if (progressEl) progressEl.classList.add('hidden');
    } else {
      msgEl.textContent = data.message || '';
      if (progressEl) progressEl.classList.add('hidden');
    }

    if (data.status === 'done' || data.status === 'error') {
      iconEl.className = `dl-status-icon ${data.status}`;
      iconEl.textContent = data.status === 'done' ? '✓' : '✕';
      doneCount++;
      $('dl-summary').textContent = t('download.progress', { done: doneCount, total: tracks.length });

      if (doneCount === tracks.length) {
        showDownloadDoneBar(tracks.length);
        window.api.removeAllListeners('download:progress');
        $('btn-back-tracks').disabled = false;
      }
    } else {
      iconEl.className = `dl-status-icon ${data.status}`;
      iconEl.innerHTML = '<div class="mini-spinner"></div>';
    }
  });

  try {
    await window.api.downloadTracks({
      tracks,
      outputDir: state.downloadDir,
    });
  } catch (err) {
    console.error('Download batch error:', err);
  }
}

function showDownloadDoneBar(total) {
  const bar = $('download-done-bar');
  const errors = $('download-list').querySelectorAll('.dl-row.error').length;
  const success = total - errors;
  const msg = errors > 0
    ? t('download.doneErrors', { ok: success, err: errors })
    : t('download.doneAll', { n: success });
  $('dl-done-text').textContent = msg;
  showToast(msg, errors > 0 ? 'warning' : 'success');
  bar.classList.remove('hidden');
}

function initDownloadView() {
  $('btn-back-tracks').addEventListener('click', () => {
    window.api.removeAllListeners('download:progress');
    showView('view-tracks');
  });

  $('btn-done').addEventListener('click', () => {
    window.api.removeAllListeners('download:progress');
    loadHomeView();
  });

  $('btn-open-folder').addEventListener('click', () => {
    if (state.downloadDir) window.api.openFolder(state.downloadDir);
  });
}

function initLangSwitcher() {
  document.querySelectorAll('.btn-lang').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}

function initAccountsView() {
  updateYtCardUI();

  $('btn-yt-connect').addEventListener('click', async () => {
    $('btn-yt-connect').disabled = true;
    try {
      const result = await window.api.youtubeConnect();
      if (result && result.channelTitle) {
        state.linkedAccounts.youtube = result;
        updateYtCardUI();
        updateDownloadBar();
        showToast(t('accounts.connected'));
      }
    } catch (err) {
      const msg = (err && err.message) || '';
      if (/YOUTUBE_CREDENTIALS_MISSING/.test(msg)) {
        showToast(t('accounts.youtubeMissingCreds'), 'error');
      } else if (/redirect_uri_mismatch/.test(msg)) {
        showToast(t('accounts.ytRedirectHint'), 'error');
      } else {
        showToast(msg || t('accounts.connectFailed'), 'error');
      }
    } finally {
      $('btn-yt-connect').disabled = false;
    }
  });

  $('btn-yt-disconnect').addEventListener('click', async () => {
    await window.api.removeLinkedAccount({ platform: 'youtube' });
    delete state.linkedAccounts.youtube;
    updateYtCardUI();
    updateDownloadBar();
    showToast(t('accounts.disconnected'));
  });

  $('btn-yt-logs').addEventListener('click', () => openTransferLogsModal());

  $('btn-back-accounts').addEventListener('click', () => showView('view-home'));
}

function updateSpCardUI() {
  const connected = !!state.spotifyConnected;
  const statusEl     = $('sp-account-status');
  const connectBtn   = $('btn-sp-connect');
  const disconnectBtn = $('btn-sp-disconnect');
  if (statusEl) {
    statusEl.textContent = connected ? t('accounts.connected') : t('accounts.notConnected');
    statusEl.classList.toggle('connected', connected);
  }
  if (connectBtn)    connectBtn.classList.toggle('hidden', connected);
  if (disconnectBtn) disconnectBtn.classList.toggle('hidden', !connected);
}

async function ensureSpotifyConnected() {
  try {
    const s = await window.api.spotifyStatus();
    if (s && s.connected) {
      state.spotifyConnected = true;
      return true;
    }
    await window.api.spotifyConnect();
    state.spotifyConnected = true;
    updateSpCardUI();
    showToast(t('accounts.connected'));
    return true;
  } catch (err) {
    const msg = (err && err.message) || '';
    if (/SPOTIFY_LOGIN_CANCELLED/.test(msg)) return false;
    showToast(msg || t('accounts.connectFailed'), 'error');
    return false;
  }
}

function updateYtCardUI() {
  const yt = state.linkedAccounts && state.linkedAccounts.youtube;
  const statusEl = $('yt-account-status');
  const connectBtn = $('btn-yt-connect');
  const disconnectBtn = $('btn-yt-disconnect');
  const logsBtn = $('btn-yt-logs');
  const thumbEl = $('yt-channel-thumb');
  const iconEl = $('yt-platform-icon');
  if (yt) {
    if (statusEl) {
      statusEl.textContent = yt.channelTitle || t('accounts.connected');
      statusEl.classList.add('connected');
    }
    if (connectBtn) connectBtn.classList.add('hidden');
    if (disconnectBtn) disconnectBtn.classList.remove('hidden');
    if (logsBtn) logsBtn.classList.remove('hidden');
    if (thumbEl && yt.thumbnail) {
      thumbEl.src = yt.thumbnail;
      thumbEl.classList.remove('hidden');
      if (iconEl) iconEl.classList.add('hidden');
    }
  } else {
    if (statusEl) {
      statusEl.textContent = t('accounts.notConnected');
      statusEl.classList.remove('connected');
    }
    if (connectBtn) connectBtn.classList.remove('hidden');
    if (disconnectBtn) disconnectBtn.classList.add('hidden');
    if (logsBtn) logsBtn.classList.add('hidden');
    if (thumbEl) thumbEl.classList.add('hidden');
    if (iconEl) iconEl.classList.remove('hidden');
  }
}

async function openTransferLogsModal() {
  $('modal-transfer-logs').classList.remove('hidden');
  const list = $('transfer-logs-list');
  const emptyEl = $('transfer-logs-empty');
  list.innerHTML = '';
  if (emptyEl) emptyEl.classList.add('hidden');

  try {
    const logs = await window.api.youtubeGetLogs();
    if (!logs || logs.length === 0) {
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    }
    logs.forEach((log) => {
      const date = new Date(log.transferredAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      const metaText = t('accounts.logsAdded').replace('{added}', log.addedTracks ?? '?').replace('{total}', log.totalTracks ?? '?') + ' · ' + date;
      const row = document.createElement('div');
      row.className = 'log-row';
      row.innerHTML = `
        <div class="log-row-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
        </div>
        <div class="log-row-body">
          <div class="log-row-title">${escHtml(log.playlistTitle || 'Playlist')}</div>
          <div class="log-row-meta">${escHtml(metaText)}</div>
        </div>
        ${log.playlistUrl ? `<a class="log-row-link" href="#">YouTube</a>` : ''}
      `;
      if (log.playlistUrl) {
        const link = row.querySelector('.log-row-link');
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.api.openExternal(log.playlistUrl);
        });
      }
      list.appendChild(row);
    });
  } catch (err) {
    list.innerHTML = `<p style="color:var(--error);padding:16px 0;text-align:center">${escHtml(err.message)}</p>`;
  }
}

function openTransferModal() {
  const selected = state.tracks.filter((tr) => state.selectedTrackIds.has(tr.id));
  if (!selected.length) return;

  const nameInput = $('input-transfer-name');
  if (nameInput && state.currentPlaylist) {
    nameInput.value = state.currentPlaylist.name || '';
  }
  const descInput = $('input-transfer-desc');
  if (descInput) descInput.value = '';
  const privacySelect = $('select-transfer-privacy');
  if (privacySelect) privacySelect.value = 'private';

  $('modal-transfer').classList.remove('hidden');
}

async function submitTransfer() {
  const selected = state.tracks.filter((tr) => state.selectedTrackIds.has(tr.id));
  const title = $('input-transfer-name').value.trim() || (state.currentPlaylist && state.currentPlaylist.name) || 'Playlist';
  const description = $('input-transfer-desc').value.trim();
  const privacyStatus = $('select-transfer-privacy').value || 'private';

  $('modal-transfer').classList.add('hidden');
  const progressList = $('transfer-progress-list');
  const doneRow = $('transfer-done-row');
  const doneBtn = $('btn-transfer-done');
  if (progressList) progressList.innerHTML = '';
  if (doneRow) doneRow.classList.add('hidden');
  if (doneBtn) doneBtn.disabled = true;
  $('modal-transfer-progress').classList.remove('hidden');

  selected.forEach((tr) => {
    const row = document.createElement('div');
    row.className = 'tp-row';
    row.id = `tp-${tr.id}`;
    row.innerHTML = `<span class="tp-icon pending"></span><span class="tp-name">${escHtml(tr.name)}</span><span class="tp-status">${t('transfer.pending')}</span>`;
    progressList.appendChild(row);
  });

  try {
    const result = await window.api.youtubeTransfer({
      title,
      description,
      privacyStatus,
      tracks: selected.map((tr) => ({ id: tr.id, name: tr.name, artists: tr.artists })),
    });

    if (result && result.results) {
      result.results.forEach((r) => {
        const row = $(`tp-${r.trackId}`);
        if (!row) return;
        const icon = row.querySelector('.tp-icon');
        const status = row.querySelector('.tp-status');
        if (r.success) {
          icon.className = 'tp-icon done';
          status.textContent = t('transfer.added');
        } else {
          icon.className = 'tp-icon error';
          status.textContent = t('transfer.notFound');
        }
      });
    }

    if (result && result.playlistUrl) {
      const link = $('transfer-yt-link');
      if (link) {
        link.href = result.playlistUrl;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          window.api.openExternal(result.playlistUrl);
        }, { once: true });
      }
    }
  } catch (err) {
    if (progressList) {
      const errEl = document.createElement('div');
      errEl.className = 'tp-row';
      errEl.innerHTML = `<span class="tp-icon error"></span><span class="tp-name" style="color:var(--error)">${escHtml(err.message)}</span>`;
      progressList.appendChild(errEl);
    }
  } finally {
    if (doneRow) doneRow.classList.remove('hidden');
    if (doneBtn) doneBtn.disabled = false;
  }
}

function initTransferModalListeners() {
  $('btn-modal-close').addEventListener('click', () => $('modal-transfer').classList.add('hidden'));
  $('btn-modal-cancel').addEventListener('click', () => $('modal-transfer').classList.add('hidden'));
  $('btn-transfer-start').addEventListener('click', submitTransfer);
  $('btn-transfer-done').addEventListener('click', () => $('modal-transfer-progress').classList.add('hidden'));
  $('btn-logs-close').addEventListener('click', () => $('modal-transfer-logs').classList.add('hidden'));
}

function showOfflineScreen() {
  const overlay = $('offline-overlay');
  $('offline-title').textContent = t('offline.title');
  $('offline-sub').textContent   = t('offline.sub');
  $('btn-offline-retry').textContent = t('offline.retry');
  overlay.classList.remove('hidden');

  $('btn-offline-retry').onclick = async () => {
    const online = await window.api.isOnline();
    if (online) {
      overlay.classList.add('hidden');
      continueBooting();
    }
  };
}

async function boot() {
  const prefs = await window.api.getPreferences();
  currentLang = prefs.language || 'en';
  if (prefs.downloadDir) state.downloadDir = prefs.downloadDir;

  applyTranslations();

  const online = await window.api.isOnline();
  if (!online) {
    showOfflineScreen();
    return;
  }

  continueBooting();
}

async function continueBooting() {
  initSetupView();
  initCredentialsModal();
  initTracksView();
  initDownloadView();
  initLangSwitcher();
  document.querySelectorAll('.btn-lang').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
  });
  initAccountsView();
  initTransferModalListeners();

  const searchInput = $('search-playlists');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('#playlists-grid .playlist-card:not(.skeleton)').forEach((card) => {
        const nameEl = card.querySelector('.playlist-card-name');
        card.style.display = (!q || (nameEl && nameEl.textContent.toLowerCase().includes(q))) ? '' : 'none';
      });
    });
  }

  $('profile-chip').addEventListener('click', () => {
    const dropdown = $('profile-dropdown');
    const chip = $('profile-chip');
    const isOpen = !dropdown.classList.contains('hidden');
    if (isOpen) {
      dropdown.classList.add('hidden');
      chip.classList.remove('active');
    } else {
      dropdown.classList.remove('hidden');
      chip.classList.add('active');
    }
  });

  document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.profile-chip-wrap');
    if (wrap && !wrap.contains(e.target)) {
      $('profile-dropdown').classList.add('hidden');
      $('profile-chip').classList.remove('active');
    }
  });

  $('btn-linked-accounts').addEventListener('click', () => {
    $('profile-dropdown').classList.add('hidden');
    $('profile-chip').classList.remove('active');
    updateYtCardUI();
    showView('view-accounts');
  });

  $('btn-edit-credentials').addEventListener('click', () => {
    $('profile-dropdown').classList.add('hidden');
    $('profile-chip').classList.remove('active');
    openCredentialsModal();
  });

  $('btn-sp-reconnect').addEventListener('click', async () => {
    $('profile-dropdown').classList.add('hidden');
    $('profile-chip').classList.remove('active');
    await window.api.spotifyDisconnect().catch(() => {});
    state.spotifyConnected = false;
    try {
      const result = await window.api.spotifyConnect();
      state.spotifyConnected = !!(result && result.connected);
      if (state.spotifyConnected) {
        showToast(t('accounts.connected'));
        await loadHomeView();
      }
    } catch (err) {
      const msg = (err && err.message) || '';
      if (!/SPOTIFY_LOGIN_CANCELLED/.test(msg)) {
        showToast(msg || t('accounts.connectFailed'), 'error');
      }
    }
  });

  $('btn-clear-playlists').addEventListener('click', async () => {
    $('profile-dropdown').classList.add('hidden');
    $('profile-chip').classList.remove('active');
    await loadHomeView();
  });

  const setupStatus = await window.api.setupStatus();
  if (!setupStatus.configured) {
    showView('view-setup');
    return;
  }

  const spStatus = await window.api.spotifyStatus().catch(() => ({ connected: false }));
  if (!spStatus || !spStatus.connected) {
    try {
      await window.api.spotifyConnect();
      state.spotifyConnected = true;
    } catch (err) {
      const msg = (err && err.message) || '';
      showView('view-setup');
      showError('setup-error', /SPOTIFY_LOGIN_CANCELLED/.test(msg) ? t('spotify.loginRequired') : (msg || t('accounts.connectFailed')));
      return;
    }
  } else {
    state.spotifyConnected = true;
  }

  await loadHomeView();
}

document.addEventListener('DOMContentLoaded', boot);
'use strict';
