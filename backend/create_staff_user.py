#!/usr/bin/env python
"""Create or update a restaurant staff user from environment variables."""

import os
import sys


def setup_django():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    import django
    django.setup()


def require_env(name):
    value = os.environ.get(name, "").strip()
    if not value:
        raise ValueError(f"Missing required environment variable: {name}")
    return value


def create_or_update_staff():
    from django.contrib.auth.models import User
    from foodapp.models import Profile

    username = require_env("STAFF_USERNAME")
    email = require_env("STAFF_EMAIL").lower()
    password = require_env("STAFF_PASSWORD")
    first_name = os.environ.get("STAFF_FIRST_NAME", "").strip()
    last_name = os.environ.get("STAFF_LAST_NAME", "").strip()
    phone = os.environ.get("STAFF_PHONE", "").strip()
    address = os.environ.get("STAFF_ADDRESS", "").strip()

    user, created = User.objects.get_or_create(
        username=username,
        defaults={"email": email},
    )
    if user.email.lower() != email:
        user.email = email
    user.set_password(password)
    user.is_staff = True
    user.save()

    profile, _ = Profile.objects.get_or_create(user=user, defaults={"role": "restaurant"})
    profile.role = "restaurant"
    if first_name:
        profile.first_name = first_name
    if last_name:
        profile.last_name = last_name
    if phone:
        profile.phone = phone
    if address:
        profile.address = address
    profile.save()

    action = "Created" if created else "Updated"
    print(f"{action} restaurant staff user '{username}' ({email}).")


def main():
    try:
        setup_django()
        create_or_update_staff()
    except Exception as exc:
        print(f"create_staff_user failed: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
