/**
 * ============================================================
 * MAIN.JSX - PUNTO DE ENTRADA DE LA APLICACIÓN
 * ============================================================
 * 
 * UBICACIÓN: /src/main.jsx
 * 
 * Este es el archivo de entrada principal de React.
 * Renderiza la aplicación en el DOM.
 * 
 * NOTA PARA BACKEND DEV:
 * - No necesitas modificar este archivo
 * - Solo importa App y lo renderiza en el div root del HTML
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Renderizar la aplicación en el elemento root del index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)