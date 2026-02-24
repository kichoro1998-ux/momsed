import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Food, Profile

# Get or create a restaurant user (superuser can act as restaurant)
restaurant_user = User.objects.filter(username='momsed').first()
if not restaurant_user:
    print("Error: Restaurant user 'momsed' not found")
    exit()

# Ensure the user has a restaurant profile
profile, created = Profile.objects.get_or_create(user=restaurant_user)
if created:
    profile.role = 'restaurant'
    profile.save()
    print(f"Created restaurant profile for {restaurant_user.username}")

# Sample foods to create
sample_foods = [
    {
        'name': 'Margherita Pizza',
        'description': 'Classic pizza with tomato, mozzarella, and basil',
        'price': Decimal('12.99'),
        'category': 'Main',
        'stock': 50,
        'available': True,
    },
    {
        'name': 'Caesar Salad',
        'description': 'Fresh romaine lettuce with parmesan and croutons',
        'price': Decimal('9.99'),
        'category': 'Main',
        'stock': 40,
        'available': True,
    },
    {
        'name': 'Grilled Chicken Burger',
        'description': 'Juicy grilled chicken breast with lettuce, tomato, and mayo',
        'price': Decimal('11.99'),
        'category': 'Main',
        'stock': 35,
        'available': True,
    },
    {
        'name': 'Garlic Bread',
        'description': 'Crispy garlic-infused bread',
        'price': Decimal('4.99'),
        'category': 'Side',
        'stock': 60,
        'available': True,
    },
    {
        'name': 'Chocolate Cake',
        'description': 'Rich and moist chocolate cake with frosting',
        'price': Decimal('5.99'),
        'category': 'Dessert',
        'stock': 25,
        'available': True,
    },
    {
        'name': 'Iced Tea',
        'description': 'Refreshing cold iced tea',
        'price': Decimal('2.99'),
        'category': 'Drink',
        'stock': 100,
        'available': True,
    },
]

# Create foods
created_count = 0
for food_data in sample_foods:
    food, created = Food.objects.get_or_create(
        name=food_data['name'],
        defaults={
            'description': food_data['description'],
            'price': food_data['price'],
            'category': food_data['category'],
            'stock': food_data['stock'],
            'available': food_data['available'],
            'restaurant': restaurant_user,
        }
    )
    if created:
        created_count += 1
        print(f"✓ Created: {food.name} (${food.price})")
    else:
        print(f"- Already exists: {food.name}")

print(f"\n{created_count} new food items created!")
print(f"Total foods now: {Food.objects.count()}")
print(f"Available foods: {Food.objects.filter(available=True).count()}")
