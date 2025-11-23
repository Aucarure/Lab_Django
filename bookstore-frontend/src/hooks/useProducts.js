/**
 * ============================================================
 * HOOKS DE REACT QUERY PARA PRODUCTOS
 * ============================================================
 * 
 * UBICACIÓN: /src/hooks/useProducts.js
 * 
 * Hooks personalizados que usan React Query para manejar
 * las consultas de productos con caché, prefetch y optimistic updates
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllProducts, 
  fetchProductById, 
  fetchProductsByCategory,
  fetchSearchProducts 
} from '../services/api';

/**
 * KEYS para identificar las queries en el caché
 */
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  CART: 'cart',
};

/**
 * HOOK: Obtener todos los productos
 * 
 * @returns {Object} { data, isLoading, error, refetch }
 */
export const useProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * HOOK: Obtener un producto por ID
 * 
 * @param {number} id - ID del producto
 * @returns {Object} { data, isLoading, error }
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => fetchProductById(id),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * HOOK: Obtener productos por categoría
 * 
 * @param {string} categorySlug - Slug de la categoría
 * @returns {Object} { data, isLoading, error }
 */
export const useProductsByCategory = (categorySlug) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'category', categorySlug],
    queryFn: () => fetchProductsByCategory(categorySlug),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * HOOK: Buscar productos
 * 
 * @param {string} searchTerm - Término de búsqueda
 * @returns {Object} { data, isLoading, error }
 */
export const useSearchProducts = (searchTerm) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, 'search', searchTerm],
    queryFn: () => fetchSearchProducts(searchTerm),
    enabled: !!searchTerm && searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * HOOK: Prefetch de producto (para hover)
 * 
 * @returns {Function} prefetchProduct - Función para hacer prefetch
 * 
 * USO:
 * const { prefetchProduct } = usePrefetchProduct();
 * <div onMouseEnter={() => prefetchProduct(productId)}>
 */
export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  const prefetchProduct = async (productId) => {
    await queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.PRODUCT, productId],
      queryFn: () => fetchProductById(productId),
      staleTime: 10 * 60 * 1000,
    });
  };

  return { prefetchProduct };
};