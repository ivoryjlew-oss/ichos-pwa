# Ichōs PWA

The music memory platform — fully configured as a Progressive Web App.

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## File Structure

```
ichos-pwa/
├── public/
│   ├── index.html          ← Entry point with all PWA meta tags
│   ├── manifest.json       ← Web App Manifest
│   ├── service-worker.js   ← Service worker (caching, push, sync)
│   ├── offline.html        ← Offline fallback page
│   └── icons/              ← App icons (see Icon Generation below)
├── src/
│   ├── main.jsx            ← React entry point
│   ├── App.jsx             ← Root component with PWA wiring
│   ├── usePWA.js           ← PWA hook (install, push, online, updates)
│   └── PWAComponents.jsx   ← InstallBanner, UpdateToast, OfflineBanner, PushPrompt
├── package.json
└── vite.config.js          ← Vite + PWA plugin config
```

---

## Integrating Your App

Replace the `IchosPlaceholder` in `src/App.jsx` with your actual app:

```jsx
// src/App.jsx
import IchosMain from './IchosMain.jsx' // your full app

// Replace <IchosPlaceholder pwa={pwa} /> with:
<IchosMain />
```

The PWA layer (install banner, offline indicator, push prompt, update toast)
wraps around your app automatically.

---

## Icon Generation

You need icons at these sizes: 16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512.

**Option A — PWABuilder** (easiest)
1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload a 512×512 PNG of the Ichōs logo
3. Download the generated icon pack
4. Place icons in `public/icons/`

**Option B — Sharp (Node.js)**
```bash
npm install sharp --save-dev
```
Then create `scripts/generate-icons.js`:
```js
import sharp from 'sharp'
const sizes = [16,32,72,96,128,144,152,180,192,384,512]
for (const size of sizes) {
  await sharp('src/assets/logo-source.png')
    .resize(size, size)
    .toFile(`public/icons/icon-${size}.png`)
}
```
Run with `npm run icons`.

**Required icon files:**
```
public/icons/
├── icon-16.png
├── icon-32.png
├── icon-72.png
├── icon-96.png
├── icon-128.png
├── icon-144.png
├── icon-152.png
├── icon-180.png    ← Apple touch icon
├── icon-192.png    ← Android / manifest
├── icon-384.png
└── icon-512.png    ← Splash / store
```

---

## Push Notifications Setup

### 1. Generate VAPID keys
```bash
npx web-push generate-vapid-keys
```

### 2. Add to your backend (Node.js example)
```js
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:hello@ichos.app',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

// Save subscriptions from POST /api/push/subscribe
// Send notifications:
await webpush.sendNotification(subscription, JSON.stringify({
  title: 'Ichōs',
  body:  'Isla pinned the same verse as you',
  type:  'verse_match',
  url:   '/verses',
  id:    'verse-123',
}))
```

### 3. Update VAPID public key in `src/usePWA.js`
```js
const VAPID_PUBLIC_KEY = 'your-actual-vapid-public-key'
```

---

## Deployment

### Vercel (recommended — zero config)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir dist
```

### Cloudflare Pages
Connect your GitHub repo in the Cloudflare dashboard:
- Build command: `npm run build`
- Build output: `dist`

### Required: HTTPS
Service workers only run on HTTPS (or localhost).
All three platforms above provide HTTPS automatically.

---

## Android — Google Play (via TWA)

Use [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap):
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://ichos.app/manifest.json
bubblewrap build
```
This generates an Android APK/AAB you can upload to Google Play.

---

## iOS — App Store (via Capacitor)

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init Ichos app.ichos --web-dir dist
npm run build
npx cap add ios
npx cap copy ios
npx cap open ios
```
Then build and distribute from Xcode.

**Note:** iOS 16.4+ supports PWA push notifications when installed to
home screen via Safari. For App Store distribution and older iOS support,
Capacitor is the recommended path.

---

## Microsoft Store (via PWABuilder)

1. Go to https://www.pwabuilder.com
2. Enter `https://ichos.app`
3. Click "Package for stores" → Microsoft Store
4. Download and submit the generated MSIX package

---

## Lighthouse PWA Score

After deploying, run Lighthouse in Chrome DevTools → Lighthouse tab.
Target scores with this setup:
- Performance:    90+
- PWA:            100
- Accessibility:  90+
- Best Practices: 100
- SEO:            100

---

## Background Sync

Offline journal entries are saved to IndexedDB automatically.
When connectivity returns, the service worker syncs them via:
- `sync-pending-journal` — journal entries
- `sync-pending-verses`  — verse pins
- `sync-pending-reactions` — booth reactions

Register syncs in your app:
```js
const { scheduleSync } = usePWA()

// After saving an offline entry:
await scheduleSync('sync-pending-journal')
```

---

## Environment Variables

Create `.env.local`:
```
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
VITE_API_URL=https://api.ichos.app
VITE_APP_VERSION=0.1.0
```

Access in code:
```js
const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
```

---

Built with Vite + React + vite-plugin-pwa
