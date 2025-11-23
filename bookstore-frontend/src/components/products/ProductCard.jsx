/**
 * ============================================================
 * PRODUCT CARD - TARJETA DE PRODUCTO CON PREFETCH
 * ============================================================
 * 
 * UBICACIÓN: /src/components/products/ProductCard.jsx
 * 
 * Ahora incluye prefetch al pasar el mouse sobre la tarjeta
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { usePrefetchProduct } from '../../hooks/useProducts';

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const { prefetchProduct } = usePrefetchProduct();

  /**
   * PREFETCH: Cargar datos del producto cuando el mouse pase por encima
   * Esto hace que la navegación a DetalleProducto sea instantánea
   */
  const handleMouseEnter = () => {
    prefetchProduct(product.id);
  };

  /**
   * MANEJAR AGREGAR AL CARRITO
   */
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      onMouseEnter={handleMouseEnter} // ← PREFETCH AL PASAR EL MOUSE
      className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      {/* IMAGEN DEL PRODUCTO */}
      <div className="relative overflow-hidden bg-gray-100 h-80">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* BADGE DE CATEGORÍA */}
        <div className="absolute top-3 left-3">
          <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
            {product.category}
          </span>
        </div>

        {/* BADGE DE STOCK BAJO */}
        {product.stock < 10 && product.stock > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              ¡Últimas unidades!
            </span>
          </div>
        )}

        {/* SIN STOCK */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded">
              Agotado
            </span>
          </div>
        )}

        {/* OVERLAY CON BOTÓN VER DETALLES */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <button className="bg-white text-gray-900 p-3 rounded-full hover:bg-blue-600 hover:text-white transition">
              <Eye size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="p-4 flex-1 flex flex-col">
        {/* TÍTULO */}
        <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition">
          {product.title}
        </h3>

        {/* AUTOR */}
        <p className="text-sm text-gray-600 mb-3">
          {product.author}
        </p>

        {/* DESCRIPCIÓN CORTA */}
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* PRECIO Y STOCK */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Stock: {product.stock}
          </div>
        </div>

        {/* BOTÓN AGREGAR AL CARRITO */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`
            w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
            ${product.stock === 0 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : isInCart(product.id)
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <ShoppingCart size={18} />
          {product.stock === 0 
            ? 'Sin stock' 
            : isInCart(product.id) 
              ? 'En el carrito' 
              : 'Agregar al carrito'
          }
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;