/**
 * CONFIGURACIÓN DE VITE
 * 
 * UBICACIÓN: /vite.config.js
 * 
 * Configuración del bundler Vite para React
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Puerto del servidor de desarrollo
    open: true, // Abre el navegador automáticamente
  },
})