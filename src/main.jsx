import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onRegistered(r) {
    console.log('Service Worker registered:', r)
  },
  onRegisterError(err) {
    console.error('Service Worker registration failed:', err)
  },
  onNeedRefresh() {
    // 🔔 Instead of auto-reload, show a prompt or refresh manually
    const wantsRefresh = confirm('A new version is available. Reload now?')
    if (wantsRefresh) {
      updateSW() // triggers the new SW and reloads
    }
  },
  onOfflineReady() {
    console.log('App is ready to work offline!')
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
