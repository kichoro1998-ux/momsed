#!/usr/bin/env python
"""Create a Django superuser from environment variables if missing."""

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


def create_superuser():
    from django.contrib.auth import get_user_model

    username = require_env("DJANGO_SUPERUSER_USERNAME")
    email = require_env("DJANGO_SUPERUSER_EMAIL").lower()
    password = require_env("DJANGO_SUPERUSER_PASSWORD")

    user_model = get_user_model()
    if user_model.objects.filter(username=username).exists():
        print(f"Superuser '{username}' already exists. Skipping.")
        return

    user_model.objects.create_superuser(
        username=username,
        email=email,
        password=password,
    )
    print(f"Created superuser '{username}'.")


def main():
    try:
        setup_django()
        create_superuser()
    except Exception as exc:
        print(f"create_superuser failed: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
