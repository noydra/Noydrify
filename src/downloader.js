'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const https = require('https');

let ffmpegBin;

const CACHE_DIR = path.join(os.homedir(), '.spot');
const IS_WIN = process.platform === 'win32';
const YTDLP_BIN = path.join(CACHE_DIR, IS_WIN ? 'yt-dlp.exe' : 'yt-dlp');

let ytDlpReady = false;

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const follow = (u) => {
      https
        .get(u, { headers: { 'User-Agent': 'spot-app/1.0' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            follow(res.headers.location);
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} – ${u}`));
            return;
          }
          const out = fs.createWriteStream(destPath);
          res.pipe(out);
          out.on('finish', () => out.close(resolve));
          out.on('error', reject);
        })
        .on('error', reject);
    };
    follow(url);
  });
}

async function ensureYtDlp(onStatus) {
  if (ytDlpReady) return;

  if (!ffmpegBin) {
    let raw = require('ffmpeg-static');
    if (raw && raw.includes('app.asar') && !raw.includes('unpacked')) {
      raw = raw.replace('app.asar', 'app.asar.unpacked');
    }
    ffmpegBin = raw;
  }

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }

  if (!fs.existsSync(YTDLP_BIN)) {
    if (onStatus) onStatus('');

    const releaseInfo = await new Promise((resolve, reject) => {
      https
        .get(
          'https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest',
          { headers: { 'User-Agent': 'spot-app/1.0' } },
          (res) => {
            let buf = '';
            res.on('data', (c) => (buf += c));
            res.on('end', () => {
              try { resolve(JSON.parse(buf)); } catch (e) { reject(e); }
            });
          }
        )
        .on('error', reject);
    });

    const assetName = IS_WIN ? 'yt-dlp.exe' : 'yt-dlp';
    const asset = releaseInfo.assets.find((a) => a.name === assetName);
    if (!asset) throw new Error('yt-dlp binary bulunamadı (GitHub release).');

    if (onStatus) onStatus('');
    await downloadFile(asset.browser_download_url, YTDLP_BIN);

    if (!IS_WIN) fs.chmodSync(YTDLP_BIN, '755');

    if (onStatus) onStatus('');
  }

  ytDlpReady = true;
}

function sanitizeFilename(name) {
  return name
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function msToTime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function runYtDlp(args, onProgress) {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_BIN, args);
    let stderr = '';

    proc.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      for (const line of lines) {
        if (line.includes('[download]')) {
          const match = line.match(/(\d+(?:\.\d+)?)%/);
          if (match) {
            onProgress('downloading', `%${Math.round(parseFloat(match[1]))}`);
          }
        } else if (line.includes('[ExtractAudio]') || line.includes('[ffmpeg]')) {
          onProgress('converting', '');
        }
      }
    });

    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', (err) => reject(new Error(`Process error: ${err.message}`)));
    proc.on('close', (code) => {
      if (code === 0) resolve({ ok: true });
      else resolve({ ok: false, code, stderr });
    });
  });
}

async function applyId3Tags(mp3Path, { trackName, artists, albumName, albumArtUrl }) {
  if (!ffmpegBin) return;

  const tmpMp3 = mp3Path + '.id3tmp.mp3';
  const tmpArt = albumArtUrl ? mp3Path + '.art.jpg' : null;

  try {
    if (tmpArt) {
      try { await downloadFile(albumArtUrl, tmpArt); } catch (_) {}
    }

    const hasArt = tmpArt && fs.existsSync(tmpArt);

    const args = ['-y', '-i', mp3Path];
    if (hasArt) args.push('-i', tmpArt);

    args.push('-map', '0:a:0');
    if (hasArt) {
      args.push('-map', '1:0');
      args.push('-metadata:s:v', 'title=Album cover');
      args.push('-metadata:s:v', 'comment=Cover (front)');
    }

    args.push(
      '-codec:a', 'copy',
      '-id3v2_version', '3',
      '-metadata', `title=${trackName}`,
      '-metadata', `artist=${artists}`,
    );

    if (albumName) args.push('-metadata', `album=${albumName}`);

    args.push(tmpMp3);

    await new Promise((resolve) => {
      const proc = spawn(ffmpegBin, args);
      proc.on('close', (code) => {
        if (code === 0 && fs.existsSync(tmpMp3)) {
          try { fs.renameSync(tmpMp3, mp3Path); } catch (_) {}
        } else {
          try { fs.unlinkSync(tmpMp3); } catch (_) {}
        }
        resolve();
      });
      proc.on('error', () => {
        try { fs.unlinkSync(tmpMp3); } catch (_) {}
        resolve();
      });
    });
  } finally {
    if (tmpArt) { try { fs.unlinkSync(tmpArt); } catch (_) {} }
  }
}

async function downloadTrack({ query, trackName, artists, albumName, albumArtUrl, outputDir, proxy, onProgress }) {
  await ensureYtDlp();

  const safeFilename = sanitizeFilename(`${trackName} - ${artists}`);
  const outputTemplate = path.join(outputDir, `${safeFilename}.%(ext)s`);

  const baseArgs = [
    `ytsearch1:${query}`,
    '--extract-audio',
    '--audio-format', 'mp3',
    '--audio-quality', '0',
    '--output', outputTemplate,
    '--no-playlist',
    '--newline',
    '--no-check-certificates',
    '--js-runtimes', 'node',
  ];

  if (ffmpegBin) baseArgs.push('--ffmpeg-location', ffmpegBin);
  if (proxy) baseArgs.push('--proxy', proxy);

  onProgress('downloading', '');

  const result = await runYtDlp(baseArgs, onProgress);

  if (!result.ok) {
    throw new Error('İndirme başarısız oldu. YouTube oturumu geçersiz olabilir.');
  }

  const expectedPath = path.join(outputDir, `${safeFilename}.mp3`);

  let resolvedPath = expectedPath;

  if (!fs.existsSync(expectedPath)) {
    const mp3s = fs
      .readdirSync(outputDir)
      .filter((f) => f.endsWith('.mp3'))
      .map((f) => ({ f, mtime: fs.statSync(path.join(outputDir, f)).mtimeMs }))
      .sort((a, b) => b.mtime - a.mtime);

    if (mp3s.length === 0) {
      throw new Error(`MP3 dosyası oluşturulamadı: ${trackName}`);
    }
    resolvedPath = path.join(outputDir, mp3s[0].f);
  }

  onProgress('converting', '');
  await applyId3Tags(resolvedPath, { trackName, artists, albumName, albumArtUrl });

  return resolvedPath;
}

module.exports = { downloadTrack, ensureYtDlp, msToTime };
