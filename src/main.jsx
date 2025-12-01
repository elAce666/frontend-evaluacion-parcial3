import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { validateToken, logout } from './services/authService'

// Versión de caché para limpiar datos obsoletos
const CACHE_VERSION = '1.0.1'
const currentCacheVersion = localStorage.getItem('cacheVersion')

if (currentCacheVersion !== CACHE_VERSION) {
  // Limpiar localStorage cuando la versión cambia
  localStorage.clear()
  sessionStorage.clear()
  localStorage.setItem('cacheVersion', CACHE_VERSION)
  console.log('Cache limpiado - nueva versión')
}

async function bootstrapAuth() {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const res = await validateToken(token)
    if (!res.valid) {
      logout()
      window.location.href = '/login'
    } else {
      if (res.rol) localStorage.setItem('rol', res.rol)
      if (res.usuario) localStorage.setItem('usuario', res.usuario)
    }
  } catch (e) {
    console.error('validateToken error', e)
  }
}

bootstrapAuth()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
