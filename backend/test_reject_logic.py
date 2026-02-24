#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Order, Food, OrderItem, Profile

# Find the admin user
try:
    admin_user = User.objects.get(username='admin')
    print(f"✓ Admin user found: {admin_user.username}")
except:
    print("✗ Admin user not found")
    sys.exit(1)

# Get orders that can be rejected by admin
print("\n=== Checking Orders for admin user ===")
all_orders = Order.objects.all()
print(f"Total orders in DB: {all_orders.count()}")

for order in all_orders:
    print(f"\nOrder {order.id}: Status={order.status}, Customer={order.customer.username}")
    items = order.orderitem_set.all()
    for item in items:
        can_reject = Food.objects.filter(id=item.food.id, restaurant=admin_user).exists()
        print(f"  - {item.food.name}")
        print(f"    Food.restaurant = {item.food.restaurant} (ID: {item.food.restaurant.id if item.food.restaurant else 'None'})")
        print(f"    Can admin reject? {can_reject}")

# Try the reject logic manually
print("\n\n=== Testing reject logic for Order 5 ===")
try:
    order = Order.objects.get(id=5)
    print(f"Order found: {order.id}")
    
    # Simulate the reject check
    can_reject = order.orderitem_set.filter(food__restaurant=admin_user).exists()
    print(f"Does order have items from admin's restaurant? {can_reject}")
    
    if can_reject:
        print("✓ Admin CAN reject this order")
        # Try the actual reject
        order.status = 'cancelled'
        order.save()
        print("✓ Order status updated to 'cancelled'")
    else:
        print("✗ Admin CANNOT reject this order - permission denied")
        
except Order.DoesNotExist:
    print("Order 5 not found")
