/**
 * ============================================================
 * APP.JSX - COMPONENTE PRINCIPAL
 * ============================================================
 * 
 * UBICACIÓN: /src/App.jsx
 * 
 * Este es el componente raíz de la aplicación.
 * Configura las rutas y provee el contexto del carrito.
 * 
 * NOTA PARA BACKEND DEV:
 * - Las rutas están configuradas con React Router
 * - CartProvider envuelve toda la app para dar acceso global al carrito
 * - Agrega más rutas aquí cuando sea necesario (ej: /login, /profile)
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Importar páginas (las crearemos después)
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

function App() {
  return (
    // CartProvider envuelve toda la app para dar acceso global al carrito
    <CartProvider>
      <Router>
        <div className="App">
          {/* 
            RUTAS DE LA APLICACIÓN
            
            - / : Página principal (Home)
            - /product/:id : Detalle de producto
            - /cart : Carrito de compras
            
            TODO BACKEND DEV: Agrega más rutas cuando las necesites
            Ejemplo: <Route path="/login" element={<Login />} />
          */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;