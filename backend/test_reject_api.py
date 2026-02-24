#!/usr/bin/env python
import os
import sys
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from foodapp.models import Order

# Get admin user
admin_user = User.objects.get(username='admin')
refresh = RefreshToken.for_user(admin_user)
access_token = str(refresh.access_token)

# Find a valid pending order that admin can reject
orders = Order.objects.filter(
    orderitem__food__restaurant=admin_user,
    status='pending'
).distinct()

if not orders.exists():
    print("No pending orders found for admin to reject")
    sys.exit(1)

order = orders.first()
print(f"Testing reject for Order {order.id}")

# Create a Django test client
client = Client()

# Test the reject endpoint
url = f'/api/orders/{order.id}/reject/'
data = json.dumps({'reason': 'Testing reject endpoint'})

print(f"\nMaking POST request to: {url}")
response = client.post(
    url,
    data=data,
    content_type='application/json',
    HTTP_AUTHORIZATION=f'Bearer {access_token}'
)

print(f"Status code: {response.status_code}")
print(f"Response: {response.content.decode()}")

# Check if order was actually rejected
order.refresh_from_db()
print(f"\nOrder status after request: {order.status}")
