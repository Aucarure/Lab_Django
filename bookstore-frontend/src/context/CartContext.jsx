/**
 * ============================================================
 * CART CONTEXT - ESTADO GLOBAL DEL CARRITO
 * ============================================================
 * 
 * UBICACIÓN: /src/context/CartContext.jsx
 * 
 * Este contexto maneja el estado del carrito de compras globalmente.
 * Todos los componentes pueden acceder y modificar el carrito.
 * 
 * NOTA PARA BACKEND DEV:
 * - El carrito se guarda en localStorage para persistencia
 * - Cuando implementes autenticación, puedes sincronizar con el backend
 * - Las funciones están listas para que agregues las llamadas API cuando lo necesites
 * 
 * USO EN COMPONENTES:
 * import { useCart } from '../context/CartContext';
 * 
 * function MiComponente() {
 *   const { cart, addToCart, removeFromCart, cartTotal } = useCart();
 *   // ... usar las funciones
 * }
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto
const CartContext = createContext();

/**
 * Hook personalizado para usar el carrito
 * @returns {Object} - Funciones y estado del carrito
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de CartProvider');
  }
  return context;
};

/**
 * Provider del contexto del carrito
 * Envuelve la aplicación para dar acceso global al carrito
 */
export const CartProvider = ({ children }) => {
  // Estado del carrito: array de objetos { product, quantity }
  const [cart, setCart] = useState(() => {
    // Cargar carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem('bookstore-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('bookstore-cart', JSON.stringify(cart));
  }, [cart]);

  /**
   * AGREGAR PRODUCTO AL CARRITO
   * @param {Object} product - Objeto del producto completo
   * @param {Number} quantity - Cantidad a agregar (default: 1)
   * 
   * TODO BACKEND DEV: Aquí puedes agregar validación de stock con el backend
   * Ejemplo: await fetch(`/api/products/${product.id}/check-stock/`)
   */
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      // Verificar si el producto ya existe en el carrito
      const existingItem = prevCart.find(item => item.product.id === product.id);

      if (existingItem) {
        // Si existe, actualizar la cantidad
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Si no existe, agregar nuevo item
        return [...prevCart, { product, quantity }];
      }
    });

    // Opcional: Mostrar notificación de éxito
    console.log(`✅ ${product.title} agregado al carrito`);
  };

  /**
   * REMOVER PRODUCTO DEL CARRITO
   * @param {Number} productId - ID del producto a remover
   */
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    console.log(`🗑️ Producto removido del carrito`);
  };

  /**
   * ACTUALIZAR CANTIDAD DE UN PRODUCTO
   * @param {Number} productId - ID del producto
   * @param {Number} newQuantity - Nueva cantidad
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  /**
   * VACIAR TODO EL CARRITO
   */
  const clearCart = () => {
    setCart([]);
    console.log('🧹 Carrito vaciado');
  };

  /**
   * OBTENER TOTAL DE ITEMS EN EL CARRITO
   * @returns {Number} - Cantidad total de productos
   */
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  /**
   * CALCULAR TOTAL DEL CARRITO
   * @returns {Number} - Precio total del carrito
   */
  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  /**
   * VERIFICAR SI UN PRODUCTO ESTÁ EN EL CARRITO
   * @param {Number} productId - ID del producto
   * @returns {Boolean}
   */
  const isInCart = (productId) => {
    return cart.some(item => item.product.id === productId);
  };

  /**
   * OBTENER CANTIDAD DE UN PRODUCTO ESPECÍFICO
   * @param {Number} productId - ID del producto
   * @returns {Number} - Cantidad del producto en el carrito
   */
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Valores y funciones que se comparten globalmente
  const value = {
    cart,                    // Array completo del carrito
    addToCart,               // Agregar producto
    removeFromCart,          // Remover producto
    updateQuantity,          // Actualizar cantidad
    clearCart,               // Vaciar carrito
    getCartItemsCount,       // Total de items
    getCartTotal,            // Total en precio
    isInCart,                // Verificar si está en carrito
    getProductQuantity,      // Obtener cantidad específica
    cartItemsCount: getCartItemsCount(),  // Computed value
    cartTotal: getCartTotal(),            // Computed value
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;