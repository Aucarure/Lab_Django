from django.core.management.base import BaseCommand
from products.models import Category, Product

class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Iniciando carga de datos...')
        
        # Limpiar datos existentes (opcional)
        self.stdout.write('Limpiando datos existentes...')
        Product.objects.all().delete()
        Category.objects.all().delete()
        
        # Crear categorías
        categories_data = [
            {'name': 'Manga Shōnen', 'slug': 'manga-shonen', 'description': 'Manga dirigido a público adolescente masculino con acción y aventura'},
            {'name': 'Manga Shōjo', 'slug': 'manga-shojo', 'description': 'Manga dirigido a público adolescente femenino con romance y drama'},
            {'name': 'Novelas Ligeras', 'slug': 'novelas-ligeras', 'description': 'Light novels japonesas con ilustraciones'},
            {'name': 'Libros de Fantasía', 'slug': 'libros-fantasia', 'description': 'Novelas de fantasía épica occidental'},
            {'name': 'Comics Superhéroes', 'slug': 'comics-superheroes', 'description': 'Comics de superhéroes de DC y Marvel'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults={'name': cat_data['name'], 'description': cat_data['description']}
            )
            categories[cat_data['slug']] = category
            status = 'creada' if created else 'ya existía'
            self.stdout.write(f'✓ Categoría {status}: {category.name}')

        # Productos para cada categoría (4 por categoría)
        products_data = [
            # Manga Shōnen (4 productos)
            {'category': 'manga-shonen', 'title': 'One Piece Vol. 1', 'author': 'Eiichiro Oda', 'isbn': '9788415866398', 
             'description': 'Monkey D. Luffy sueña con convertirse en el Rey de los Piratas', 'price': 8.50, 'stock': 50, 
             'publisher': 'Planeta Cómic', 'pages': 200, 'language': 'Español', 'rating': 4.9},
            {'category': 'manga-shonen', 'title': 'Naruto Vol. 1', 'author': 'Masashi Kishimoto', 'isbn': '9788415866404',
             'description': 'Las aventuras del ninja Naruto Uzumaki', 'price': 8.00, 'stock': 45, 
             'publisher': 'Planeta Cómic', 'pages': 192, 'language': 'Español', 'rating': 4.8},
            {'category': 'manga-shonen', 'title': 'Dragon Ball Vol. 1', 'author': 'Akira Toriyama', 'isbn': '9788415866411',
             'description': 'Goku comienza la búsqueda de las esferas del dragón', 'price': 9.00, 'stock': 60, 
             'publisher': 'Planeta Cómic', 'pages': 208, 'language': 'Español', 'rating': 4.9},
            {'category': 'manga-shonen', 'title': 'My Hero Academia Vol. 1', 'author': 'Kōhei Horikoshi', 'isbn': '9788415866428',
             'description': 'En un mundo donde casi todos tienen superpoderes', 'price': 7.50, 'stock': 40, 
             'publisher': 'Planeta Cómic', 'pages': 184, 'language': 'Español', 'rating': 4.7},

            # Manga Shōjo (4 productos)
            {'category': 'manga-shojo', 'title': 'Sailor Moon Vol. 1', 'author': 'Naoko Takeuchi', 'isbn': '9788415866435',
             'description': 'Usagi se convierte en Sailor Moon para proteger la Tierra', 'price': 8.50, 'stock': 35, 
             'publisher': 'Norma Editorial', 'pages': 240, 'language': 'Español', 'rating': 4.8},
            {'category': 'manga-shojo', 'title': 'Fruits Basket Vol. 1', 'author': 'Natsuki Takaya', 'isbn': '9788415866442',
             'description': 'Tohru descubre el secreto de la familia Sohma', 'price': 8.00, 'stock': 30, 
             'publisher': 'Norma Editorial', 'pages': 180, 'language': 'Español', 'rating': 4.7},
            {'category': 'manga-shojo', 'title': 'Cardcaptor Sakura Vol. 1', 'author': 'CLAMP', 'isbn': '9788415866459',
             'description': 'Sakura debe capturar las cartas mágicas que liberó', 'price': 9.00, 'stock': 28, 
             'publisher': 'Norma Editorial', 'pages': 176, 'language': 'Español', 'rating': 4.9},
            {'category': 'manga-shojo', 'title': 'Kimi ni Todoke Vol. 1', 'author': 'Karuho Shiina', 'isbn': '9788415866466',
             'description': 'Sawako busca hacer amigos y superar su timidez', 'price': 7.50, 'stock': 25, 
             'publisher': 'Norma Editorial', 'pages': 192, 'language': 'Español', 'rating': 4.6},

            # Novelas Ligeras (4 productos)
            {'category': 'novelas-ligeras', 'title': 'Sword Art Online Vol. 1', 'author': 'Reki Kawahara', 'isbn': '9788415866473',
             'description': '10,000 jugadores atrapados en un MMORPG de realidad virtual', 'price': 12.00, 'stock': 42, 
             'publisher': 'Ivrea', 'pages': 296, 'language': 'Español', 'rating': 4.5},
            {'category': 'novelas-ligeras', 'title': 'Re:Zero Vol. 1', 'author': 'Tappei Nagatsuki', 'isbn': '9788415866480',
             'description': 'Subaru descubre que puede regresar en el tiempo al morir', 'price': 11.50, 'stock': 38, 
             'publisher': 'Ivrea', 'pages': 312, 'language': 'Español', 'rating': 4.7},
            {'category': 'novelas-ligeras', 'title': 'Overlord Vol. 1', 'author': 'Kugane Maruyama', 'isbn': '9788415866497',
             'description': 'Momonga queda atrapado en el juego como su avatar no-muerto', 'price': 12.50, 'stock': 35, 
             'publisher': 'Ivrea', 'pages': 328, 'language': 'Español', 'rating': 4.6},
            {'category': 'novelas-ligeras', 'title': 'Konosuba Vol. 1', 'author': 'Natsume Akatsuki', 'isbn': '9788415866503',
             'description': 'Kazuma muere y reencarna en un mundo de fantasía', 'price': 11.00, 'stock': 40, 
             'publisher': 'Ivrea', 'pages': 280, 'language': 'Español', 'rating': 4.8},

            # Libros de Fantasía (4 productos)
            {'category': 'libros-fantasia', 'title': 'El Nombre del Viento', 'author': 'Patrick Rothfuss', 'isbn': '9788401352836',
             'description': 'Kvothe narra la historia de cómo se convirtió en leyenda', 'price': 18.90, 'stock': 30, 
             'publisher': 'Plaza & Janés', 'pages': 872, 'language': 'Español', 'rating': 4.9},
            {'category': 'libros-fantasia', 'title': 'Mistborn: El Imperio Final', 'author': 'Brandon Sanderson', 'isbn': '9788466658881',
             'description': 'En un mundo donde la ceniza cae del cielo constantemente', 'price': 19.90, 'stock': 28, 
             'publisher': 'Ediciones B', 'pages': 688, 'language': 'Español', 'rating': 4.8},
            {'category': 'libros-fantasia', 'title': 'El Camino de los Reyes', 'author': 'Brandon Sanderson', 'isbn': '9788466657662',
             'description': 'Primera parte del Archivo de las Tormentas', 'price': 22.90, 'stock': 25, 
             'publisher': 'Ediciones B', 'pages': 1264, 'language': 'Español', 'rating': 4.9},
            {'category': 'libros-fantasia', 'title': 'La Guerra de las Brujas', 'author': 'Maite Carranza', 'isbn': '9788423678396',
             'description': 'Dos mundos de brujas enfrentados en una guerra ancestral', 'price': 16.00, 'stock': 32, 
             'publisher': 'Destino', 'pages': 384, 'language': 'Español', 'rating': 4.5},

            # Comics y Superhéroes (4 productos)
            {'category': 'comics-superheroes', 'title': 'Batman: Año Uno', 'author': 'Frank Miller', 'isbn': '9788417722456',
             'description': 'Los orígenes de Batman en Gotham City', 'price': 14.00, 'stock': 35, 
             'publisher': 'ECC Ediciones', 'pages': 144, 'language': 'Español', 'rating': 4.9},
            {'category': 'comics-superheroes', 'title': 'Spider-Man: Azul', 'author': 'Jeph Loeb', 'isbn': '9788498857559',
             'description': 'Peter Parker recuerda su romance con Gwen Stacy', 'price': 15.00, 'stock': 30, 
             'publisher': 'Panini Comics', 'pages': 136, 'language': 'Español', 'rating': 4.7},
            {'category': 'comics-superheroes', 'title': 'Watchmen', 'author': 'Alan Moore', 'isbn': '9788417722463',
             'description': 'La obra maestra que redefinió los superhéroes', 'price': 25.00, 'stock': 22, 
             'publisher': 'ECC Ediciones', 'pages': 416, 'language': 'Español', 'rating': 5.0},
            {'category': 'comics-superheroes', 'title': 'Kingdom Come', 'author': 'Mark Waid', 'isbn': '9788417722470',
             'description': 'El futuro distópico de los héroes de DC Comics', 'price': 20.00, 'stock': 26, 
             'publisher': 'ECC Ediciones', 'pages': 232, 'language': 'Español', 'rating': 4.8},
        ]

        # Crear productos
        productos_creados = 0
        for prod_data in products_data:
            category_slug = prod_data.pop('category')
            product, created = Product.objects.get_or_create(
                isbn=prod_data['isbn'],
                defaults={**prod_data, 'category': categories[category_slug]}
            )
            if created:
                productos_creados += 1
                self.stdout.write(f'  ✓ Producto creado: {product.title}')
            else:
                self.stdout.write(f'  - Producto ya existía: {product.title}')

        self.stdout.write(self.style.SUCCESS(f'\n¡Proceso completado!'))
        self.stdout.write(self.style.SUCCESS(f'Categorías: {len(categories_data)}'))
        self.stdout.write(self.style.SUCCESS(f'Productos nuevos: {productos_creados}'))
        self.stdout.write(self.style.SUCCESS(f'Total productos: {Product.objects.count()}'))