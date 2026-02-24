#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Profile, Food

# Get admin user
admin = User.objects.get(username='admin')
print(f"Admin user: {admin.username}")
print(f"Admin authenticated: {admin.is_authenticated}")

# Check profile
try:
    profile = admin.profile
    print(f"Admin profile found: {profile.role}")
except Profile.DoesNotExist:
    print("ERROR: No profile for admin user!")

# Check foods
admin_foods = Food.objects.filter(restaurant=admin)
print(f"\nAdmin's foods: {admin_foods.count()}")
for food in admin_foods:
    print(f"  - {food.name}")

# Check all available foods
all_available = Food.objects.filter(available=True)
print(f"\nAll available foods: {all_available.count()}")
