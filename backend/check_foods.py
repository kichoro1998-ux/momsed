import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from foodapp.models import Food

foods = Food.objects.all()
print(f'Total foods in database: {foods.count()}')
for food in foods:
    print(f'  - {food.id}: {food.name} (available: {food.available}, restaurant: {food.restaurant})')

# Also check available foods (what the API returns)
available_foods = Food.objects.filter(available=True)
print(f'\nAvailable foods (what API returns): {available_foods.count()}')
for food in available_foods:
    print(f'  - {food.id}: {food.name}')
