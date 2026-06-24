// src/main.tsx

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

const container = document.getElementById('root')

if (!container) {
  // Error crítico temprano: si el DOM no tiene #root, no hay app que montar.
  throw new Error('No se encontró el elemento #root en el DOM.')
}

const root = createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
