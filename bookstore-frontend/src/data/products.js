/**
 * DATOS DE PRODUCTOS
 * 
 * UBICACIÓN: /src/data/products.js
 * 
 * Este archivo contiene los productos de la BookStore (4 productos por categoría = 20 productos)
 * 
 * NOTA PARA BACKEND DEV:
 * - Estos son datos temporales (MOCK)
 * - Reemplazar con llamadas a la API Django:
 *   Ejemplo: GET /api/products/ o GET /api/products/?category=manga
 * 
 * ESTRUCTURA DE PRODUCTO:
 * {
 *   id: number,
 *   title: string,
 *   author: string,
 *   price: number,
 *   category: string (slug de la categoría),
 *   categoryId: number,
 *   image: string (URL o ruta de la imagen),
 *   description: string,
 *   stock: number,
 *   isbn: string (opcional),
 * }
 */

export const products = [
  // ========== MANGA (4 productos) ==========
  {
    id: 1,
    title: "Tokyo Ghoul Vol. 1",
    author: "Sui Ishida",
    price: 12.99,
    category: "manga",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop",
    description: "Ken Kaneki es un joven estudiante que sufre un terrible accidente que lo transforma en un ghoul. Ahora debe luchar por sobrevivir en un mundo donde humanos y ghouls se enfrentan.",
    stock: 15,
    isbn: "978-1421580364"
  },
  {
    id: 2,
    title: "One Piece Vol. 1",
    author: "Eiichiro Oda",
    price: 11.99,
    category: "manga",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1612178537253-bccd437b730e?w=400&h=600&fit=crop",
    description: "Monkey D. Luffy sueña con convertirse en el Rey de los Piratas. Su aventura comienza cuando come una fruta del diablo que le otorga poderes increíbles.",
    stock: 25,
    isbn: "978-1569319017"
  },
  {
    id: 3,
    title: "Attack on Titan Vol. 1",
    author: "Hajime Isayama",
    price: 13.99,
    category: "manga",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1639519681471-6a70801881b6?w=400&h=600&fit=crop",
    description: "La humanidad vive encerrada tras enormes murallas para protegerse de los titanes. Eren Yeager presenciará un evento que cambiará su vida para siempre.",
    stock: 20,
    isbn: "978-1612620244"
  },
  {
    id: 4,
    title: "Death Note Vol. 1",
    author: "Tsugumi Ohba",
    price: 12.50,
    category: "manga",
    categoryId: 1,
    image: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=600&fit=crop",
    description: "Light Yagami encuentra un cuaderno sobrenatural que le permite matar a cualquier persona cuyo nombre escriba en él. ¿Usará este poder para el bien o el mal?",
    stock: 18,
    isbn: "978-1421501680"
  },

  // ========== NOVELA GRÁFICA (4 productos) ==========
  {
    id: 5,
    title: "Sandman: Preludios y Nocturnos",
    author: "Neil Gaiman",
    price: 16.99,
    category: "novela-grafica",
    categoryId: 2,
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
    description: "Dream, el señor de los sueños, ha sido capturado y permanece prisionero durante 70 años. Al liberarse, debe recuperar su poder y reconstruir su reino.",
    stock: 12,
    isbn: "978-1401225759"
  },
  {
    id: 6,
    title: "Watchmen",
    author: "Alan Moore",
    price: 19.99,
    category: "novela-grafica",
    categoryId: 2,
    image: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=400&h=600&fit=crop",
    description: "En un mundo alternativo donde los superhéroes existen, un vigilante enmascarado investiga el asesinato de uno de sus antiguos compañeros.",
    stock: 10,
    isbn: "978-1401245252"
  },
  {
    id: 7,
    title: "V de Vendetta",
    author: "Alan Moore",
    price: 17.99,
    category: "novela-grafica",
    categoryId: 2,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    description: "En una Inglaterra distópica, un misterioso revolucionario conocido como 'V' lucha contra un gobierno totalitario usando tácticas terroristas.",
    stock: 14,
    isbn: "978-1401207922"
  },
  {
    id: 8,
    title: "Maus",
    author: "Art Spiegelman",
    price: 18.99,
    category: "novela-grafica",
    categoryId: 2,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    description: "Una poderosa novela gráfica que narra las experiencias del autor y su padre durante el Holocausto, representando a los judíos como ratones y a los nazis como gatos.",
    stock: 8,
    isbn: "978-0141014081"
  },

  // ========== FANTASÍA (4 productos) ==========
  {
    id: 9,
    title: "El Nombre del Viento",
    author: "Patrick Rothfuss",
    price: 18.50,
    category: "fantasia",
    categoryId: 3,
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=400&h=600&fit=crop",
    description: "Kvothe, un legendario héroe caído en desgracia, narra su historia desde sus días en una troupe de artistas itinerantes hasta convertirse en el mago más temido y admirado.",
    stock: 22,
    isbn: "978-0756404741"
  },
  {
    id: 10,
    title: "La Comunidad del Anillo",
    author: "J.R.R. Tolkien",
    price: 15.99,
    category: "fantasia",
    categoryId: 3,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=600&fit=crop",
    description: "Frodo Bolsón debe destruir el Anillo Único en los fuegos del Monte del Destino para salvar la Tierra Media de la oscuridad de Sauron.",
    stock: 30,
    isbn: "978-0547928210"
  },
  {
    id: 11,
    title: "Harry Potter y la Piedra Filosofal",
    author: "J.K. Rowling",
    price: 14.99,
    category: "fantasia",
    categoryId: 3,
    image: "https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=400&h=600&fit=crop",
    description: "Harry Potter descubre que es un mago en su undécimo cumpleaños y es admitido en la Escuela de Magia y Hechicería de Hogwarts.",
    stock: 35,
    isbn: "978-0439708180"
  },
  {
    id: 12,
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: 16.99,
    category: "fantasia",
    categoryId: 3,
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=600&fit=crop",
    description: "Violet Sorrengail debía entrar al Cuadrante de los Escribas, pero su madre la obliga a unirse al Cuadrante de Jinetes, donde el entrenamiento es brutal y mortal.",
    stock: 18,
    isbn: "978-1649374042"
  },

  // ========== CIENCIA FICCIÓN (4 productos) ==========
  {
    id: 13,
    title: "Dune",
    author: "Frank Herbert",
    price: 22.99,
    category: "ciencia-ficcion",
    categoryId: 4,
    image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&h=600&fit=crop",
    description: "En el desértico planeta Arrakis, única fuente de la especia melange, Paul Atreides debe enfrentar conspiraciones políticas y su destino como mesías.",
    stock: 20,
    isbn: "978-0441172719"
  },
  {
    id: 14,
    title: "Neuromante",
    author: "William Gibson",
    price: 17.99,
    category: "ciencia-ficcion",
    categoryId: 4,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=600&fit=crop",
    description: "Case, un cowboy del ciberespacio, es contratado para el último y mayor hack de su vida en una inteligencia artificial que controla el mundo.",
    stock: 15,
    isbn: "978-0441569595"
  },
  {
    id: 15,
    title: "El Juego de Ender",
    author: "Orson Scott Card",
    price: 16.50,
    category: "ciencia-ficcion",
    categoryId: 4,
    image: "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=400&h=600&fit=crop",
    description: "Ender Wiggin, un niño genio, es reclutado por la Academia de Batalla para prepararse para una invasión alienígena que amenaza a la humanidad.",
    stock: 25,
    isbn: "978-0812550702"
  },
  {
    id: 16,
    title: "Ready Player One",
    author: "Ernest Cline",
    price: 15.99,
    category: "ciencia-ficcion",
    categoryId: 4,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=600&fit=crop",
    description: "En 2045, Wade Watts escapa de su realidad distópica sumergiéndose en OASIS, un universo virtual donde busca un tesoro dejado por el creador del juego.",
    stock: 28,
    isbn: "978-0307887436"
  },

  // ========== CLÁSICOS (4 productos) ==========
  {
    id: 17,
    title: "1984",
    author: "George Orwell",
    price: 13.99,
    category: "clasicos",
    categoryId: 5,
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop",
    description: "Winston Smith vive en Oceanía, un estado totalitario donde el Gran Hermano controla cada aspecto de la vida. Una novela sobre vigilancia, manipulación y libertad.",
    stock: 40,
    isbn: "978-0451524935"
  },
  {
    id: 18,
    title: "Orgullo y Prejuicio",
    author: "Jane Austen",
    price: 12.99,
    category: "clasicos",
    categoryId: 5,
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
    description: "Elizabeth Bennet debe navegar las complejidades sociales de la Inglaterra del siglo XIX mientras trata con el orgulloso Sr. Darcy.",
    stock: 35,
    isbn: "978-0141439518"
  },
  {
    id: 19,
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    price: 16.99,
    category: "clasicos",
    categoryId: 5,
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop",
    description: "La historia de la familia Buendía a lo largo de siete generaciones en el pueblo ficticio de Macondo, una obra maestra del realismo mágico.",
    stock: 30,
    isbn: "978-0307474728"
  },
  {
    id: 20,
    title: "El Gran Gatsby",
    author: "F. Scott Fitzgerald",
    price: 14.50,
    category: "clasicos",
    categoryId: 5,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
    description: "Nick Carraway narra la trágica historia de Jay Gatsby y su obsesión por Daisy Buchanan en la era del jazz estadounidense.",
    stock: 32,
    isbn: "978-0743273565"
  }
];

