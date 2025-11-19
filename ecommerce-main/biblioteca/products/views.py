from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Cart, CartItem, Product
from .serializers import CategorySerializer, CategoryListSerializer, ProductSerializer, CartSerializer, CartItemSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        return CategorySerializer
    
    @action(detail=True, methods=['get'])
    def products(self, request, pk=None):
        category = self.get_object()
        products = category.products.filter(is_active=True)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'author', 'publisher', 'language']
    search_fields = ['title', 'author', 'description', 'isbn']
    ordering_fields = ['price', 'created_at', 'rating', 'title']
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category_id = request.query_params.get('category_id')
        if category_id:
            products = self.queryset.filter(category_id=category_id)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'category_id parameter is required'}, status=400)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        products = self.queryset.filter(rating__gte=4.0).order_by('-rating')[:10]
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]  # Cambiar según necesidades de autenticación

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Cart.objects.filter(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            if not session_key:
                self.request.session.create()
                session_key = self.request.session.session_key
            return Cart.objects.filter(session_key=session_key)

    def get_or_create_cart(self):
        """Obtiene o crea un carrito para el usuario o sesión actual"""
        if self.request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=self.request.user)
        else:
            session_key = self.request.session.session_key
            if not session_key:
                self.request.session.create()
                session_key = self.request.session.session_key
            cart, created = Cart.objects.get_or_create(session_key=session_key)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """Obtiene el carrito actual del usuario/sesión"""
        cart = self.get_or_create_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Agrega un producto al carrito"""
        cart = self.get_or_create_cart()
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response(
                {'error': 'product_id es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response(
                {'error': 'Producto no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        # Verificar stock
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        new_quantity = quantity if not cart_item else cart_item.quantity + quantity

        if new_quantity > product.stock:
            return Response(
                {'error': f'Stock insuficiente. Disponible: {product.stock}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Crear o actualizar item
        if cart_item:
            cart_item.quantity = new_quantity
            cart_item.save()
            message = 'Cantidad actualizada'
        else:
            cart_item = CartItem.objects.create(
                cart=cart,
                product=product,
                quantity=quantity
            )
            message = 'Producto agregado al carrito'

        serializer = CartSerializer(cart)
        return Response({
            'message': message,
            'cart': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """Actualiza la cantidad de un item en el carrito"""
        cart = self.get_or_create_cart()
        item_id = request.data.get('item_id')
        quantity = request.data.get('quantity')

        if not item_id or quantity is None:
            return Response(
                {'error': 'item_id y quantity son requeridos'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Item no encontrado en el carrito'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        if quantity <= 0:
            cart_item.delete()
            message = 'Producto eliminado del carrito'
        else:
            if quantity > cart_item.product.stock:
                return Response(
                    {'error': f'Stock insuficiente. Disponible: {cart_item.product.stock}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = quantity
            cart_item.save()
            message = 'Cantidad actualizada'

        serializer = CartSerializer(cart)
        return Response({
            'message': message,
            'cart': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Elimina un item del carrito"""
        cart = self.get_or_create_cart()
        item_id = request.data.get('item_id')

        if not item_id:
            return Response(
                {'error': 'item_id es requerido'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cart_item = CartItem.objects.get(id=item_id, cart=cart)
            cart_item.delete()
        except CartItem.DoesNotExist:
            return Response(
                {'error': 'Item no encontrado'}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CartSerializer(cart)
        return Response({
            'message': 'Producto eliminado del carrito',
            'cart': serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Vacía el carrito"""
        cart = self.get_or_create_cart()
        cart.items.all().delete()
        
        serializer = CartSerializer(cart)
        return Response({
            'message': 'Carrito vaciado',
            'cart': serializer.data
        }, status=status.HTTP_200_OK)