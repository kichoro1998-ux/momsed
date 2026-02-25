import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Inventory, Profile, Food

# Get restaurant user
restaurant_user = User.objects.filter(profile__role='restaurant').first()
if not restaurant_user:
    restaurant_user = User.objects.filter(is_superuser=True).first()
if not restaurant_user:
    restaurant_user = User.objects.first()

if not restaurant_user:
    print("Error: No users found")
    exit()

# Ensure restaurant profile
profile, created = Profile.objects.get_or_create(user=restaurant_user)
profile.role = 'restaurant'
profile.save()
print(f"Using: {restaurant_user.username}")

# Get all foods
foods = Food.objects.all()
print(f"Found {foods.count()} foods")

# Clear inventory
Inventory.objects.all().delete()
print("Cleared inventory")

# Create ONE inventory item per food (17 items total)
inventory_for_foods = [
    {'name': 'Burger Buns & Patty', 'quantity': 20, 'unit': 'pcs', 'supplier': 'Bakery & Meat Supplier'},
    {'name': 'Appitzer Flour & Cheese', 'quantity': 10, 'unit': 'kg', 'supplier': 'Bakery Fresh'},
    {'name': 'Pizza Dough & Sauce', 'quantity': 15, 'unit': 'kg', 'supplier': 'Italian Imports'},
    {'name': 'Tea Leaves & Milk', 'quantity': 10, 'unit': 'l', 'supplier': 'Beverage Suppliers'},
    {'name': 'Apple Juice', 'quantity': 30, 'unit': 'l', 'supplier': 'Beverage Suppliers'},
    {'name': 'Chicken & Buttermilk', 'quantity': 15, 'unit': 'kg', 'supplier': 'Poultry Farm'},
    {'name': 'Ice Cream Base', 'quantity': 15, 'unit': 'l', 'supplier': 'Frozen Foods'},
    {'name': 'Chocolate', 'quantity': 5, 'unit': 'kg', 'supplier': 'Baking Supplies'},
    {'name': 'Potatoes', 'quantity': 40, 'unit': 'kg', 'supplier': 'Green Farms'},
    {'name': 'Fish Fillet', 'quantity': 15, 'unit': 'kg', 'supplier': 'Seafood Market'},
    {'name': 'Flour & Sugar', 'quantity': 20, 'unit': 'kg', 'supplier': 'Wholesale Grocers'},
    {'name': 'Meat (Beef)', 'quantity': 20, 'unit': 'kg', 'supplier': 'Meat Supplier'},
    {'name': 'Mozzarella Cheese', 'quantity': 10, 'unit': 'kg', 'supplier': 'Dairy Plus'},
    {'name': 'Eggs', 'quantity': 100, 'unit': 'pcs', 'supplier': 'Poultry Farm'},
    {'name': 'Cooking Oil', 'quantity': 20, 'unit': 'l', 'supplier': 'Wholesale Grocers'},
    {'name': 'Dairy Products', 'quantity': 15, 'unit': 'kg', 'supplier': 'Dairy Plus'},
    {'name': 'Spices & Herbs', 'quantity': 5, 'unit': 'kg', 'supplier': 'Spice Masters'},
]

for item_data in inventory_for_foods:
    item = Inventory.objects.create(
        name=item_data['name'],
        quantity=Decimal(str(item_data['quantity'])),
        unit=item_data['unit'],
        supplier=item_data['supplier'],
        restaurant=restaurant_user,
    )
    print(f"✓ {item.name} ({item.quantity} {item.unit})")

print(f"\nTotal inventory: {Inventory.objects.count()} items")

