#!/usr/bin/env bash
set -o errexit

python -m pip install --upgrade pip
pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input

if [ "${CREATE_SUPERUSER:-false}" = "true" ]; then
  python create_superuser.py
fi

if [ "${CREATE_RESTAURANT_STAFF:-false}" = "true" ]; then
  python create_staff_user.py
fi
