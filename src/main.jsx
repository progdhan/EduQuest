import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register' // Vite PWA plugin

// Register service worker with auto-update
const updateSW = registerSW({
  onRegistered(r) {
    console.log('ServiceWorker registered:', r)
  },
  onRegisterError(error) {
    console.error('ServiceWorker registration failed:', error)
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
)
