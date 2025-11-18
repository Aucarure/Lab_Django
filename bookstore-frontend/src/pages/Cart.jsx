/**
 * ============================================================
 * CART - PÁGINA DEL CARRITO DE COMPRAS
 * ============================================================
 * 
 * UBICACIÓN: /src/pages/Cart.jsx
 * 
 * Página del carrito de compras con:
 * - Lista de productos agregados
 * - Controles para modificar cantidades
 * - Resumen del pedido con total
 * - Botón para procesar compra (preparado para implementación futura)
 * 
 * NOTA PARA BACKEND DEV:
 * - El carrito usa el contexto CartContext
 * - Los datos se guardan en localStorage para persistencia
 * - El botón "Procesar Compra" está preparado para conectar con tu endpoint
 * - Cuando implementes checkout, usa la función createOrder() de api.js
 * 
 * EJEMPLO DE INTEGRACIÓN CON BACKEND:
 * 
 * const handleCheckout = async () => {
 *   const orderData = {
 *     items: cart.map(item => ({
 *       product_id: item.product.id,
 *       quantity: item.quantity
 *     })),
 *     total: cartTotal
 *   };
 *   
 *   const order = await createOrder(orderData);
 *   // Redirigir a página de confirmación
 * }
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal 
  } = useCart();

  /**
   * INCREMENTAR CANTIDAD DE UN PRODUCTO
   */
  const handleIncrement = (item) => {
    if (item.quantity < item.product.stock) {
      updateQuantity(item.product.id, item.quantity + 1);
    }
  };

  /**
   * DECREMENTAR CANTIDAD DE UN PRODUCTO
   */
  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    }
  };

  /**
   * REMOVER PRODUCTO DEL CARRITO
   */
  const handleRemove = (productId) => {
    if (window.confirm('¿Estás seguro de eliminar este producto del carrito?')) {
      removeFromCart(productId);
    }
  };

  /**
   * VACIAR TODO EL CARRITO
   */
  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de vaciar todo el carrito?')) {
      clearCart();
    }
  };

  /**
   * PROCESAR COMPRA
   * 
   * TODO BACKEND DEV: Implementar aquí la lógica de checkout
   * 1. Validar stock disponible
   * 2. Crear orden en el backend
   * 3. Redirigir a página de pago o confirmación
   */
 const handleCheckout = () => {
  alert('✅ ¡Compra simulada exitosa!\n\n' +
        'Total: $' + (cartTotal + (cartTotal >= 50 ? 0 : 5)).toFixed(2) + '\n\n' +
        'NOTA: La funcionalidad de pago no está implementada en esta demo.');
  
  // Opcional: Vaciar el carrito después de la "compra"
  clearCart();
};

  // CARRITO VACÍO
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
              <ShoppingBag size={80} className="mx-auto text-gray-300 mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tu carrito está vacío
              </h2>
              <p className="text-gray-600 mb-8">
                ¡Explora nuestra tienda y encuentra tus libros favoritos!
              </p>
              <Link
                to="/"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Ir a la Tienda
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          
          {/* BOTÓN VOLVER */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition"
          >
            <ArrowLeft size={20} />
            <span>Seguir comprando</span>
          </button>

          {/* TÍTULO */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Carrito de Compras
            </h1>
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1 transition"
            >
              <Trash2 size={16} />
              Vaciar carrito
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ========== LISTA DE PRODUCTOS ========== */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4"
                >
                  {/* IMAGEN DEL PRODUCTO */}
                  <Link
                    to={`/product/${item.product.id}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-full sm:w-32 h-40 object-cover rounded-lg hover:opacity-80 transition"
                    />
                  </Link>

                  {/* INFORMACIÓN DEL PRODUCTO */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="text-lg font-bold text-gray-900 hover:text-blue-600 transition"
                      >
                        {item.product.title}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.product.author}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        Categoría: {item.product.category}
                      </p>
                    </div>

                    {/* PRECIO Y CONTROLES */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-2xl font-bold text-blue-600">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>

                      {/* CONTROLES DE CANTIDAD */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleDecrement(item)}
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* BOTÓN ELIMINAR */}
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          title="Eliminar producto"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* ADVERTENCIA DE STOCK */}
                    {item.quantity >= item.product.stock && (
                      <p className="text-orange-600 text-sm mt-2">
                        ⚠️ Has alcanzado el stock máximo disponible
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ========== RESUMEN DEL PEDIDO ========== */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Resumen del Pedido
                </h2>

                {/* DETALLES */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</span>
                    <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Envío</span>
                    <span className="font-semibold text-green-600">
                      {cartTotal >= 50 ? 'GRATIS' : '$5.00'}
                    </span>
                  </div>
                  {cartTotal < 50 && (
                    <p className="text-sm text-gray-500">
                      💡 Agrega ${(50 - cartTotal).toFixed(2)} más para envío gratis
                    </p>
                  )}
                </div>

                {/* TOTAL */}
                <div className="border-t-2 border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">
                      ${(cartTotal + (cartTotal >= 50 ? 0 : 5)).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* BOTÓN PROCESAR COMPRA */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition transform hover:scale-105 mb-3"
                >
                  Procesar Compra
                </button>

                {/* NOTA INFORMATIVA */}
                <p className="text-xs text-gray-500 text-center">
                  La funcionalidad de pago no está implementada en esta demo
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;