#!/usr/bin/env python
import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from foodapp.models import Order

# Get admin user
admin_user = User.objects.get(username='admin')
print(f"Admin user: {admin_user.username}")

# Generate token
refresh = RefreshToken.for_user(admin_user)
access_token = str(refresh.access_token)
print(f"\nAccess token: {access_token}\n")

# Find a valid order that admin can reject
order = Order.objects.filter(status='pending').first()
if order and order.orderitem_set.filter(food__restaurant=admin_user).exists():
    print(f"Testing with Order {order.id}")
else:
    # Create or find another order
    orders = Order.objects.filter(orderitem__food__restaurant=admin_user, status='pending').distinct()
    if orders.exists():
        order = orders.first()
        print(f"Testing with Order {order.id}")
    else:
        print("No suitable order found")
        sys.exit(1)

# Create a curl command to test the reject endpoint
print(f"\nCurl command to test reject:")
print(f"""curl -X POST http://localhost:8000/api/orders/{order.id}/reject/ \\
  -H "Authorization: Bearer {access_token}" \\
  -H "Content-Type: application/json" \\
  -d '{{"reason": "Out of stock"}}'
""")
