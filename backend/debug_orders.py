import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Food, Order, Profile

print("\n" + "="*70)
print("STAFF ORDERS DEBUG REPORT")
print("="*70)

# Get all restaurant staff
restaurants = User.objects.filter(profile__role='restaurant')
print(f"\n📊 Total restaurant staff: {restaurants.count()}")

for restaurant in restaurants:
    print(f"\n👨‍💼 Restaurant: {restaurant.username} (ID: {restaurant.id}, Email: {restaurant.email})")
    
    # Check profile
    try:
        profile = restaurant.profile
        print(f"   ✓ Profile exists - Role: {profile.role}")
    except Profile.DoesNotExist:
        print(f"   ✗ ERROR: No profile found!")
        continue
    
    # Check foods created by this restaurant
    foods = Food.objects.filter(restaurant=restaurant)
    print(f"   📦 Foods created: {foods.count()}")
    for food in foods:
        print(f"      - {food.name} (ID: {food.id}, Price: ${food.price})")
    
    # Check orders for this restaurant's foods
    orders = Order.objects.filter(orderitem__food__restaurant=restaurant).distinct()
    print(f"   📋 Orders with their food: {orders.count()}")
    for order in orders:
        print(f"      - Order #{order.id} (Status: {order.status}, Customer: {order.customer.username})")
        items = order.orderitem_set.filter(food__restaurant=restaurant)
print(f"Total restaurant staff: {restaurants.count()}")
print(f"Total orders: {Order.objects.count()}")
print(f"Total foods: {Food.objects.count()}")

# List all orders
print(f"\n📋 ALL ORDERS IN SYSTEM:")
all_orders = Order.objects.all().order_by('-created_at')
if all_orders.count() == 0:
    print("   ⚠️  NO ORDERS FOUND IN DATABASE")
else:
    for order in all_orders:
        print(f"   Order #{order.id}")
        print(f"      Customer: {order.customer.username}")
        print(f"      Status: {order.status}")
        print(f"      Items: {order.orderitem_set.count()}")
        for item in order.orderitem_set.all():
            print(f"         - {item.food.name} (Restaurant: {item.food.restaurant.username if item.food.restaurant else 'None'})")

print("\n" + "="*70)
print("DIAGNOSIS:")
print("="*70)

if Food.objects.count() == 0:
    print("❌ ISSUE 1: No food items in database!")
    print("   → Solution: Create food items first (see populate_all_foods.py)")

if Order.objects.count() == 0:
    print("❌ ISSUE 2: No orders in database!")
    print("   → Solution: Create customer account and place order")

for restaurant in restaurants:
    foods = Food.objects.filter(restaurant=restaurant)
    orders = Order.objects.filter(orderitem__food__restaurant=restaurant).distinct()
    
    if foods.count() == 0:
        print(f"❌ ISSUE 3: Restaurant '{restaurant.username}' has NO food items!")
        print(f"   → Solution: Restaurant must create/upload food items")
    elif orders.count() == 0:
        print(f"⚠️  ISSUE 4: Restaurant '{restaurant.username}' has foods but NO orders!")
        print(f"   → Solution: Customers need to place orders containing their foods")
    else:
        print(f"✅ Restaurant '{restaurant.username}' has {foods.count()} foods and {orders.count()} orders")

print("\n" + "="*70 + "\n")
