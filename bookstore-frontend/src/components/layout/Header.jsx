/**
 * ============================================================
 * HEADER - BARRA DE NAVEGACIÓN
 * ============================================================
 * 
 * UBICACIÓN: /src/components/layout/Header.jsx
 * 
 * Componente del encabezado con:
 * - Logo y nombre de la tienda
 * - Enlace a Categorías
 * - Barra de búsqueda FUNCIONAL
 * - Icono del carrito con contador de items
 * 
 * NOTA PARA BACKEND DEV:
 * - El contador del carrito usa useCart() del contexto
 * - La búsqueda filtra productos por título o autor
 * - El enlace de Categorías navega a /categories
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, BookOpen } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const navigate = useNavigate();
  const { cartItemsCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  /**
   * MANEJAR BÚSQUEDA
   * Navega al home y pasa el término de búsqueda como parámetro URL
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Navegar al home con el término de búsqueda
      navigate(`/?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); // Limpiar el input
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* LOGO Y NOMBRE */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <BookOpen size={32} className="text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">BookStore</h1>
              <p className="text-xs text-gray-400">Tu librería online</p>
            </div>
          </Link>

          {/* ENLACE CATEGORÍAS */}
          <Link 
            to="/categories" 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Categorías
          </Link>

          {/* BARRA DE BÚSQUEDA */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar libros, mangas, autores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </form>

          {/* CARRITO CON CONTADOR */}
          <Link 
            to="/cart" 
            className="relative hover:text-blue-400 transition"
          >
            <ShoppingCart size={28} />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>

        {/* BÚSQUEDA MÓVIL */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-blue-500 text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;