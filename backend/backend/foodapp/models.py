from django.db import models
from django.contrib.auth.models import User

# ======================
# USER PROFILE (ROLES)
# ======================
class Profile(models.Model):
    ROLE_CHOICES = (
        ("restaurant", "Restaurant"),
        ("customer", "Customer"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    first_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")
    phone = models.CharField(max_length=20, blank=True, default="")
    address = models.TextField(blank=True, default="")

    def __str__(self):
        return f"{self.user.username} - {self.role}"
    
    @property
    def full_name(self):
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        elif self.first_name:
            return self.first_name
        elif self.last_name:
            return self.last_name
        return self.user.username


# ======================
# FOOD TABLE
# ======================
class Food(models.Model):
    CATEGORY_CHOICES = (
        ("Main", "Main"),
        ("Appetizer", "Appetizer"),
        ("Dessert", "Dessert"),
        ("Drink", "Drink"),
        ("Side", "Side"),
    )
    
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="Main")

    image = models.ImageField(upload_to="foods/", blank=True, null=True)

    restaurant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"profile__role": "restaurant"},
        null=True,
        blank=True
    )

    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# ======================
# INVENTORY TABLE
# ======================
class Inventory(models.Model):
    UNIT_CHOICES = (
        ("kg", "Kilograms"),
        ("g", "Grams"),
        ("l", "Liters"),
        ("ml", "Milliliters"),
        ("pcs", "Pieces"),
        ("boxes", "Boxes"),
        ("packs", "Packs"),
    )
    
    name = models.CharField(max_length=100)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default="kg")
    supplier = models.CharField(max_length=200, blank=True, default="")
    restaurant = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"profile__role": "restaurant"},
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"


# ======================
# ORDER TABLE
# ======================
class Order(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("preparing", "Preparing"),
        ("on the way", "On the way"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    )

    customer = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={"profile__role": "customer"}
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_address = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id}"


# ======================
# ORDER ITEM TABLE
# ======================
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.food.name} x {self.quantity}"


# ======================
# NOTIFICATION TABLE
# ======================
class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ("new_order", "New Order"),
        ("order_approved", "Order Approved"),
        ("order_rejected", "Order Rejected"),
        ("order_out_of_stock", "Item Out of Stock"),
        ("order_status_update", "Order Status Update"),
        ("order_delivered", "Order Delivered"),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
    
    def __str__(self):
        return f"Notification for {self.user.username} - {self.type}"
