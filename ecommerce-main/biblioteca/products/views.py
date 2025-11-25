from rest_framework import viewsets, filters, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Cart, CartItem, Product, Order, OrderItem
from .serializers import (
    CategorySerializer, CategoryListSerializer, ProductSerializer, CartSerializer,
    CartItemSerializer, RegisterSerializer, UserSerializer, CustomTokenObtainPairSerializer,
    OrderSerializer, CreateOrderSerializer
)

# ===== AUTENTICACIÓN =====

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Usuario registrado exitosamente'
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Obtener información del usuario actual"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# ===== ÓRDENES =====

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Solo mostrar las órdenes del usuario actual
        return Order.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def create_order(self, request):
        """Crear una orden desde el carrito actual"""
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        order_serializer = OrderSerializer(order)
        return Response({
            'message': 'Orden creada exitosamente',
            'order': order_serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """Obtener historial completo de compras del usuario"""
        orders = self.get_queryset().order_by('-created_at')
        
        # Filtros opcionales
        status_filter = request.query_params.get('status', None)
        if status_filter:
            orders = orders.filter(status=status_filter)
        
        # Paginación
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        """Cancelar una orden (solo si está pendiente)"""
        order = self.get_object()
        
        if order.status != 'pending':
            return Response(
                {'error': 'Solo se pueden cancelar órdenes pendientes'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        # Devolver stock
        for item in order.items.all():
            if item.product:
                item.product.stock += item.quantity
                item.product.save()
        
        serializer = self.get_serializer(order)
        return Response({
            'message': 'Orden cancelada exitosamente',
            'order': serializer.data
        })

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Estadísticas de compras del usuario"""
        orders = self.get_queryset()
        
        stats = {
            'total_orders': orders.count(),
            'total_spent': sum(order.total for order in orders),
            'orders_by_status': {
                'pending': orders.filter(status='pending').count(),
                'processing': orders.filter(status='processing').count(),
                'shipped': orders.filter(status='shipped').count(),
                'delivered': orders.filter(status='delivered').count(),
                'cancelled': orders.filter(status='cancelled').count(),
            },
            'last_order': None
        }
        
        last_order = orders.first()
        if last_order:
            stats['last_order'] = OrderSerializer(last_order).data
        
        return Response(stats)

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
    
from django.http import JsonResponse

def lista_productos(request):
    return JsonResponse({"mensaje": "funciona"})
