#!/usr/bin/env node
/**
 * Spotify OAuth Token Helper
 * 
 * Run with: node scripts/spotify-auth.js
 * 1. Opens Spotify Authorization in your browser.
 * 2. You log in and click "Agree".
 * 3. It captures the authorization code and exchanges it for a fresh SPOTIFY_REFRESH_TOKEN!
 */

const http = require('http');
const url = require('url');
const { exec } = require('child_process');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '911f6b5bde9f49c195a2508eae41f28f';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '05cf7c64bb024618a0caec35db406da9';
const REDIRECT_URI = 'http://localhost:8888/callback';

const SCOPES = [
  'user-read-currently-playing',
  'user-read-playback-state',
  'user-read-recently-played',
  'user-top-read',
].join(' ');

const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  response_type: 'code',
  client_id: CLIENT_ID,
  scope: SCOPES,
  redirect_uri: REDIRECT_URI,
}).toString()}`;

console.log('\n========================================');
console.log('🎵 SPOTIFY REFRESH TOKEN GENERATOR');
console.log('========================================\n');
console.log('⚠️ IMPORTANT: Make sure this Redirect URI is added in your Spotify Developer Dashboard:');
console.log(`👉 ${REDIRECT_URI}\n`);
console.log('Opening your browser to authorize with Spotify...');

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);

  if (parsed.pathname === '/callback') {
    const code = parsed.query.code;
    const error = parsed.query.error;

    if (error) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end(`<h1>Authorization Error: ${error}</h1>`);
      console.error('Authorization failed:', error);
      server.close();
      return;
    }

    if (!code) {
      res.writeHead(400, { 'Content-Type': 'text/html' });
      res.end('<h1>No code found in request</h1>');
      return;
    }

    try {
      const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
      const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      const data = await tokenRes.json();

      if (data.refresh_token) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
          <div style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h1 style="color: #1db954;">🎉 Spotify Authorization Successful!</h1>
            <p>You can close this tab and return to your terminal.</p>
          </div>
        `);

        console.log('\n✅ SUCCESS! Here are your fresh Spotify tokens:\n');
        console.log('==================================================');
        console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
        console.log('==================================================\n');
        console.log('Copy the SPOTIFY_REFRESH_TOKEN line above and paste it into your .env.local file!\n');
      } else {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Token Error</h1><pre>${JSON.stringify(data, null, 2)}</pre>`);
        console.error('Token exchange error:', data);
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/html' });
      res.end(`<h1>Server Error</h1><pre>${err.message}</pre>`);
      console.error(err);
    } finally {
      setTimeout(() => server.close(), 1000);
    }
  }
});

server.listen(8888, () => {
  // Open default browser
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} "${authUrl}"`);
});

