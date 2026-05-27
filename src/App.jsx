import { useState, useEffect } from 'react'
import IchosMain from './IchosMain.jsx'
import { usePWA } from './usePWA.js'
import { InstallBanner, UpdateToast, OfflineBanner, PushPrompt } from './PWAComponents.jsx'

export default function App() {
  const pwa = usePWA()
  const [showInstall,    setShowInstall]    = useState(false)
  const [showUpdate,     setShowUpdate]     = useState(false)
  const [showPushPrompt, setShowPushPrompt] = useState(false)
  const [pushDismissed,  setPushDismissed]  = useState(false)

  useEffect(() => {
    if (pwa.isInstallable && !pwa.isInstalled) {
      const t = setTimeout(() => setShowInstall(true), 10000)
      return () => clearTimeout(t)
    }
  }, [pwa.isInstallable, pwa.isInstalled])

  useEffect(() => {
    if (pwa.updateAvailable) setShowUpdate(true)
  }, [pwa.updateAvailable])

  useEffect(() => {
    if (pwa.isInstalled && pwa.pushSupported && !pwa.pushEnabled && !pushDismissed) {
      const t = setTimeout(() => setShowPushPrompt(true), 3000)
      return () => clearTimeout(t)
    }
  }, [pwa.isInstalled, pwa.pushSupported, pwa.pushEnabled, pushDismissed])

  return (
    <>
      {pwa.isOffline && <OfflineBanner />}

      {showUpdate && (
        <UpdateToast
          onUpdate={() => { pwa.applyUpdate(); setShowUpdate(false) }}
          onDismiss={() => setShowUpdate(false)}
        />
      )}

      <IchosMain />

      {showInstall && !pwa.isInstalled && (
        <InstallBanner
          onInstall={async () => { await pwa.install(); setShowInstall(false) }}
          onDismiss={() => setShowInstall(false)}
        />
      )}

      {showPushPrompt && (
        <PushPrompt
          onEnable={async () => { await pwa.enablePush(); setShowPushPrompt(false) }}
          onDismiss={() => { setShowPushPrompt(false); setPushDismissed(true) }}
        />
      )}

      <style>{`
        @keyframes slideUp  { from { transform:translateX(-50%) translateY(40px); opacity:0 } to { transform:translateX(-50%) translateY(0); opacity:1 } }
        @keyframes fadeDown { from { opacity:0; transform:translateX(-50%) translateY(-8px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
      `}</style>
    </>
  )
}
