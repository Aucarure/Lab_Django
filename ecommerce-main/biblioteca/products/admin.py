from django.contrib import admin
from .models import (
    Category, Product, Cart, CartItem,
    Order, OrderItem
)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product_title', 'product_author', 'price', 'subtotal']
    fields = ['product', 'product_title', 'product_author', 'quantity', 'price', 'subtotal']


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'user', 'status', 'payment_method', 'total', 'created_at']
    list_filter = ['status', 'payment_method', 'created_at']
    search_fields = ['order_number', 'user__username', 'user__email']
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Información General', {
            'fields': ('order_number', 'user', 'status', 'payment_method')
        }),
        ('Totales', {
            'fields': ('subtotal', 'shipping_cost', 'discount', 'total')
        }),
        ('Información de Envío', {
            'fields': ('shipping_address', 'shipping_city', 'shipping_postal_code', 
                      'shipping_country', 'phone')
        }),
        ('Notas y Fechas', {
            'fields': ('notes', 'created_at', 'updated_at', 'delivered_at')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product_title', 'quantity', 'price', 'subtotal']
    list_filter = ['created_at']
    search_fields = ['product_title', 'order__order_number']
    readonly_fields = ['subtotal', 'created_at']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'price', 'stock', 'rating', 'is_active']
    list_filter = ['category', 'is_active', 'language', 'created_at']
    search_fields = ['title', 'author', 'isbn']
    list_editable = ['price', 'stock', 'is_active']
    readonly_fields = ['created_at', 'updated_at']

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ['total_price', 'added_at']
    fields = ['product', 'quantity', 'total_price', 'added_at']


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'session_key', 'total_items', 'total', 'updated_at']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['user__username', 'session_key']
    readonly_fields = ['created_at', 'updated_at', 'total_items', 'subtotal', 'total']
    inlines = [CartItemInline]

    def total_items(self, obj):
        return obj.total_items
    total_items.short_description = 'Items'


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'cart', 'product', 'quantity', 'total_price', 'added_at']
    list_filter = ['added_at', 'updated_at']
    search_fields = ['product__title', 'cart__user__username']
    readonly_fields = ['total_price', 'added_at', 'updated_at']