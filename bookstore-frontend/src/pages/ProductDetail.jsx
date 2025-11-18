/**
 * ============================================================
 * PRODUCT DETAIL - PÁGINA DE DETALLE DE PRODUCTO
 * ============================================================
 * 
 * UBICACIÓN: /src/pages/ProductDetail.jsx
 * 
 * Página que muestra toda la información de un producto específico:
 * - Imagen grande del producto
 * - Información completa (título, autor, descripción, precio)
 * - Selector de cantidad
 * - Botón para agregar al carrito
 * - Productos relacionados (de la misma categoría)
 * 
 * NOTA PARA BACKEND DEV:
 * - Obtiene el ID del producto desde la URL usando useParams()
 * - Carga el producto desde la API usando fetchProductById()
 * - Para conectar con Django, solo descomenta el código en api.js
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Plus, Minus, Package, Truck } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/products/ProductCard';
import { useCart } from '../context/CartContext';
import { fetchProductById, fetchProductsByCategory } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams(); // Obtener ID del producto desde la URL
  const navigate = useNavigate();
  const { addToCart, getProductQuantity } = useCart();

  // ESTADOS
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  /**
   * CARGAR PRODUCTO AL MONTAR O CAMBIAR ID
   * 
   * TODO BACKEND DEV: fetchProductById ya está conectado con api.js
   * Solo descomenta el fetch en api.js cuando Django esté listo
   */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        
        // Cargar producto por ID
        const productData = await fetchProductById(id);
        
        if (!productData) {
          // Si no existe el producto, redirigir al home
          navigate('/');
          return;
        }

        setProduct(productData);
        setSelectedImage(0);
        setQuantity(1);

        // Cargar productos relacionados (misma categoría)
        const related = await fetchProductsByCategory(productData.category);
        // Filtrar el producto actual y tomar solo 4
        const filteredRelated = related
          .filter(p => p.id !== productData.id)
          .slice(0, 4);
        setRelatedProducts(filteredRelated);

      } catch (error) {
        console.error('Error al cargar producto:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, navigate]);

  /**
   * MANEJAR INCREMENTO DE CANTIDAD
   */
  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  /**
   * MANEJAR DECREMENTO DE CANTIDAD
   */
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  /**
   * AGREGAR AL CARRITO
   */
  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Opcional: Mostrar notificación o redirigir al carrito
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // SI NO HAY PRODUCTO
  if (!product) {
    return null;
  }

  // Cantidad actual en el carrito
  const currentCartQuantity = getProductQuantity(product.id);

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
            <span>Volver</span>
          </button>

          {/* ========== INFORMACIÓN DEL PRODUCTO ========== */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* COLUMNA IZQUIERDA: IMAGEN */}
              <div>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-[500px] object-cover"
                  />
                </div>
                
                {/* BADGE DE CATEGORÍA */}
                <div className="flex gap-2">
                  <span className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-full uppercase">
                    {product.category}
                  </span>
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="bg-orange-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                      ¡Solo quedan {product.stock}!
                    </span>
                  )}
                </div>
              </div>

              {/* COLUMNA DERECHA: INFORMACIÓN */}
              <div className="flex flex-col">
                
                {/* TÍTULO Y AUTOR */}
                <h1 className="text-4xl font-bold text-gray-900 mb-3">
                  {product.title}
                </h1>
                <p className="text-xl text-gray-600 mb-6">
                  por <span className="font-semibold">{product.author}</span>
                </p>

                {/* PRECIO */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                {/* DESCRIPCIÓN */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* INFORMACIÓN ADICIONAL */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package size={20} className="text-blue-600" />
                    <span>Stock disponible: <strong>{product.stock} unidades</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Truck size={20} className="text-blue-600" />
                    <span>Envío gratis en compras mayores a $50</span>
                  </div>
                  {product.isbn && (
                    <div className="text-gray-600 text-sm">
                      ISBN: {product.isbn}
                    </div>
                  )}
                </div>

                {/* SELECTOR DE CANTIDAD */}
                {product.stock > 0 && (
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-3">
                      Cantidad
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-gray-300 rounded-lg">
                        <button
                          onClick={handleDecrement}
                          disabled={quantity <= 1}
                          className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Minus size={20} />
                        </button>
                        <span className="px-6 py-2 font-bold text-xl">
                          {quantity}
                        </span>
                        <button
                          onClick={handleIncrement}
                          disabled={quantity >= product.stock}
                          className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                      
                      {currentCartQuantity > 0 && (
                        <span className="text-sm text-gray-600">
                          Ya tienes {currentCartQuantity} en el carrito
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* BOTONES DE ACCIÓN */}
                <div className="flex gap-4">
                  {product.stock > 0 ? (
                    <>
                      <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition transform hover:scale-105"
                      >
                        <ShoppingCart size={24} />
                        Agregar al Carrito
                      </button>
                      <Link
                        to="/cart"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-6 rounded-lg transition"
                      >
                        Ver Carrito
                      </Link>
                    </>
                  ) : (
                    <button
                      disabled
                      className="flex-1 bg-gray-300 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed"
                    >
                      Producto Agotado
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========== PRODUCTOS RELACIONADOS ========== */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Productos Relacionados
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;