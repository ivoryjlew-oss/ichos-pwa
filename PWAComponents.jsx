import { useState } from 'react'

const PAPER = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.68' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='500' height='500' filter='url(%23n)' opacity='.048'/%3E%3C/svg%3E")`

// ─── INSTALL BANNER ───────────────────────────────────────────────────────────
// Shows at bottom of screen when PWA is installable

export function InstallBanner({ onInstall, onDismiss }) {
  const [installing, setInstalling] = useState(false)

  const handleInstall = async () => {
    setInstalling(true)
    await onInstall()
    setInstalling(false)
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 420, zIndex: 900,
      background: '#0c0a07', border: '1px solid rgba(220,210,190,0.15)',
      borderBottom: 'none', borderRadius: '8px 8px 0 0',
      backgroundImage: PAPER, backgroundSize: '500px',
      animation: 'slideUp 0.35s cubic-bezier(.16,1,.3,1)',
    }}>
      <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(220,210,190,0.3),transparent)' }}/>
      <div style={{ padding: '14px 18px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Icon */}
        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(145deg,#1a1a2e,#2d1b4e)', border: '1px solid rgba(139,92,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 900, color: '#8b5cf6' }}>Ι</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 14, fontWeight: 700, color: '#ddd0b8', marginBottom: 3 }}>Add Ichōs to your home screen</div>
          <div style={{ fontFamily: "'Spectral',serif", fontStyle: 'italic', fontSize: 12.5, color: 'rgba(220,210,190,0.5)', lineHeight: 1.55 }}>
            Install for offline access, push alerts, and a native app experience.
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={handleInstall} disabled={installing} style={{ flex: 1, fontFamily: "'Karla',sans-serif", fontSize: 9.5, letterSpacing: '0.12em', color: 'rgba(220,210,190,0.85)', background: 'rgba(220,210,190,0.07)', border: '1px solid rgba(220,210,190,0.22)', padding: '9px', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s' }}>
              {installing ? 'installing…' : 'install'}
            </button>
            <button onClick={onDismiss} style={{ fontFamily: "'Karla',sans-serif", fontSize: 9.5, letterSpacing: '0.1em', color: 'rgba(220,210,190,0.3)', background: 'transparent', border: '1px solid rgba(220,210,190,0.1)', padding: '9px 14px', cursor: 'pointer', textTransform: 'uppercase' }}>
              not now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── UPDATE TOAST ─────────────────────────────────────────────────────────────

export function UpdateToast({ onUpdate, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 388, zIndex: 900,
      background: '#0c0a07', border: '1px solid rgba(220,210,190,0.2)',
      borderRadius: 4, padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      backgroundImage: PAPER, backgroundSize: '500px',
      animation: 'fadeDown 0.3s ease',
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>✨</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9, letterSpacing: '0.14em', color: 'rgba(220,210,190,0.35)', textTransform: 'uppercase', marginBottom: 2 }}>update available</div>
        <div style={{ fontFamily: "'Spectral',serif", fontStyle: 'italic', fontSize: 12, color: 'rgba(220,210,190,0.6)' }}>A new version of Ichōs is ready</div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={onUpdate} style={{ fontFamily: "'Karla',sans-serif", fontSize: 8.5, letterSpacing: '0.1em', color: '#6ee7b7', background: 'rgba(110,231,183,0.08)', border: '1px solid rgba(110,231,183,0.25)', padding: '5px 10px', cursor: 'pointer', textTransform: 'uppercase' }}>
          reload
        </button>
        <button onClick={onDismiss} style={{ fontFamily: "'Karla',sans-serif", fontSize: 8.5, color: 'rgba(220,210,190,0.3)', background: 'transparent', border: 'none', padding: '5px 6px', cursor: 'pointer' }}>✕</button>
      </div>
    </div>
  )
}

// ─── OFFLINE BANNER ───────────────────────────────────────────────────────────

export function OfflineBanner() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 420, zIndex: 850,
      background: 'rgba(30,20,10,0.95)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(220,210,190,0.1)',
      padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fca5a5', flexShrink: 0 }}/>
      <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9.5, color: 'rgba(220,210,190,0.55)', letterSpacing: '0.1em', flex: 1 }}>
        you're offline — cached content available · changes will sync when reconnected
      </div>
    </div>
  )
}

