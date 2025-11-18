/**
 * ============================================================
 * SERVICIO DE API - CONEXIÓN CON BACKEND DJANGO
 * ============================================================
 */

import { adaptProducts, adaptProduct, adaptCategories } from '../utils/dataAdapter';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Normalizar respuesta de Django REST Framework
 */
const normalizeResponse = (data) => {
  if (data && data.results) {
    return data.results;
  }
  if (Array.isArray(data)) {
    return data;
  }
  return data;
};

/**
 * Obtener todos los productos
 */
export const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    const data = await response.json();
    const normalized = normalizeResponse(data);
    return adaptProducts(normalized);
  } catch (error) {
    console.error('Error en fetchAllProducts:', error);
    return [];
  }
};

/**
 * Obtener productos por categoría
 */
export const fetchProductsByCategory = async (categorySlug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/?category=${categorySlug}`);
    if (!response.ok) {
      throw new Error('Error al obtener productos por categoría');
    }
    const data = await response.json();
    const normalized = normalizeResponse(data);
    return adaptProducts(normalized);
  } catch (error) {
    console.error('Error en fetchProductsByCategory:', error);
    return [];
  }
};

/**
 * Obtener un producto por ID
 */
export const fetchProductById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`);
    if (!response.ok) {
      throw new Error('Producto no encontrado');
    }
    const data = await response.json();
    return adaptProduct(data);
  } catch (error) {
    console.error('Error en fetchProductById:', error);
    throw error;
  }
};

/**
 * Buscar productos
 */
export const fetchSearchProducts = async (searchTerm) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/?search=${encodeURIComponent(searchTerm)}`);
    if (!response.ok) {
      throw new Error('Error al buscar productos');
    }
    const data = await response.json();
    const normalized = normalizeResponse(data);
    return adaptProducts(normalized);
  } catch (error) {
    console.error('Error en fetchSearchProducts:', error);
    return [];
  }
};

/**
 * Obtener todas las categorías
 */
export const fetchAllCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    if (!response.ok) {
      throw new Error('Error al obtener categorías');
    }
    const data = await response.json();
    const normalized = normalizeResponse(data);
    return adaptCategories(normalized);
  } catch (error) {
    console.error('Error en fetchAllCategories:', error);
    return [];
  }
};

/**
 * Crear un pedido
 */
export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) {
      throw new Error('Error al crear el pedido');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en createOrder:', error);
    throw error;
  }
};

export default {
  fetchAllProducts,
  fetchProductsByCategory,
  fetchProductById,
  fetchSearchProducts,
  fetchAllCategories,
  createOrder
};