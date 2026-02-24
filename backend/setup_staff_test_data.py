#!/usr/bin/env python
"""
Setup test data for staff user to properly test order management features
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Profile, Food, Order, OrderItem
from decimal import Decimal

print("=" * 70)
print("SETUP TEST DATA FOR STAFF USER")
print("=" * 70)

# Get the admin restaurant staff user
try:
    admin_user = User.objects.get(username='admin')
    admin_profile = Profile.objects.get(user=admin_user)
    print(f"\n✓ Found staff user: {admin_user.username}")
except User.DoesNotExist:
    print("\n✗ Admin user not found. Creating...")
    admin_user = User.objects.create_user(username='admin', email='admin@restaurant.com', password='admin123')
    admin_profile = Profile.objects.create(user=admin_user, role='restaurant')
    print(f"✓ Created staff user: {admin_user.username}")

print(f"  Email: {admin_user.email}")
print(f"  Role: {admin_profile.role}")

# Get or create foods for the admin user
foods_data = [
    {"name": "Grilled Chicken Sandwich", "description": "Fresh grilled chicken with lettuce and tomato", "price": 9.99, "category": "Sandwich"},
    {"name": "Margherita Pizza", "description": "Classic pizza with tomato, mozzarella, and basil", "price": 12.99, "category": "Pizza"},
    {"name": "Caesar Salad", "description": "Crisp romaine lettuce with Caesar dressing and parmesan", "price": 8.99, "category": "Salad"},
    {"name": "Spaghetti Carbonara", "description": "Creamy pasta with bacon and parmesan cheese", "price": 11.99, "category": "Pasta"},
    {"name": "Chocolate Cake", "description": "Rich chocolate cake with chocolate frosting", "price": 5.99, "category": "Dessert"},
]

print(f"\n📦 Creating food items for {admin_user.username}...")
created_foods = []
for food_data in foods_data:
    food, created = Food.objects.get_or_create(
        name=food_data['name'],
        restaurant=admin_user,
        defaults={
            'description': food_data['description'],
            'price': Decimal(str(food_data['price'])),
            'category': food_data['category']
        }
    )
    if created:
        print(f"  ✓ Created: {food.name} (${food.price})")
    else:
        print(f"  ℹ Exists: {food.name}")
    created_foods.append(food)

# Get or create the test customer
try:
    customer_user = User.objects.get(username='momse')
    customer_profile = Profile.objects.get(user=customer_user)
    print(f"\n✓ Found customer user: {customer_user.username}")
except User.DoesNotExist:
    print("\n✗ Customer user not found. Creating...")
    customer_user = User.objects.create_user(username='momse', email='customer@example.com', password='password123')
    customer_profile = Profile.objects.create(user=customer_user, role='customer')
    print(f"✓ Created customer user: {customer_user.username}")

# Create test orders for the admin restaurant
print(f"\n📋 Creating test orders for {customer_user.username}...")
test_order_data = [
    [created_foods[0]],  # Grilled Chicken Sandwich
    [created_foods[1]],  # Margherita Pizza
    [created_foods[2], created_foods[4]],  # Caesar Salad + Chocolate Cake
    [created_foods[3], created_foods[1]],  # Spaghetti + Pizza
]

for i, items in enumerate(test_order_data, 1):
    order = Order.objects.create(
        customer=customer_user,
        status='pending',
        delivery_address=f'Test Address {i}'
    )
    
    total_price = Decimal('0')
    items_str = []
    for food in items:
        OrderItem.objects.create(
            order=order,
            food=food,
            quantity=1
        )
        total_price += food.price
        items_str.append(food.name)
    
    order.total_price = total_price
    order.save()
    
    print(f"  ✓ Order #{order.id}: {', '.join(items_str)} (${order.total_price})")

print("\n" + "=" * 70)
print("✓ TEST DATA SETUP COMPLETE")
print("=" * 70)

# Verify
print(f"\n📊 Verification:")
admin_foods = Food.objects.filter(restaurant=admin_user).count()
admin_orders = Order.objects.filter(orderitem__food__restaurant=admin_user).distinct().count()
print(f"  Foods for admin: {admin_foods}")
print(f"  Orders for admin: {admin_orders}")

if admin_foods > 0 and admin_orders > 0:
    print(f"\n✓ SUCCESS! Staff user '{admin_user.username}' can now see orders.")
else:
    print(f"\n✗ FAILED: Expected foods and orders, but got {admin_foods} foods and {admin_orders} orders")
