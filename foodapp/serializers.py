from rest_framework import serializers
from .models import Food, Order, OrderItem, Profile, Inventory, Notification
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone = serializers.CharField(required=False, default='')
    address = serializers.CharField(required=False, default='')

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'first_name', 'last_name', 'phone', 'address']

    def create(self, validated_data):
        # Always set role to 'customer' for public registration
        # Restaurant staff accounts are created internally by system developers
        role = 'customer'
        first_name = validated_data.pop('first_name', '')
        last_name = validated_data.pop('last_name', '')
        phone = validated_data.pop('phone', '')
        address = validated_data.pop('address', '')
        
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email']
        )
        
        # Create or update Profile with the selected role and additional fields
        profile, created = Profile.objects.get_or_create(user=user, defaults={
            'role': role,
            'first_name': first_name,
            'last_name': last_name,
            'phone': phone,
            'address': address
        })
        if not created:
            profile.role = role
            profile.first_name = first_name
            profile.last_name = last_name
            profile.phone = phone
            profile.address = address
            profile.save()
        return user


class FoodSerializer(serializers.ModelSerializer):
    # Return full image URL for frontend display
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Food
        fields = ['id', 'name', 'description', 'price', 'stock', 'category', 'image', 'available', 'restaurant']
        read_only_fields = ['restaurant']
    
    def get_image(self, obj):
        """Return full image URL for frontend display"""
        if obj.image:
            # Build full URL from request context
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback: if no request context, construct URL manually
            return f"/media/{obj.image.name}"
        return None


class OrderItemSerializer(serializers.ModelSerializer):
    food_name = serializers.CharField(source='food.name', read_only=True)
    food_price = serializers.DecimalField(source='food.price', max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'food', 'food_name', 'food_price', 'quantity', 'price']
        read_only_fields = ['price']


class OrderItemCreateSerializer(serializers.Serializer):
    food = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')
    customer_username = serializers.CharField(source='customer.username', read_only=True)
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'customer', 'customer_username', 'customer_email', 'items', 'status', 'total_price', 'delivery_address', 'created_at', 'updated_at']
        read_only_fields = ['customer', 'total_price', 'created_at', 'updated_at']


class OrderCreateSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)
    delivery_address = serializers.CharField(required=True, allow_blank=False)
    status = serializers.CharField(default='pending')
    
    def validate_items(self, value):
        """Validate that all food items exist"""
        if not value or len(value) == 0:
            raise serializers.ValidationError("At least one item is required")
        
        food_ids = [item['food'] for item in value]
        existing_foods = Food.objects.filter(id__in=food_ids, available=True).values_list('id', flat=True)
        missing_foods = set(food_ids) - set(existing_foods)
        
        if missing_foods:
            raise serializers.ValidationError(f"Food items not available: {list(missing_foods)}")
        return value
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        delivery_address = validated_data.pop('delivery_address')
        status = validated_data.pop('status', 'pending')
        customer = self.context['request'].user
        
        # Calculate total price
        total_price = 0
        order_items = []
        
        for item_data in items_data:
            food = Food.objects.get(id=item_data['food'])
            quantity = item_data['quantity']
            item_total = float(food.price) * quantity
            total_price += item_total
            
            order_items.append({
                'food': food,
                'quantity': quantity,
                'price': item_total
            })
        
        # Create order
        order = Order.objects.create(
            customer=customer,
            delivery_address=delivery_address,
            status=status,
            total_price=total_price
        )
        
        # Create order items - THIS IS THE CRITICAL PART
        print(f"Creating order #{order.id} with {len(order_items)} items")
        for item_data in order_items:
            order_item = OrderItem.objects.create(
                order=order,
                food=item_data['food'],
                quantity=item_data['quantity'],
                price=item_data['price']
            )
            print(f"  - Created item: {item_data['food'].name} x {item_data['quantity']}")
        
        return order


# ======================
# INVENTORY SERIALIZERS
# ======================
class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id', 'name', 'quantity', 'unit', 'supplier', 'created_at', 'updated_at']
        read_only_fields = ['restaurant', 'created_at', 'updated_at']


class InventoryCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id', 'name', 'quantity', 'unit', 'supplier']
    
    def create(self, validated_data):
        restaurant = self.context['request'].user
        return Inventory.objects.create(restaurant=restaurant, **validated_data)
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.unit = validated_data.get('unit', instance.unit)
        instance.supplier = validated_data.get('supplier', instance.supplier)
        instance.save()
        return instance



class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'type', 'message', 'is_read', 'created_at', 'order']
        read_only_fields = ['id', 'created_at']


# ======================
# PROFILE SERIALIZERS
# ======================
class ProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = ['id', 'username', 'email', 'role', 'first_name', 'last_name', 'full_name', 'phone', 'address']
        read_only_fields = ['id', 'username', 'email', 'role', 'full_name']


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['first_name', 'last_name', 'phone', 'address']


# ======================
# USER LIST SERIALIZER (For reference)
# ======================
class UserListSerializer(serializers.ModelSerializer):
    """Serializer for listing all users"""
    full_name = serializers.ReadOnlyField()
    role = serializers.CharField(source='profile.role', read_only=True)
    first_name = serializers.CharField(source='profile.first_name', read_only=True)
    last_name = serializers.CharField(source='profile.last_name', read_only=True)
    phone = serializers.CharField(source='profile.phone', read_only=True)
    address = serializers.CharField(source='profile.address', read_only=True)
    order_count = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'role', 'first_name', 'last_name', 'phone', 'address', 'order_count', 'date_joined']
        read_only_fields = ['id', 'username', 'email', 'date_joined']
    
    def get_order_count(self, obj):
        """Get_count(self, obj the number of orders placed by this user"""
        return Order.objects.filter(customer=obj).count()
