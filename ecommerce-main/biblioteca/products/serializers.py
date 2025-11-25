from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Category, Cart, CartItem, Product, Order, OrderItem

# ===== AUTENTICACIÓN =====

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Este email ya está registrado"})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Agregar información adicional del usuario
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        return data


# ===== ÓRDENES =====

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_title', 'product_author', 'product_isbn', 
                  'quantity', 'price', 'subtotal', 'created_at']
        read_only_fields = ['id', 'subtotal', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_info = serializers.SerializerMethodField()
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'order_number', 'user', 'user_info', 'status', 'status_display',
                  'payment_method', 'payment_method_display', 'subtotal', 'shipping_cost', 
                  'discount', 'total', 'shipping_address', 'shipping_city', 
                  'shipping_postal_code', 'shipping_country', 'phone', 'notes',
                  'items', 'created_at', 'updated_at', 'delivered_at']
        read_only_fields = ['id', 'order_number', 'user', 'created_at', 'updated_at']

    def get_user_info(self, obj):
        return {
            'username': obj.user.username,
            'email': obj.user.email,
            'full_name': f"{obj.user.first_name} {obj.user.last_name}".strip()
        }


class CreateOrderSerializer(serializers.Serializer):
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_CHOICES)
    shipping_address = serializers.CharField(max_length=500)
    shipping_city = serializers.CharField(max_length=100)
    shipping_postal_code = serializers.CharField(max_length=20)
    shipping_country = serializers.CharField(max_length=100, default='Perú')
    phone = serializers.CharField(max_length=20)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        user = self.context['request'].user
        
        # Verificar que el usuario tenga un carrito con items
        try:
            cart = Cart.objects.get(user=user)
            if not cart.items.exists():
                raise serializers.ValidationError("El carrito está vacío")
        except Cart.DoesNotExist:
            raise serializers.ValidationError("No se encontró un carrito")
        
        return data

    def create(self, validated_data):
        user = self.context['request'].user
        cart = Cart.objects.get(user=user)
        
        # Calcular totales
        subtotal = cart.subtotal
        shipping_cost = Decimal('5.00')  # Costo fijo de envío
        discount = Decimal('0.00')
        total = subtotal + shipping_cost - discount
        
        # Crear la orden
        order = Order.objects.create(
            user=user,
            payment_method=validated_data['payment_method'],
            subtotal=subtotal,
            shipping_cost=shipping_cost,
            discount=discount,
            total=total,
            shipping_address=validated_data['shipping_address'],
            shipping_city=validated_data['shipping_city'],
            shipping_postal_code=validated_data['shipping_postal_code'],
            shipping_country=validated_data.get('shipping_country', 'Perú'),
            phone=validated_data['phone'],
            notes=validated_data.get('notes', '')
        )
        
        # Crear los items de la orden
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_title=cart_item.product.title,
                product_author=cart_item.product.author,
                product_isbn=cart_item.product.isbn or '',
                quantity=cart_item.quantity,
                price=cart_item.product.price,
                subtotal=cart_item.total_price
            )
            
            # Reducir el stock
            cart_item.product.stock -= cart_item.quantity
            cart_item.product.save()
        
        # Vaciar el carrito
        cart.items.all().delete()
        
        return order
    
class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Product
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = '__all__'
    
    def get_product_count(self, obj):
        return obj.products.count()


class CategoryListSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'slug', 'product_count']
    
    def get_product_count(self, obj):
        return obj.products.count()

class CartItemProductSerializer(serializers.ModelSerializer):
    """Serializer simplificado del producto para el carrito"""
    class Meta:
        model = Product
        fields = ['id', 'title', 'author', 'price', 'stock', 'image_url', 'isbn']


class CartItemSerializer(serializers.ModelSerializer):
    product = CartItemProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'total_price', 'added_at', 'updated_at']
        read_only_fields = ['id', 'added_at', 'updated_at']

    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError("Producto no encontrado o no disponible")
        return value

    def validate(self, data):
        product = Product.objects.get(id=data['product_id'])
        quantity = data.get('quantity', 1)
        
        if quantity > product.stock:
            raise serializers.ValidationError({
                'quantity': f'Stock insuficiente. Disponible: {product.stock}'
            })
        
        return data


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_items', 'subtotal', 'total', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']