# Food Ordering System

A full-stack food ordering system with Django backend and React frontend.

## Project Structure

```
django_project/
├── backend/                 # Django backend
│   ├── backend/            # Django project settings
│   ├── foodapp/            # Django app for food ordering
│   ├── manage.py           # Django management script
│   ├── media/              # Media files (food images)
│   └── *.py                # Various utility scripts
│
└── orderingFoodSystem/      # React frontend (Vite)
    ├── orderingFoodSystem/
    │   ├── src/            # React source code
    │   │   ├── assets/     # Components, pages, etc.
    │   │   ├── components/ # Reusable components
    │   │   ├── contexts/   # React contexts (Auth, Cart)
    │   │   └── utils/      # API utilities
    │   ├── public/         # Static public files
    │   └── package.json    # Dependencies
    └── ...
```

## Tech Stack

### Backend
- **Framework**: Django 5.x
- **Database**: PostgreSQL
- **REST API**: Django REST Framework

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: React Context API

## Features

- **Customer**: Browse menu, add to cart, place orders, view order history
- **Restaurant Staff**: Manage orders, update inventory, view dashboard
- **Authentication**: JWT-based authentication

## Setup Instructions

### Backend Setup

```
bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend Setup

```
bash
cd orderingFoodSystem/orderingFoodSystem
npm install
npm run dev
```

## API Endpoints

- `/api/foods/` - Food items
- `/api/orders/` - Orders
- `/api/inventory/` - Inventory management
- `/api/notifications/` - User notifications
- `/api/profile/` - User profiles

## Default Roles

- `customer` - Regular users
- `staff` - Restaurant staff

## Running the Application

1. Start the Django server on `http://localhost:8000`
2. Start the React dev server on `http://localhost:5173` (default Vite port)

## License

MIT
