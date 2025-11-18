/**
 * ============================================================
 * DATA ADAPTER - Convierte datos del backend al formato del frontend
 * ============================================================
 * 
 * UBICACIÓN: /src/utils/dataAdapter.js
 * 
 * Este archivo convierte los nombres de campos del backend Django
 * al formato que espera el frontend React
 */

/**
 * Adaptar un producto del backend al formato del frontend
 */
export const adaptProduct = (backendProduct) => {
  if (!backendProduct) return null;

  return {
    id: backendProduct.id,
    title: backendProduct.title,
    author: backendProduct.author,
    price: parseFloat(backendProduct.price),
    category: backendProduct.category_name?.toLowerCase().replace(/\s+/g, '-') || 'otros',
    categoryId: backendProduct.category,
    image: backendProduct.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    description: backendProduct.description || 'Sin descripción disponible',
    stock: backendProduct.stock,
    isbn: backendProduct.isbn,
    publisher: backendProduct.publisher,
    pages: backendProduct.pages,
    language: backendProduct.language,
    rating: parseFloat(backendProduct.rating),
  };
};

/**
 * Adaptar una categoría del backend al formato del frontend
 */
export const adaptCategory = (backendCategory) => {
  if (!backendCategory) return null;

  return {
    id: backendCategory.id,
    name: backendCategory.name,
    slug: backendCategory.slug,
    count: backendCategory.product_count,
    description: backendCategory.description,
  };
};

/**
 * Adaptar array de productos
 */
export const adaptProducts = (backendProducts) => {
  if (!Array.isArray(backendProducts)) return [];
  return backendProducts.map(adaptProduct);
};

/**
 * Adaptar array de categorías
 */
export const adaptCategories = (backendCategories) => {
  if (!Array.isArray(backendCategories)) return [];
  return backendCategories.map(adaptCategory);
};