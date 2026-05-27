import { useState, useEffect, useCallback } from 'react'

// ─── VAPID PUBLIC KEY ─────────────────────────────────────────────────────────
// Replace with your actual VAPID public key from:
// npx web-push generate-vapid-keys
const VAPID_PUBLIC_KEY = 'YOUR_VAPID_PUBLIC_KEY_HERE'

// ─── usePWA HOOK ─────────────────────────────────────────────────────────────

export function usePWA() {
  const [isInstallable,  setInstallable]  = useState(false)
  const [isInstalled,    setInstalled]    = useState(false)
  const [isOnline,       setOnline]       = useState(navigator.onLine)
  const [isStandalone,   setStandalone]   = useState(false)
  const [updateAvailable,setUpdate]       = useState(false)
  const [pushSupported,  setPushSupport]  = useState(false)
  const [pushEnabled,    setPushEnabled]  = useState(false)
  const [swVersion,      setSWVersion]    = useState(null)

  useEffect(() => {
    // Standalone detection
    const mq = window.matchMedia('(display-mode: standalone)')
    setStandalone(mq.matches || navigator.standalone === true)
    mq.addEventListener('change', e => setStandalone(e.matches))

    // Online/offline
    const handleOnline  = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online',  handleOnline)
    window.addEventListener('offline', handleOffline)

    // Install prompt
    const handleInstallAvailable = () => setInstallable(true)
    const handleInstalled        = () => { setInstalled(true); setInstallable(false) }
    window.addEventListener('pwa-install-available', handleInstallAvailable)
    window.addEventListener('pwa-installed',         handleInstalled)

    // SW update
    const handleUpdate = () => setUpdate(true)
    window.addEventListener('sw-update-available', handleUpdate)

    // Check push support
    setPushSupport('PushManager' in window && 'Notification' in window)
    setPushEnabled(Notification.permission === 'granted')

    // Get SW version
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        const channel = new MessageChannel()
        channel.port1.onmessage = e => setSWVersion(e.data.version)
        reg.active?.postMessage({ type: 'GET_VERSION' }, [channel.port2])
      })
    }

    return () => {
      window.removeEventListener('online',              handleOnline)
      window.removeEventListener('offline',             handleOffline)
      window.removeEventListener('pwa-install-available', handleInstallAvailable)
      window.removeEventListener('pwa-installed',       handleInstalled)
      window.removeEventListener('sw-update-available', handleUpdate)
    }
  }, [])

  // ── INSTALL ──
  const install = useCallback(async () => {
    const accepted = await window.triggerInstall?.()
    if (accepted) setInstalled(true)
    return accepted
  }, [])

  // ── PUSH NOTIFICATIONS ──
  const enablePush = useCallback(async () => {
    try {
      const subscription = await window.requestPushPermission?.(VAPID_PUBLIC_KEY)
      if (subscription) {
        // Send subscription to your backend
        await fetch('/api/push/subscribe', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(subscription),
        })
        setPushEnabled(true)
        return true
      }
    } catch (err) {
      console.error('[usePWA] Push subscription failed:', err)
    }
    return false
  }, [])

  // ── APPLY UPDATE ──
  const applyUpdate = useCallback(async () => {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready
      reg.active?.postMessage({ type: 'SKIP_WAITING' })
    }
  }, [])

  // ── SCHEDULE BACKGROUND SYNC ──
  const scheduleSync = useCallback((tag) => {
    return window.scheduleSync?.(tag)
  }, [])

  return {
    isInstallable,
    isInstalled,
    isOnline,
    isStandalone,
    isOffline: !isOnline,
    updateAvailable,
    pushSupported,
    pushEnabled,
    swVersion,
    install,
    enablePush,
    applyUpdate,
    scheduleSync,
  }
}

// ─── useOfflineStorage HOOK ───────────────────────────────────────────────────
// Saves data to IndexedDB when offline, syncs when back online

export function useOfflineStorage(storeName) {
  const saveOffline = useCallback(async (data) => {
    const entry = { ...data, id: data.id || `offline-${Date.now()}`, _pendingSync: true }

    // Save to IndexedDB
    const db = await openIDB()
    await putRecord(db, storeName, entry)

    // Schedule background sync
    await window.scheduleSync?.(`sync-${storeName}`)

    return entry
  }, [storeName])

  const getPending = useCallback(async () => {
    const db = await openIDB()
    return getAll(db, storeName)
  }, [storeName])

  return { saveOffline, getPending }
}

// ─── IDB HELPERS ─────────────────────────────────────────────────────────────

function openIDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('ichos-offline', 1)
    req.onupgradeneeded = e => {
      const db = e.target.result
      const stores = ['pending-journal', 'pending-verses', 'pending-reactions']
      stores.forEach(s => {
        if (!db.objectStoreNames.contains(s)) {
          db.createObjectStore(s, { keyPath: 'id' })
        }
      })
    }
    req.onsuccess  = () => resolve(req.result)
    req.onerror    = () => reject(req.error)
  })
}

function putRecord(db, store, record) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readwrite')
    const req = tx.objectStore(store).put(record)
    req.onsuccess = () => resolve()
    req.onerror   = () => reject(req.error)
  })
}

function getAll(db, store) {
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(store, 'readonly')
    const req = tx.objectStore(store).getAll()
    req.onsuccess = () => resolve(req.result)
    req.onerror   = () => reject(req.error)
  })
}
