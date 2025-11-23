/**
 * ============================================================
 * MAIN.JSX - PUNTO DE ENTRADA CON REACT QUERY
 * ============================================================
 * 
 * UBICACIÓN: /src/main.jsx
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import App from './App.jsx'
import './index.css'

/**
 * CONFIGURACIÓN DE REACT QUERY
 * 
 * staleTime: Tiempo que los datos se consideran frescos (5 minutos)
 * cacheTime: Tiempo que los datos permanecen en caché (10 minutos)
 * retry: Número de reintentos en caso de error
 * refetchOnWindowFocus: Recargar datos al volver a la ventana
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 1, // Reintentar 1 vez si falla
      refetchOnWindowFocus: false, // No recargar al cambiar de ventana
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools solo visible en desarrollo */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>,
)