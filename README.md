# Sayandeep Pradhan — Developer Portfolio

A production-grade personal portfolio built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **GSAP**, featuring real-time Firebase analytics, live Spotify integration, interactive scratch cards, and an authentic 3D foldable booklet.

Live Demo: https://sayandeep0212.vercel.app/

---

## ⚡ Highlights & Key Features

* **Interactive Scratch Profile Card**:
  * Top pixel-art avatar (`/assets/avatar.webp`) can be scratched with realistic canvas physics.
  * Reaching **30% scratched area** smoothly dissolves the cover, revealing the real photograph (`/assets/sayandeep.avif`).
  * State persists in `localStorage` so returning visitors see the revealed photograph immediately without re-scratching.
* **Smart Link Preview System**:
  * High-speed website previews with a global active-link coordinator.
  * Rapidly moving cursor between links instantly dismisses past previews with zero ghosting or lingering previews.
* **Real-Time Website Analytics**:
  * Connected to Firebase Cloud Firestore collection `analytics`, document `website`.
  * Live `onSnapshot` listener updates the view counter across all active browsers simultaneously without page reloads.
* **Device Online / Offline Status**:
  * Syncs device presence via background heartbeat companion.
  * When laptop is awake, displays **Online `●`** (*Active on laptop · Available for projects*).
  * When laptop sleeps or shuts down, automatically flips to **Offline `○`** (*Away from desk · Leave a message*).
* **Live Spotify Integration**:
  * Direct queries to Spotify Web API for real-time playback.
  * Displays **`NOW PLAYING`** with dancing sound wave bars or **`RECENTLY PLAYED`** with album artwork.
* **Minimalist Foldable Booklet Modal**:
  * 3D book spread with realistic acoustic page-turn and spine thud sound effects synthesized via the Web Audio API.
* **Ultra-Fast Performance**:
  * 60–120 FPS GPU-accelerated animations (`content-visibility: auto`, `transform: translateZ(0)`).
  * Zero render-blocking remote CSS imports; preconnected Google Fonts with `font-display: swap`.
  * 100% clean hydration without browser extension attribute mismatches.

---

## 🛠️ Tech Stack

* **Framework**: Next.js 15 (App Router)
* **Language**: TypeScript 5.7 (Strict Mode)
* **Styling**: Tailwind CSS 3.4
* **Animation & Physics**: Framer Motion 12, GSAP 3.15, HTML5 Canvas
* **Database & Cloud**: Google Cloud Firestore (Firebase SDK 13)
* **APIs**: Spotify Web API, GitHub REST API, Medium API
* **Audio Synthesis**: Web Audio API (zero external audio file dependencies)
* **CI/CD**: GitHub Actions (`.github/workflows/ci-cd.yml`)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/sayandeep0212/Portfolio.git
cd Portfolio
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the template and fill in your keys:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firestore Project ID (`portfolio-2b013`) |
| `SPOTIFY_CLIENT_ID` | Spotify Developer App Client ID |
| `SPOTIFY_CLIENT_SECRET` | Spotify Developer App Client Secret |
| `SPOTIFY_REFRESH_TOKEN` | Spotify OAuth Refresh Token |
| `GITHUB_PAT` | GitHub Personal Access Token |

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your portfolio.

### 5. Production build
```bash
npm run build
npm run start
```

---

## 🔄 Background Companion Utilities

* **Laptop Online Sync**:
  ```bash
  npm run sync
  ```
* **Install Silent Background Auto-Start (Windows)**:
  ```bash
  npm run autostart
  ```
* **Spotify OAuth Token Generator**:
  ```bash
  npm run spotify:auth
  ```

---

## 📄 License & Attributions

This project is open-source under the [MIT License](LICENSE). Third-party library attributions are documented in [LICENSES.md](LICENSES.md).
