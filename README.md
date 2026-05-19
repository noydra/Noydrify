# Noydrify

Noydrify is a desktop app that lets you mirror your Spotify playlists to YouTube and download tracks as MP3s. You bring your own API credentials — the app stores them locally and never sends them anywhere else.

## What it does

- Reads your Spotify playlists via the Spotify Web API
- Searches YouTube for each track and adds them to a YouTube playlist
- Downloads tracks as MP3 using yt-dlp and ffmpeg

## Requirements

- A Spotify Developer app (free) with `playlist-read-private` and `playlist-read-collaborative` scopes
- A Google Cloud project with the YouTube Data API v3 enabled
- Node.js 18 or later

## Setup

**1. Spotify**

Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create an app. Under the app settings, add the following Redirect URI:

```
http://127.0.0.1:8888/callback
```

Copy the Client ID and Client Secret.

**2. YouTube**

Go to the [Google Cloud Console](https://console.cloud.google.com), enable the YouTube Data API v3, and create an OAuth 2.0 client ID (Desktop app type). Under the client settings, add the following Authorized Redirect URI:

```
http://127.0.0.1:8889/callback
```

Copy the Client ID and Client Secret.

**3. Run the app**

```bash
npm install
npm start
```

On first launch you will be prompted to enter your credentials. After saving, you will go through a Spotify OAuth flow in a popup window. YouTube is connected from the Connected Accounts screen.

## Building

```bash
npm run build
```

Output goes to the `dist/` folder. Builds are configured for Windows and Linux.

## Tech

- Electron 29
- Spotify Web API (Authorization Code flow)
- YouTube Data API v3
- yt-dlp + ffmpeg for downloading

## License

MIT
