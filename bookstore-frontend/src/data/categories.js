/**
 * DATOS DE CATEGORÍAS
 * 
 * UBICACIÓN: /src/data/categories.js
 * 
 * Este archivo contiene las 5 categorías de la BookStore
 * 
 * NOTA PARA BACKEND DEV:
 * - Estos son datos temporales (MOCK)
 * - Reemplazar con llamadas a la API Django
 * - Mantener la misma estructura de objetos para evitar errores
 * - Ejemplo de llamada API:
 *   fetch('http://localhost:8000/api/categories/')
 *     .then(res => res.json())
 *     .then(data => setCategorias(data))
 */

export const categories = [
  {
    id: 1,
    name: "Manga",
    slug: "manga",
    count: 4,
    description: "Los mejores mangas japoneses"
  },
  {
    id: 2,
    name: "Novela Gráfica",
    slug: "novela-grafica",
    count: 4,
    description: "Historias ilustradas para todas las edades"
  },
  {
    id: 3,
    name: "Fantasía",
    slug: "fantasia",
    count: 4,
    description: "Aventuras épicas y mundos imaginarios"
  },
  {
    id: 4,
    name: "Ciencia Ficción",
    slug: "ciencia-ficcion",
    count: 4,
    description: "Explora el futuro y lo desconocido"
  },
  {
    id: 5,
    name: "Clásicos",
    slug: "clasicos",
    count: 4,
    description: "Literatura atemporal"
  }
];

/**
 * FUNCIÓN HELPER: Obtener categoría por slug
 * @param {string} slug - El slug de la categoría (ej: "manga")
 * @returns {object} - Objeto de la categoría
 */
export const getCategoryBySlug = (slug) => {
  return categories.find(cat => cat.slug === slug);
};

/**
 * FUNCIÓN HELPER: Obtener categoría por ID
 * @param {number} id - El ID de la categoría
 * @returns {object} - Objeto de la categoría
 */
export const getCategoryById = (id) => {
  return categories.find(cat => cat.id === id);
};