import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Food, Profile

# Get or create a restaurant user
restaurant_user = User.objects.filter(username='momsed').first()
if not restaurant_user:
    print("Error: Restaurant user 'momsed' not found")
    exit()

# Ensure the user has a restaurant profile
profile, created = Profile.objects.get_or_create(user=restaurant_user)
if created:
    profile.role = 'restaurant'
    profile.save()

# Map all 15 images to food items
all_foods = [
    {
        'name': 'Cheese Pizza',
        'description': 'Delicious cheese pizza with melted mozzarella',
        'price': Decimal('13.99'),
        'category': 'Main',
        'stock': 50,
        'image': 'foods/PIZZA-CHEES.jpg',
        'available': True,
    },
    {
        'name': 'Classic Pizza',
        'description': 'Traditional pizza with fresh toppings',
        'price': Decimal('14.99'),
        'category': 'Main',
        'stock': 45,
        'image': 'foods/Pizza.jpg',
        'available': True,
    },
    {
        'name': 'Appetizer Platter',
        'description': 'Mixed appetizer platter with various selections',
        'price': Decimal('16.99'),
        'category': 'Appetizer',
        'stock': 30,
        'image': 'foods/appee.jpg',
        'available': True,
    },
    {
        'name': 'Crispy Burger',
        'description': 'Juicy burger with crispy patty and toppings',
        'price': Decimal('11.99'),
        'category': 'Main',
        'stock': 40,
        'image': 'foods/Burger-Recipe.jpg',
        'available': True,
    },
    {
        'name': 'Classic Burger',
        'description': 'Classic American burger with cheese and bacon',
        'price': Decimal('10.99'),
        'category': 'Main',
        'stock': 35,
        'image': 'foods/burger.jpg',
        'available': True,
    },
    {
        'name': 'Buttermilk Chicken',
        'description': 'Tender buttermilk fried chicken',
        'price': Decimal('12.99'),
        'category': 'Main',
        'stock': 50,
        'image': 'foods/buttermilk-chiken.jpg',
        'available': True,
    },
    {
        'name': 'Cheese Ice Cream',
        'description': 'Unique cheese-flavored ice cream',
        'price': Decimal('5.99'),
        'category': 'Dessert',
        'stock': 60,
        'image': 'foods/cheese-icesd.jpg',
        'available': True,
    },
    {
        'name': 'Chocolate Sorbet',
        'description': 'Rich chocolate sorbet dessert',
        'price': Decimal('6.99'),
        'category': 'Dessert',
        'stock': 40,
        'image': 'foods/chocolate-sorbet.jpg',
        'available': True,
    },
    {
        'name': 'French Fries',
        'description': 'Golden crispy french fries',
        'price': Decimal('4.99'),
        'category': 'Side',
        'stock': 80,
        'image': 'foods/delicious-fried-french.jpg',
        'available': True,
    },
    {
        'name': 'Fried Chips',
        'description': 'Crunchy fried potato chips',
        'price': Decimal('3.99'),
        'category': 'Side',
        'stock': 100,
        'image': 'foods/fried-chips.jpg',
        'available': True,
    },
    {
        'name': 'Fish Kebab',
        'description': 'Grilled fish kebab with spices',
        'price': Decimal('15.99'),
        'category': 'Main',
        'stock': 25,
        'image': 'foods/kibeling-fisj.jpg',
        'available': True,
    },
    {
        'name': 'Maldive Specialty',
        'description': 'Special Maldivian cuisine dish',
        'price': Decimal('17.99'),
        'category': 'Main',
        'stock': 20,
        'image': 'foods/maldise.jpg',
        'available': True,
    },
    {
        'name': 'Cheese Appetizer',
        'description': 'Delicious cheese appetizer selection',
        'price': Decimal('15.99'),
        'category': 'Appetizer',
        'stock': 5,
        'image': 'foods/pngtree-testy-cheese.jpg',
        'available': True,
    },
    {
        'name': 'Appitzer Special',
        'description': 'Special appetizer with premium ingredients',
        'price': Decimal('13.99'),
        'category': 'Appetizer',
        'stock': 30,
        'image': 'foods/Appitzer.jpg',
        'available': True,
    },
    {
        'name': 'Tea with Cheese',
        'description': 'Refreshing tea served with cheese',
        'price': Decimal('12.99'),
        'category': 'Drink',
        'stock': 15,
        'image': 'foods/Teechees.jpg',
        'available': True,
    },
]

# Create foods
created_count = 0
for food_data in all_foods:
    food, created = Food.objects.get_or_create(
        name=food_data['name'],
        defaults={
            'description': food_data['description'],
            'price': food_data['price'],
            'category': food_data['category'],
            'stock': food_data['stock'],
            'image': food_data['image'],
            'available': food_data['available'],
            'restaurant': restaurant_user,
        }
    )
    if created:
        created_count += 1
        print(f"✓ Created: {food.name} (${food.price}) - {food.image}")
    else:
        print(f"- Already exists: {food.name}")

print(f"\n{'='*60}")
print(f"✅ {created_count} new food items created!")
print(f"📊 Total foods now: {Food.objects.count()}")
print(f"✨ Available foods: {Food.objects.filter(available=True).count()}")
print(f"{'='*60}")
