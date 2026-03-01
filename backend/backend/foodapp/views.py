from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from django.contrib.auth.models import User

from .models import Food, Order, OrderItem, Profile, Inventory, Notification
from .serializers import (
    RegisterSerializer,
    FoodSerializer,
    OrderSerializer,
    OrderCreateSerializer,
    InventorySerializer,
    InventoryCreateSerializer,
    NotificationSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    
)

# ============================
# USER REGISTRATION
# ============================
class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print(f"Registration attempt: {request.data}")
        return super().create(request, *args, **kwargs)


# ============================
# USER LOGIN (JWT)
# ============================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = (request.data.get('email') or request.data.get('username') or '').strip().lower()
        password = request.data.get('password')
        if not identifier or not password:
            return Response({'error': 'Email/username and password are required'}, status=400)

        # Allow login by either email or username.
        users = User.objects.filter(email__iexact=identifier).order_by('id')
        if not users.exists():
            users = User.objects.filter(username__iexact=identifier).order_by('id')
        if not users.exists():
            return Response({'error': 'Invalid credentials'}, status=401)

        matched_users = []
        for candidate in users:
            if candidate.check_password(password):
                matched_users.append(candidate)

        if not matched_users:
            return Response({'error': 'Invalid credentials'}, status=401)

        # If multiple accounts match, prioritize restaurant staff role.
        user = matched_users[0]
        for candidate in matched_users:
            try:
                if candidate.profile.role == 'restaurant':
                    user = candidate
                    break
            except Profile.DoesNotExist:
                continue

        try:
            role = user.profile.role
        except Profile.DoesNotExist:
            role = 'customer'

        refresh = RefreshToken.for_user(user)
        response_data = {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': role,
            }
        }
        return Response(response_data)


