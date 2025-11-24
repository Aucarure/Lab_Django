/**
 * ============================================================
 * CATEGORIES - PÁGINA DE CATEGORÍAS
 * ============================================================
 * 
 * UBICACIÓN: /src/pages/Categories.jsx
 * 
 * Página que muestra todas las categorías con sus productos
 * - Lista de categorías con sus productos
 * - Cada categoría muestra sus productos en un grid
 */

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

const Categories = () => {
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  const loading = categoriesLoading || productsLoading;

  /**
   * OBTENER PRODUCTOS POR CATEGORÍA
   */
  const getProductsByCategory = (categoryId) => {
    return products.filter(product => product.categoryId === categoryId);
  };

  /**
   * TOGGLE EXPANDIR/COLAPSAR CATEGORÍA
   */
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  /**
   * EXPANDIR TODAS LAS CATEGORÍAS
   */
  const expandAll = () => {
    const allIds = new Set(categories.map(cat => cat.id));
    setExpandedCategories(allIds);
  };

  /**
   * COLAPSAR TODAS LAS CATEGORÍAS
   */
  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* TÍTULO Y CONTROLES */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              Todas las Categorías
            </h1>

            {/* CONTADOR Y CONTROLES */}
            <div className="flex items-center justify-between max-w-2xl mx-auto mb-6">
              <p className="text-gray-600">
                {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-sm"
                >
                  Expandir todas
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition text-sm"
                >
                  Colapsar todas
                </button>
              </div>
            </div>
          </div>

          {/* LISTA DE CATEGORÍAS */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl mb-4">No hay categorías disponibles</p>
            </div>
          ) : (
            <div className="space-y-6">
              {categories.map((category) => {
                const categoryProducts = getProductsByCategory(category.id);
                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    {/* HEADER DE CATEGORÍA */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">
                          {category.name}
                        </h2>
                        {category.description && (
                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm mt-1">
                          {categoryProducts.length} {categoryProducts.length === 1 ? 'producto' : 'productos'}
                        </p>
                      </div>
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUp size={24} className="text-gray-600" />
                        ) : (
                          <ChevronDown size={24} className="text-gray-600" />
                        )}
                      </div>
                    </button>

                    {/* PRODUCTOS DE LA CATEGORÍA */}
                    {isExpanded && (
                      <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
                        {categoryProducts.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No hay productos en esta categoría</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {categoryProducts.map((product) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Categories;

