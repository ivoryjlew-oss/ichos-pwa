import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Hide loading screen after React paints
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    window.hideLoader?.()
  })
})
