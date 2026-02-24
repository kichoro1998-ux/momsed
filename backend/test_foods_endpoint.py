#!/usr/bin/env python
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.test import Client
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

# Get admin user and generate token
admin_user = User.objects.get(username='admin')
refresh = RefreshToken.for_user(admin_user)
access_token = str(refresh.access_token)

print(f"Testing foods endpoint for admin user: {admin_user.username}")

# Create a Django test client
client = Client()

# Test 1: Unauthenticated request (should see available foods)
print("\n=== TEST 1: Unauthenticated request ===")
response = client.get('/api/foods/')
print(f"Status: {response.status_code}")
data = json.loads(response.content.decode())
if isinstance(data, list):
    print(f"Foods returned: {len(data)}")
    if data:
        print(f"First food: {data[0].get('name')} (restaurant: {data[0].get('restaurant')})")
else:
    print(f"Response: {data}")

# Test 2: Authenticated as admin (should see all foods including their own)
print("\n=== TEST 2: Authenticated as admin ===")
response = client.get(
    '/api/foods/',
    HTTP_AUTHORIZATION=f'Bearer {access_token}'
)
print(f"Status: {response.status_code}")
data = json.loads(response.content.decode())
if isinstance(data, list):
    print(f"Foods returned: {len(data)}")
    admin_foods = [f for f in data if f.get('restaurant_detail', {}).get('username') == 'admin' or f.get('restaurant') == admin_user.id]
    print(f"Admin's foods in list: {len(admin_foods)}")
    for food in data[-5:]:  # Show last 5 (most recent)
        print(f"  - {food.get('name')} (Restaurant: {food.get('restaurant')})")
else:
    print(f"Response: {data}")
