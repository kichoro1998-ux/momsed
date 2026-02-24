#!/usr/bin/env python
import os
import sys
import django
import json
import tempfile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
import requests

API_BASE = 'http://localhost:8000/api'

# Get admin user and token
admin = User.objects.get(username='admin')
refresh = RefreshToken.for_user(admin)
access_token = str(refresh.access_token)
headers = {'Authorization': f'Bearer {access_token}'}

print(f"Using admin: {admin.username}")

# 1) List staff orders
print('\n==> GET /orders/staff_orders/')
r = requests.get(f"{API_BASE}/orders/staff_orders/", headers=headers)
print('Status:', r.status_code)
try:
    data = r.json()
    print('Response keys:', list(data.keys()) if isinstance(data, dict) else 'list')
    orders = data.get('orders') if isinstance(data, dict) else data
    if not orders:
        print('No staff orders found')
    else:
        print('Found orders:', len(orders))
        for o in orders[:3]:
            print(' -', o.get('id'), o.get('status'))
except Exception as e:
    print('Error parsing response:', e, r.text)

# Helper: find a pending order admin can manage
print('\nSearching for a pending order admin can manage...')
orders_resp = requests.get(f"{API_BASE}/orders/?status=pending", headers=headers)
pending = []
if orders_resp.status_code == 200:
    try:
        cand = orders_resp.json()
        if isinstance(cand, dict) and cand.get('orders'):
            list_orders = cand['orders']
        elif isinstance(cand, list):
            list_orders = cand
        else:
            list_orders = []
    except:
        list_orders = []
    for o in list_orders:
        # check if admin owns any food in order by checking orderitems
        items = o.get('items') or []
        for it in items:
            food = it.get('food')
            # if food is dict with restaurant id or just id, we skip deep check and pick first
            pending.append(o)
            break

if not pending:
    print('No pending orders found via /orders/; will try staff_orders list from earlier')
    # fallback to staff orders list
    if 'orders' in locals() and orders:
        pending = [o for o in orders if o.get('status') == 'pending']

if not pending:
    print('No pending orders available to test approve/reject.')
else:
    order_to_approve = pending[0]
    oid = order_to_approve.get('id')
    print(f"Approving order {oid}...")
    r = requests.post(f"{API_BASE}/orders/{oid}/approve/", headers=headers)
    print('Approve status:', r.status_code, r.text)

    # If there is another pending, try reject
    if len(pending) > 1:
        oid2 = pending[1].get('id')
        print(f"Rejecting order {oid2}...")
        r = requests.post(f"{API_BASE}/orders/{oid2}/reject/", headers={**headers, 'Content-Type':'application/json'}, json={'reason':'Testing E2E reject'})
        print('Reject status:', r.status_code, r.text)

# 3) Upload image for a staff food
print('\n==> Upload image for a staff food')
foods_resp = requests.get(f"{API_BASE}/foods/", headers=headers)
try:
    foods = foods_resp.json()
    # If authenticated as admin/restaurant, the API returns list of their foods
    if isinstance(foods, dict) and foods.get('results'):
        foods_list = foods.get('results')
    elif isinstance(foods, list):
        foods_list = foods
    elif isinstance(foods, dict) and foods.get('data'):
        foods_list = foods.get('data')
    else:
        foods_list = foods
except Exception as e:
    print('Error parsing foods response:', e, foods_resp.text)
    foods_list = []

if not foods_list:
    print('No foods found to upload image for')
else:
    food = foods_list[0]
    fid = food.get('id')
    print(f'Uploading image to food id {fid}')
    # create a small temporary image (PNG header + minimal data)
    tmpf = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    tmpf.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0bIDATx\x9cc```\x00\x00\x00\x02\x00\x01\xe2!\xbc\x33\x00\x00\x00\x00IEND\xaeB`\x82')
    tmpf.flush()
    tmpf.close()
    files = {'image': open(tmpf.name, 'rb')}
    r = requests.post(f"{API_BASE}/foods/{fid}/upload_image/", headers=headers, files=files)
    print('Upload status:', r.status_code)
    print(r.text)

print('\nE2E test completed')