# ============================
# FOOD VIEWSET
# ============================
class FoodViewSet(ModelViewSet):
    serializer_class = FoodSerializer
    permission_classes = [AllowAny]  # Allow anyone to view foods

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Food.objects.none()

        user = self.request.user
        
        # If user is authenticated and is restaurant staff, show only their foods
        if user.is_authenticated:
            try:
                profile = user.profile
                if profile.role == 'restaurant':
                    # Restaurant staff see only their own foods
                    return Food.objects.filter(restaurant=user).order_by('-id')
            except Profile.DoesNotExist:
                pass
        
        # Unauthenticated users (customers) see only available foods
        return Food.objects.filter(available=True).order_by('-id')

    def perform_create(self, serializer):
        """
        this location restaurent insert picture
        come from request.FILES
        """
        serializer.save(restaurant=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def upload_image(self, request, pk=None):
        """
        RESTAURANT can upload/update food image
        """
        food = self.get_object()
        
        # Check if user is the restaurant owner
        user = request.user
        try:
            profile = user.profile
            if profile.role != 'restaurant':
                return Response(
                    {'error': 'Only restaurant staff can upload images'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if food.restaurant and food.restaurant != user:
            return Response(
                {'error': 'You can only update your own food items'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if 'image' not in request.FILES:
            return Response(
                {'error': 'No image file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            food.image = request.FILES['image']
            food.save()
            serializer = FoodSerializer(food, context={'request': request})
            return Response({
                'message': 'Image uploaded successfully',
                'food': serializer.data
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Image upload failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================
# ORDER VIEWSET
# ============================
class OrderViewSet(ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Order.objects.none()

        user = self.request.user
        if not user or not user.is_authenticated:
            return Order.objects.none()
        
        # Handle users without profile - default to customer role
        try:
            profile = user.profile
            role = profile.role
        except Profile.DoesNotExist:
            role = 'customer'
        
        # CUSTOMER → anaona orders zake
        if role == 'customer':
            return Order.objects.filter(customer=user)

        # RESTAURANT → anaona orders zenye chakula chake
        if role == 'restaurant':
            return Order.objects.filter(
                orderitem__food__restaurant=user
            ).distinct()

        return Order.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Notify ALL restaurant staff about the new order
        try:
            # Get all restaurant staff users
            restaurant_users = User.objects.filter(profile__role='restaurant')
            
            # Create notification for each restaurant staff
            for staff in restaurant_users:
                Notification.objects.create(
                    user=staff,
                    order=order,
                    type='new_order',
                    message=f'New order #{order.id} received from {order.customer.username} - Tzs{order.total_price}'
                )
        except Exception as e:
            print(f"Warning: Failed to create notifications for staff: {str(e)}")
        
        # Return the created order with full details
        order_serializer = OrderSerializer(order, context={'request': request})
        return Response(order_serializer.data, status=201)

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """
        RESTAURANT/STAFF can approve order and change status to 'approved'
        """
        order = self.get_object()
        user = request.user
        
        # Check if user has permission to approve this order
        try:
            profile = user.profile
            if profile.role != 'restaurant':
                return Response(
                    {'error': 'Only restaurant staff can approve orders'},
                    status=status.HTTP_403_FORBIDDEN
                )
            # Restaurant can only approve orders containing their food
            if not order.orderitem_set.filter(food__restaurant=user).exists():
                return Response(
                    {'error': 'You can only approve orders with your food'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order.status = 'approved'
        order.save()
        
        # Create notification for customer
        try:
            Notification.objects.create(
                user=order.customer,
                order=order,
                type='order_approved',
                message=f'Your order #{order.id} has been approved!'
            )
        except:
            pass  # Silently fail if notification creation fails
        
        return Response({
            'status': 'approved',
            'message': 'Order approved successfully',
            'order_id': order.id
        })

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """
        RESTAURANT/STAFF can reject order with reason
        """
        order = self.get_object()
        user = request.user
        reason = request.data.get('reason', 'No reason provided')
        
        # Check if user has permission to reject this order
        try:
            profile = user.profile
            if profile.role != 'restaurant':
                return Response(
                    {'error': 'Only restaurant staff can reject orders'},
                    status=status.HTTP_403_FORBIDDEN
                )
            # Restaurant can only reject orders containing their food
            if not order.orderitem_set.filter(food__restaurant=user).exists():
                return Response(
                    {'error': 'You can only reject orders with your food'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        order.status = 'cancelled'
        order.save()
        
        # Create notification for customer
        try:
            Notification.objects.create(
                user=order.customer,
                order=order,
                type='order_rejected',
                message=f'Your order #{order.id} has been rejected. Reason: {reason}'
            )
        except Exception as e:
            # Log the error but don't fail the reject
            print(f"Warning: Failed to create notification for order {order.id}: {str(e)}")
        
        return Response({
            'status': 'cancelled',
            'message': 'Order rejected successfully',
            'reason': reason,
            'order_id': order.id
        })

    @action(detail=False, methods=['get'])
    def staff_orders(self, request):
        """
        RESTAURANT/STAFF can view all orders
        """
        user = request.user
        
        print(f"\n=== STAFF ORDERS DEBUG ===")
        print(f"User: {user.username} (ID: {user.id})")
        
        try:
            profile = user.profile
            print(f"User role: {profile.role}")
            
            # Only restaurant staff can view all orders
            if profile.role != 'restaurant':
                return Response(
                    {'error': 'Only restaurant staff can view orders'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except Profile.DoesNotExist:
            print(f"ERROR: No profile found for user {user.username}")
            return Response(
                {'error': 'User profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Restaurant staff see ALL orders
        orders = Order.objects.all().order_by('-created_at')
        print(f"Viewing all orders: {orders.count()}")
        
        # Filter by status if provided
        status_filter = request.query_params.get('status')
        if status_filter:
            orders = orders.filter(status=status_filter)
            print(f"After status filter ({status_filter}): {orders.count()}")
        
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        response_data = {
            'total': orders.count(),
            'orders': serializer.data
        }
        print(f"Returning {len(serializer.data)} orders")
        print(f"=== END DEBUG ===\n")
        return Response(response_data)


# ============================
# INVENTORY VIEWSET
# ============================
class InventoryViewSet(ModelViewSet):
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Inventory.objects.none()

        user = self.request.user
        if not user or not user.is_authenticated:
            return Inventory.objects.none()
        
        # Return empty queryset if user has no profile yet
        try:
            profile = user.profile
            # RESTAURANT → anaona inventory yake
            if profile.role == 'restaurant':
                return Inventory.objects.filter(restaurant=user)
        except Profile.DoesNotExist:
            return Inventory.objects.none()

        return Inventory.objects.none()

    def get_serializer_class(self):
        if self.action == 'create':
            return InventoryCreateSerializer
        return InventorySerializer

    def perform_create(self, serializer):
        serializer.save(restaurant=self.request.user)

    @action(detail=True, methods=['post'])
    def update_quantity(self, request, pk=None):
        """
        RESTAURANT ana-update inventory quantity
        """
        inventory = self.get_object()
        quantity = request.data.get('quantity')
        
        if quantity is not None:
            inventory.quantity = quantity
            inventory.save()
            return Response({
                "status": "Quantity updated",
                "quantity": inventory.quantity
            })
        
        return Response({"error": "Quantity not provided"}, status=400)




# ======================
# NOTIFICATION VIEWSET
# ======================
class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return only notifications for the current user"""
        if getattr(self, 'swagger_fake_view', False):
            return Notification.objects.none()

        user = self.request.user
        if not user or not user.is_authenticated:
            return Notification.objects.none()
        return Notification.objects.filter(user=user)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications"""
        user = request.user
        if not user or not user.is_authenticated:
            return Response({'unread_count': 0})
        count = Notification.objects.filter(user=user, is_read=False).count()
        return Response({'unread_count': count})
    
    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark a notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})
    
    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all user notifications as read"""
        user = request.user
        if not user or not user.is_authenticated:
            return Response({'marked_as_read': 0})
        count = Notification.objects.filter(user=user, is_read=False).update(is_read=True)
        return Response({'marked_as_read': count})


# ============================
# PROFILE VIEWS
# ============================
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get current user's profile"""
        try:
            profile = request.user.profile
            serializer = ProfileSerializer(profile)
            return Response(serializer.data)
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request):
        """Update current user's profile"""
        try:
            profile = request.user.profile
            serializer = ProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                # Return updated profile with full_name
                updated_profile = ProfileSerializer(profile)
                return Response(updated_profile.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Profile not found'},
                status=status.HTTP_404_NOT_FOUND
            )
