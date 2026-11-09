#!/usr/bin/env node
/**
 * Sayandeep Portfolio - Real-Time Laptop Device Companion
 * 
 * Periodically sends heartbeat to Firestore collection "analytics", document "device".
 * - When your laptop is ON and awake -> sends pulse every 20s -> Portfolio shows "Online".
 * - When your laptop shuts down or sleeps -> pulses stop -> Portfolio switches to "Offline" (after 60s)
 *   and displays the exact "Last online: [time/date]" timestamp!
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  });
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCDj368Z1jP3M9SVR-ahFNysy_KAYJnGjQ',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'portfolio-2b013.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'portfolio-2b013',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'portfolio-2b013.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '956892800374',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:956892800374:web:2ac65c0596e65738210657',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TARGET_URLS = [
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_PORTFOLIO_URL,
  'https://sayandeep0212.vercel.app',
].filter(Boolean);

async function sendPulse() {
  const now = Date.now();

  // 1. Direct Firestore update to analytics/device
  try {
    const docRef = doc(db, 'analytics', 'device');
    await setDoc(
      docRef,
      {
        lastSeen: now,
        device: 'Windows Laptop',
        platform: 'win32',
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log(`[${new Date().toLocaleTimeString()}] ✅ Laptop ONLINE heartbeat -> Firestore analytics/device (timestamp: ${now})`);
  } catch (dbErr) {
    console.error('Firestore write error:', dbErr.message);
  }

  // 2. Also notify API heartbeat endpoint
  for (const baseUrl of TARGET_URLS) {
    try {
      await fetch(`${baseUrl}/api/heartbeat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastSeen: now }),
        signal: AbortSignal.timeout(3000),
      });
    } catch {}
  }
}

// Initial pulse immediately
sendPulse();

// Repeat pulse every 20 seconds
const interval = setInterval(sendPulse, 20000);

process.on('SIGINT', () => {
  clearInterval(interval);
  process.exit(0);
});

process.on('SIGTERM', () => {
  clearInterval(interval);
  process.exit(0);
});
