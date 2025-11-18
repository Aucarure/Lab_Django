/** @type {import('tailwindcss').Config} */

/**
 * CONFIGURACIÓN DE TAILWIND CSS
 * 
 * Este archivo configura Tailwind CSS para el proyecto BookStore
 * 
 * UBICACIÓN: /tailwind.config.js (raíz del proyecto)
 * 
 * NOTA PARA BACKEND DEV:
 * - No necesitas modificar este archivo
 * - Los colores y estilos están predefinidos para el tema de la librería
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores personalizados para la BookStore
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}