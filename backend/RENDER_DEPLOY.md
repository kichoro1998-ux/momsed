# Render Deployment (Backend)

Use these settings in your Render Web Service:

- Root Directory: `backend`
- Build Command: `./build.sh`
- Start Command: `gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --log-file -`

Required environment variables:

- `DJANGO_SECRET_KEY=<strong-secret>`
- `DEBUG=False`
- `ALLOWED_HOSTS=momsed-1-vkv7.onrender.com`
- `DATABASE_URL=<render-postgres-url>`
- `CORS_ALLOWED_ORIGINS=https://momsed-mz.vercel.app`
- `CSRF_TRUSTED_ORIGINS=https://momsed-mz.vercel.app,https://momsed-1-vkv7.onrender.com`

Optional: create Django admin superuser on deploy:

- `CREATE_SUPERUSER=true`
- `DJANGO_SUPERUSER_USERNAME=admin`
- `DJANGO_SUPERUSER_EMAIL=admin@gmail.com`
- `DJANGO_SUPERUSER_PASSWORD=<strong-password>`

Optional: create/update restaurant staff user on deploy:

- `CREATE_RESTAURANT_STAFF=true`
- `STAFF_USERNAME=staff1`
- `STAFF_EMAIL=staff1@gmail.com`
- `STAFF_PASSWORD=<strong-password>`
- `STAFF_FIRST_NAME=Restaurant`
- `STAFF_LAST_NAME=Admin`

Current project defaults if you don't set `STAFF_*` env vars:

- `STAFF_USERNAME=staff1`
- `STAFF_EMAIL=staff1@gmail.com`
- `STAFF_PASSWORD=momsed123!`

After first successful deploy, set:

- `CREATE_SUPERUSER=false`
- `CREATE_RESTAURANT_STAFF=false`