/**
 * ============================================================
 * FUNCIONES HELPER - PARA TRABAJAR CON DATOS MOCK
 * ============================================================
 * 
 * NOTA IMPORTANTE PARA BACKEND DEV:
 * Estas funciones están diseñadas para trabajar con datos locales (mock).
 * Cuando conectes con Django API, reemplaza estas funciones con llamadas fetch/axios.
 * 
 * EJEMPLO DE CONVERSIÓN:
 * 
 * // ANTES (Mock):
 * const products = getProductsByCategory('manga');
 * 
 * // DESPUÉS (Con API Django):
 * const response = await fetch('http://localhost:8000/api/products/?category=manga');
 * const products = await response.json();
 */

/**
 * Obtener todos los productos
 * API EQUIVALENTE: GET /api/products/
 */
export const getAllProducts = () => {
  return products;
};

/**
 * Obtener productos por categoría
 * @param {string} categorySlug - Slug de la categoría (ej: "manga")
 * API EQUIVALENTE: GET /api/products/?category=manga
 */
export const getProductsByCategory = (categorySlug) => {
  return products.filter(product => product.category === categorySlug);
};

/**
 * Obtener un producto por ID
 * @param {number} id - ID del producto
 * API EQUIVALENTE: GET /api/products/{id}/
 */
export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

/**
 * Buscar productos por título o autor
 * @param {string} searchTerm - Término de búsqueda
 * API EQUIVALENTE: GET /api/products/?search=termino
 */
export const searchProducts = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  return products.filter(product => 
    product.title.toLowerCase().includes(term) || 
    product.author.toLowerCase().includes(term)
  );
};