// ─── PUSH PROMPT ─────────────────────────────────────────────────────────────

export function PushPrompt({ onEnable, onDismiss }) {
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    setLoading(true)
    await onEnable()
    setLoading(false)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 800,
      background: 'rgba(3,2,1,0.92)', backdropFilter: 'blur(20px)',
      display: 'flex', alignItems: 'flex-end',
      animation: 'slideUp 0.3s cubic-bezier(.16,1,.3,1)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', background: '#0c0a07', borderRadius: '8px 8px 0 0', border: '1px solid rgba(220,210,190,0.12)', borderBottom: 'none', backgroundImage: PAPER, backgroundSize: '500px' }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg,transparent,rgba(220,210,190,0.3),transparent)' }}/>
        <div style={{ padding: '22px 20px 28px' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔔</div>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: '#ddd0b8', marginBottom: 6 }}>Resonance Alerts</div>
            <div style={{ fontFamily: "'Spectral',serif", fontStyle: 'italic', fontSize: 13, color: 'rgba(220,210,190,0.5)', lineHeight: 1.7, maxWidth: 280, margin: '0 auto' }}>
              Get notified when someone pins the same verse, enters your booth, or a new echo match is found. Tuned to feel meaningful, not spammy.
            </div>
          </div>
          {[
            ['📜', 'verse matches — someone found the same words'],
            ['🎙', 'booth visits — someone entered your space'],
            ['✨', 'new echoes — a deep song overlap found'],
            ['📡', 'weekly report — your Sunday listening digest'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: '1px solid rgba(220,210,190,0.05)' }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
              <span style={{ fontFamily: "'Karla',sans-serif", fontSize: 10, color: 'rgba(220,210,190,0.45)', letterSpacing: '0.06em' }}>{text}</span>
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 18 }}>
            <button onClick={handle} disabled={loading} style={{ width: '100%', padding: '13px', fontFamily: "'Karla',sans-serif", fontSize: 10, letterSpacing: '0.14em', color: 'rgba(220,210,190,0.85)', background: 'rgba(220,210,190,0.07)', border: '1px solid rgba(220,210,190,0.22)', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s' }}>
              {loading ? 'requesting permission…' : 'enable alerts'}
            </button>
            <button onClick={onDismiss} style={{ width: '100%', padding: '11px', fontFamily: "'Karla',sans-serif", fontSize: 10, letterSpacing: '0.12em', color: 'rgba(220,210,190,0.3)', background: 'transparent', border: '1px solid rgba(220,210,190,0.1)', cursor: 'pointer', textTransform: 'uppercase' }}>
              maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── PWA STATUS BAR (dev / settings use) ─────────────────────────────────────

export function PWAStatusBar({ pwa }) {
  const items = [
    { label: 'mode',     value: pwa.isStandalone ? 'standalone' : 'browser'  },
    { label: 'network',  value: pwa.isOnline ? 'online' : 'offline'           },
    { label: 'push',     value: pwa.pushEnabled ? 'enabled' : 'disabled'      },
    { label: 'install',  value: pwa.isInstalled ? 'installed' : pwa.isInstallable ? 'installable' : 'not available' },
  ]

  return (
    <div style={{ padding: '8px 14px', background: 'rgba(14,11,8,0.6)', border: '1px solid rgba(220,210,190,0.08)', display: 'flex', gap: 0, flexWrap: 'wrap' }}>
      {items.map(({label, value}, i) => (
        <div key={label} style={{ flex: 1, minWidth: 80, textAlign: 'center', borderRight: i < items.length - 1 ? '1px solid rgba(220,210,190,0.07)' : 'none', padding: '4px 0' }}>
          <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 7.5, letterSpacing: '0.14em', color: 'rgba(220,210,190,0.25)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
          <div style={{ fontFamily: "'Karla',sans-serif", fontSize: 9.5, color: value.includes('online') || value.includes('enabled') || value.includes('installed') || value.includes('standalone') ? '#6ee7b7' : 'rgba(220,210,190,0.45)' }}>{value}</div>
        </div>
      ))}
    </div>
  )
}
