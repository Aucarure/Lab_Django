/**
 * ============================================================
 * HOME - PÁGINA PRINCIPAL
 * ============================================================
 * 
 * UBICACIÓN: /src/pages/Home.jsx
 * 
 * Página principal de la BookStore con:
 * - Hero section (banner principal)
 * - Filtro de categorías
 * - Grid de productos
 * 
 * NOTA PARA BACKEND DEV:
 * - Los productos se cargan desde el servicio API (api.js)
 * - Actualmente usa datos mock, pero está preparado para conectar con Django
 * - Para conectar con backend:
 *   1. Verifica que Django esté corriendo
 *   2. Abre src/services/api.js
 *   3. Descomenta las funciones fetch()
 *   4. Cambia API_BASE_URL a tu URL de Django
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';

// IMPORTAR HOOKS DE REACT QUERY
import { useProducts, usePrefetchProduct } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';

const Home = () => {
  // REACT QUERY HOOKS
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { prefetchProduct } = usePrefetchProduct();

  // ESTADOS LOCALES
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const categoryParam = searchParams.get('category');

  // El loading general
  const loading = productsLoading || categoriesLoading;

  // Resto del código permanece igual...

  // SLIDES DEL HERO (carrusel)
  const heroSlides = [
    {
      title: "Descubre Nuevos Mundos",
      subtitle: "Miles de títulos esperando por ti",
      bgImage: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&h=500&fit=crop"
    },
    {
      title: "Los Mejores Mangas",
      subtitle: "Encuentra tus series favoritas",
      bgImage: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=1200&h=500&fit=crop"
    },
    {
      title: "Clásicos Inmortales",
      subtitle: "Literatura que trasciende el tiempo",
      bgImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&h=500&fit=crop"
    }
  ];

  /**
   * CARGAR PRODUCTOS Y CATEGORÍAS AL MONTAR EL COMPONENTE
   * 
   * TODO BACKEND DEV: Estas funciones ya están conectadas con api.js
   * Solo necesitas descomentar el código fetch en api.js cuando tu backend esté listo
   */
  // Actualizar categoría desde URL
useEffect(() => {
  if (categoryParam) {
    setSelectedCategory(categoryParam);
  }
}, [categoryParam]);
  /**
   * CARRUSEL AUTOMÁTICO
   * Cambia de slide cada 5 segundos
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

/**
   * FILTRAR PRODUCTOS POR CATEGORÍA Y BÚSQUEDA
   */
  const filteredProducts = products.filter(product => {
  // Filtro por categoría usando el slug del backend
  const matchesCategory = selectedCategory === 'todas' || 
    categories.find(cat => cat.slug === selectedCategory)?.id === product.categoryId;
  
  // Filtro por búsqueda
  const matchesSearch = !searchQuery || 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.author.toLowerCase().includes(searchQuery.toLowerCase());
  
  return matchesCategory && matchesSearch;
});
  /**
   * NAVEGACIÓN DEL CARRUSEL
   */
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ========== HERO SECTION (CARRUSEL) ========== */}
        <section className="relative h-[500px] overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url(${slide.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* OVERLAY OSCURO */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              
              {/* CONTENIDO DEL SLIDE */}
              <div className="relative h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-3xl">
                  <h2 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
                    {slide.subtitle}
                  </p>
                  <button 
                    onClick={() => window.scrollTo({ top: document.getElementById('productos-section').offsetTop - 100, behavior: 'smooth' })}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition transform hover:scale-105"
                    >
                    Explorar Ahora
                    </button>
                </div>
              </div>
            </div>
          ))}

          {/* BOTONES DE NAVEGACIÓN */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition z-10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition z-10"
          >
            <ChevronRight size={32} />
          </button>

          {/* INDICADORES DE SLIDES */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </section>

        {/* ========== CATEGORÍAS ========== */}
        <section id="productos-section" className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Categorías
          </h2>

          {/* FILTROS DE CATEGORÍA */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('todas')}
              className={`px-6 py-2.5 rounded-full font-semibold transition ${
                selectedCategory === 'todas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas ({products.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2.5 rounded-full font-semibold transition ${
                  selectedCategory === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* CONTADOR DE PRODUCTOS */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
            </p>
          </div>

          {/* ========== GRID DE PRODUCTOS ========== */}
          {loading ? (
            // LOADING STATE
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            // NO HAY PRODUCTOS
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">No se encontraron productos en esta categoría</p>
            </div>
          ) : (
            // GRID DE PRODUCTOS
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;