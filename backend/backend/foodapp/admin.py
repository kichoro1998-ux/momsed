from django.contrib import admin
from django.contrib.auth.models import User, Group
from .models import Profile, Food, Order, OrderItem, Inventory, Notification


# ======================
# PROFILE ADMIN
# ======================
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'get_email', 'role', 'first_name', 'last_name', 'phone')
    list_filter = ('role',)
    search_fields = ('user__username', 'user__email', 'first_name', 'last_name', 'phone')
    ordering = ('-id',)
    
    @admin.display(description='Username', ordering='user__username')
    def get_username(self, obj):
        try:
            return obj.user.username if obj.user and obj.user.username else '-'
        except (AttributeError, User.DoesNotExist):
            return '-'
    
    @admin.display(description='Email', ordering='user__email')
    def get_email(self, obj):
        try:
            return obj.user.email if obj.user and obj.user.email else '-'
        except (AttributeError, User.DoesNotExist):
            return '-'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')


# ======================
# FOOD ADMIN
# ======================
@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'category', 'get_restaurant', 'available')
    list_filter = ('available', 'category', 'restaurant')
    search_fields = ('name', 'description', 'restaurant__username')
    ordering = ('-id',)
    list_per_page = 50
    
    @admin.display(description='Restaurant', ordering='restaurant__username')
    def get_restaurant(self, obj):
        try:
            return obj.restaurant.username if obj.restaurant and obj.restaurant.username else '-'
        except (AttributeError, User.DoesNotExist):
            return '-'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('restaurant')


# ======================
# ORDER ADMIN
# ======================
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_customer', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('id', 'customer__username', 'customer__email', 'delivery_address')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    @admin.display(description='Customer', ordering='customer__username')
    def get_customer(self, obj):
        try:
            return obj.customer.username if obj.customer and obj.customer.username else '-'
        except (AttributeError, User.DoesNotExist):
            return '-'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('customer')


# ======================
# ORDER ITEM ADMIN
# ======================
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_order', 'get_food', 'quantity', 'price')
    search_fields = ('order__id', 'food__name')
    ordering = ('-id',)
    
    @admin.display(description='Order')
    def get_order(self, obj):
        try:
            return f"Order #{obj.order.id}" if obj.order and obj.order.id else '-'
        except (AttributeError, Order.DoesNotExist):
            return '-'
    
    @admin.display(description='Food')
    def get_food(self, obj):
        try:
            return obj.food.name if obj.food and obj.food.name else '-'
        except (AttributeError, Food.DoesNotExist):
            return '-'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('order', 'food')


# ======================
# INVENTORY ADMIN
# ======================
@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'quantity', 'unit', 'get_restaurant', 'supplier', 'updated_at')
    list_filter = ('unit', 'restaurant')
    search_fields = ('name', 'supplier', 'restaurant__username')
    ordering = ('-updated_at',)
    
    @admin.display(description='Restaurant', ordering='restaurant__username')
    def get_restaurant(self, obj):
        try:
            return obj.restaurant.username if obj.restaurant and obj.restaurant.username else '-'
        except (AttributeError, User.DoesNotExist):
            return '-'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('restaurant')


# ======================
# NOTIFICATION ADMIN
# ======================
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user', 'type', 'get_order', 'is_read', 'created_at')
    list_filter = ('is_read', 'type', 'created_at')
    search_fields = ('user__username', 'message', 'order__id')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    
    @admin.display(description='User', ordering='user__username')
    def get_user(self, obj):
        try:
            return obj.user.username if obj.user and obj.user.username else '-'
        except (AttributeError, User.DoesNotExist):
            return '-'
    
    @admin.display(description='Order')
    def get_order(self, obj):
        try:
            return f"Order #{obj.order.id}" if obj.order and obj.order.id else '-'
        except (AttributeError, Order.DoesNotExist):
            return '-'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'order')
