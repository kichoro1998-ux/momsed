from django.contrib import admin
from .models import Profile, Food, Order, OrderItem

admin.site.register(Profile)

@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'restaurant', 'available')
    list_filter = ('available', 'restaurant')
    search_fields = ('name', 'restaurant__username')