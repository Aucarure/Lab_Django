
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Facebook, Instagram, Twitter, User } from 'lucide-react';
import { usePrefetchCategory } from "../../hooks/useCategories";


const Footer = () => {
  const navigate = useNavigate();
  const { prefetchCategory } = usePrefetchCategory(); // ← USAR HOOK

  const handleCategoryClick = (categorySlug) => {
    navigate(`/?category=${categorySlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-gray-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* COLUMNA 1: SOBRE NOSOTROS */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={28} className="text-blue-400" />
              <h3 className="text-xl font-bold text-white">BookStore</h3>
            </div>
            <p className="text-sm text-gray-400">
              Tu librería online de confianza. Los mejores libros, mangas y novelas gráficas al mejor precio.
            </p>
          </div>

          {/* COLUMNA 2: ENLACES RÁPIDOS */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-blue-400 transition">
                  Mi Carrito
                </Link>
              </li>
              <li>
                <button 
                  onClick={() => {
                    navigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-400 transition text-left"
                >
                  Todas las Categorías
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: CATEGORÍAS CON PREFETCH */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Categorías</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleCategoryClick('manga-shonen')}
                  onMouseEnter={() => prefetchCategory('manga-shonen')} // ← PREFETCH
                  className="hover:text-blue-400 transition text-left"
                >
                  Manga Shōnen
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('manga-shojo')}
                  onMouseEnter={() => prefetchCategory('manga-shojo')} // ← PREFETCH
                  className="hover:text-blue-400 transition text-left"
                >
                  Manga Shōjo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('novelas-ligeras')}
                  onMouseEnter={() => prefetchCategory('novelas-ligeras')} // ← PREFETCH
                  className="hover:text-blue-400 transition text-left"
                >
                  Novelas Ligeras
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('libros-fantasia')}
                  onMouseEnter={() => prefetchCategory('libros-fantasia')} // ← PREFETCH
                  className="hover:text-blue-400 transition text-left"
                >
                  Libros de Fantasía
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleCategoryClick('comics-superheroes')}
                  onMouseEnter={() => prefetchCategory('comics-superheroes')} // ← PREFETCH
                  className="hover:text-blue-400 transition text-left"
                >
                  Comics Superhéroes
                </button>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: EQUIPO */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Equipo de Desarrollo</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-blue-400" />
                <span>Aucarure Victor</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-blue-400" />
                <span>Solis Geraldine</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <User size={16} className="text-blue-400" />
                <span>Travezaño Sayuri</span>
              </div>
            </div>
            
            <h5 className="text-sm font-semibold text-white mb-3 mt-6">Síguenos</h5>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="bg-slate-800 p-2 rounded-full hover:bg-blue-600 transition"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* SEPARADOR */}
        <div className="border-t border-slate-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2025 BookStore. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition">
                Términos y Condiciones
              </a>
              <a href="#" className="hover:text-blue-400 transition">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;