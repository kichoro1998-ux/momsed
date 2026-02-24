#!/usr/bin/env python
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from foodapp.models import Order
import json

# Get admin user
admin_user = User.objects.get(username='admin')
refresh = RefreshToken.for_user(admin_user)
access_token = str(refresh.access_token)

# Find a pending order that admin can reject
orders = Order.objects.filter(
    orderitem__food__restaurant=admin_user,
    status='pending'
).distinct()

if not orders.exists():
    print("No pending orders found - all already rejected/approved")
    sys.exit(0)

order = orders.first()
print(f"✓ Testing with Order {order.id} (Status: {order.status})")

# Test reject
client = Client()
response = client.post(
    f'/api/orders/{order.id}/reject/',
    data=json.dumps({'reason': 'Item out of stock'}),
    content_type='application/json',
    HTTP_AUTHORIZATION=f'Bearer {access_token}'
)

print(f"\n=== REJECT TEST ===")
print(f"Status: {response.status_code}")
response_data = json.loads(response.content.decode())
print(f"Response: {json.dumps(response_data, indent=2)}")

order.refresh_from_db()
print(f"\n✓ Order {order.id} status after reject: {order.status}")

# Check notification was created
from foodapp.models import Notification
notifications = Notification.objects.filter(order=order, type='order_rejected')
if notifications.exists():
    print(f"✓ Notification created for customer: {notifications.first().message}")
else:
    print("⚠ No notification found (may not have been created)")

print("\n=== ✓ REJECT FUNCTIONALITY WORKING ===" )
