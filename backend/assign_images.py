import os
import django
from pathlib import Path

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.conf import settings
from foodapp.models import Food

# Map food items to image files
food_image_mapping = {
    'Margherita Pizza': 'foods/PIZZA-CHEES.jpg',
    'Caesar Salad': 'foods/appee.jpg',
    'Grilled Chicken Burger': 'foods/Burger-Recipe.jpg',
    'Garlic Bread': 'foods/delicious-fried-french.jpg',
    'Chocolate Cake': 'foods/chocolate-sorbet.jpg',
    'Iced Tea': 'foods/Teechees.jpg',
}

updated_count = 0

for food_name, image_path in food_image_mapping.items():
    try:
        food = Food.objects.get(name=food_name)
        # Check if image file exists using Django's MEDIA_ROOT
        full_path = os.path.join(settings.MEDIA_ROOT, image_path)
        if os.path.exists(full_path):
            food.image = image_path
            food.save()
            print(f"✓ Updated {food_name} with image: {image_path}")
            updated_count += 1
        else:
            print(f"✗ Image not found at: {full_path}")
    except Food.DoesNotExist:
        print(f"✗ Food not found: {food_name}")

print(f"\n{updated_count} food items updated with images!")

# Verify all foods have images
foods_with_images = Food.objects.filter(image__isnull=False).exclude(image='')
foods_without_images = Food.objects.filter(image__isnull=True) | Food.objects.filter(image='')

print(f"\nFoods with images: {foods_with_images.count()}")
for food in foods_with_images:
    print(f"  - {food.name}: {food.image}")

if foods_without_images.count() > 0:
    print(f"\nFoods without images: {foods_without_images.count()}")
    for food in foods_without_images:
        print(f"  - {food.name}")
