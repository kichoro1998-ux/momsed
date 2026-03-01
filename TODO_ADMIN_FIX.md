# TODO: Fix Django Admin 500 Errors

## Task: Fix all admin pages returning 500 error
- Users (/admin/auth/user/)
- Profiles (/admin/foodapp/profile/)
- Groups (/admin/auth/group/)
- Food (/admin/foodapp/food/)
- Orders (/admin/foodapp/order/)
- Order Items (/admin/foodapp/orderitem/)
- Inventory (/admin/foodapp/inventory/)
- Notifications (/admin/foodapp/notification/)

## Steps:
1. [x] Analyze admin.py and models to identify issues
2. [ ] Fix FoodAdmin - handle NULL restaurant values
3. [ ] Fix OrderAdmin - handle NULL customer values
4. [ ] Fix OrderItemAdmin - handle edge cases
5. [ ] Fix ProfileAdmin - handle deleted users
6. [ ] Fix InventoryAdmin - handle NULL restaurant values
7. [ ] Fix NotificationAdmin - handle NULL order values
8. [ ] Test locally

## Issues Identified:
- ForeignKey with null=True can cause display issues in admin
- User deletion can orphan related objects
- Search fields using __ lookups on nullable fields can fail

