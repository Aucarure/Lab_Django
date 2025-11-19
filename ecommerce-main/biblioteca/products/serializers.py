from rest_framework import serializers
from .models import Category, Cart, CartItem, Product

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