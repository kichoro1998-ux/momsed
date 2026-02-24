#!/usr/bin/env python
"""
Test script for order approve/reject with notifications
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from foodapp.models import Order, Notification

print("=" * 70)
print("TESTING APPROVE/REJECT WITH NOTIFICATIONS")
print("=" * 70)

# Get first pending order
order = Order.objects.filter(status='pending').first()
if not order:
    print("\n✗ No pending orders found. Creating test order...")
    # Create one for testing if needed
    from foodapp.models import Food
    customer = User.objects.filter(profile__role='customer').first()
    if customer:
        order = Order.objects.create(
            customer=customer,
            status='pending',
            total_price=50.00,
            delivery_address='Test Address'
        )
        print(f"✓ Created test order #{order.id}")
    else:
        print("✗ No customers found")
        exit(1)

print(f"\n📋 Testing order #{order.id}")
print(f"   Customer: {order.customer.username}")
print(f"   Status: {order.status}")
print(f"   Notifications before action: {order.notifications.count()}")

# Test approve
print("\n" + "="*70)
print("TEST 1: APPROVING ORDER")
print("="*70)
order.status = 'approved'
order.save()

try:
    notification = Notification.objects.create(
        user=order.customer,
        order=order,
        type='order_approved',
        message=f'Your order #{order.id} has been approved!'
    )
    print(f"✓ Order approved")
    print(f"✓ Notification created: {notification.message}")
    print(f"✓ Notification ID: {notification.id}")
    print(f"✓ Sent to: {notification.user.username}")
    print(f"✓ Created at: {notification.created_at}")
except Exception as e:
    print(f"✗ Error: {e}")

# Get fresh order data
order.refresh_from_db()
print(f"\nOrder notifications count: {order.notifications.count()}")
for notif in order.notifications.all():
    print(f"  - {notif.type}: {notif.message}")

# Test reject with new order
print("\n" + "="*70)
print("TEST 2: REJECTING ORDER")
print("="*70)

order2 = Order.objects.filter(status='pending').first()
if not order2:
    customer = User.objects.filter(profile__role='customer').first()
    if customer:
        from foodapp.models import Food
        order2 = Order.objects.create(
            customer=customer,
            status='pending',
            total_price=75.00,
            delivery_address='Test Address 2'
        )

if order2:
    print(f"\n📋 Testing order #{order2.id}")
    print(f"   Customer: {order2.customer.username}")
    print(f"   Status: {order2.status}")
    
    order2.status = 'cancelled'
    order2.save()
    
    reason = "Item out of stock"
    try:
        notification2 = Notification.objects.create(
            user=order2.customer,
            order=order2,
            type='order_rejected',
            message=f'Your order #{order2.id} has been rejected. Reason: {reason}'
        )
        print(f"✓ Order rejected")
        print(f"✓ Notification created: {notification2.message}")
        print(f"✓ Notification ID: {notification2.id}")
        print(f"✓ Sent to: {notification2.user.username}")
    except Exception as e:
        print(f"✗ Error: {e}")

# Verify notifications
print("\n" + "="*70)
print("VERIFICATION")
print("="*70)

all_notifications = Notification.objects.all()
print(f"\nTotal notifications in system: {all_notifications.count()}")

for user in User.objects.filter(profile__role='customer'):
    user_notifs = Notification.objects.filter(user=user)
    if user_notifs.count() > 0:
        print(f"\n👤 {user.username}:")
        print(f"   Total notifications: {user_notifs.count()}")
        print(f"   Unread: {user_notifs.filter(is_read=False).count()}")
        for notif in user_notifs[:3]:  # Show first 3
            status_icon = "📖" if notif.is_read else "📨"
            print(f"   {status_icon} [{notif.type}] {notif.message}")

print("\n" + "="*70)
print("✓ TESTS COMPLETED")
print("="*70)
