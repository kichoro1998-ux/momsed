#!/usr/bin/env python
import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Order, Food, OrderItem, Profile

# Find a test order to reject
orders = Order.objects.all()[:3]
print(f"\n=== Available Orders ===")
for order in orders:
    print(f"Order {order.id}: Status={order.status}, Customer={order.customer.username}")
    items = order.orderitem_set.all()
    for item in items:
        print(f"  - {item.food.name} (Restaurant: {item.food.restaurant})")

# Try to get a staff user
staff_users = User.objects.filter(profile__role='restaurant')
print(f"\n=== Available Staff Users ===")
for staff in staff_users:
    print(f"Staff: {staff.username}")
    foods = Food.objects.filter(restaurant=staff)
    print(f"  Foods: {foods.count()}")
    for food in foods:
        print(f"    - {food.name}")

# Check what foods each order contains
print(f"\n=== Order Details ===")
for order in orders:
    print(f"\nOrder {order.id}:")
    for item in order.orderitem_set.all():
        print(f"  Food: {item.food.name}, Restaurant: {item.food.restaurant}")
