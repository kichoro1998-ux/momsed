# Software Requirements Specification (SRS)
## QuickBite Food Ordering System

Version: 1.0  
Date: 2026-03-01  
Prepared for: QuickBite Backend and Frontend Team

---

## 1. Introduction

### 1.1 Purpose
This document defines the functional and non-functional requirements for the QuickBite Food Ordering System. It is intended for developers, testers, project supervisors, and deployment engineers.

### 1.2 Scope
QuickBite is a web-based food ordering platform with role-based access and a REST API backend. The system supports:
- Customer registration, login, profile management, and food ordering
- Restaurant staff food catalog management, order processing, and inventory management
- Admin-level control through Django Admin for full data governance
- Notification delivery for order events

### 1.3 Product Perspective
The system is a client-server application:
- Frontend: SPA client (React/Vite)
- Backend: Django + Django REST Framework APIs
- Authentication: JWT (access/refresh tokens)
- Database: SQLite (development), PostgreSQL (production)
- Deployment: Render-compatible backend setup

### 1.4 Actors
- Customer: Places and tracks orders
- Restaurant Staff: Manages menu, inventory, and order status
- System Administrator: Uses Django Admin for full operational control
- External Services: Database service, static/media hosting environment

### 1.5 Definitions
- SRS: Software Requirements Specification
- RBAC: Role-Based Access Control
- API: Application Programming Interface
- DFD: Data Flow Diagram
- ERD: Entity Relationship Diagram

---

## 2. Business Context

### 2.1 Problem Statement
Manual order handling causes delays, missed updates, and inconsistent tracking for customers and restaurant staff.

### 2.2 Proposed Solution
QuickBite digitizes ordering end-to-end:
- Customers browse food, submit orders, and receive status updates
- Restaurant staff approve/reject and process orders
- Inventory is tracked per restaurant account
- Notifications keep users informed throughout the order lifecycle

### 2.3 Objectives
- Reduce order processing friction
- Improve traceability of each order
- Enforce clear role permissions
- Maintain deployable and maintainable architecture

---

## 3. System Features

### 3.1 Authentication and Account Management
- Public registration for customer users
- Login using email or username
- JWT token issuance and refresh
- Profile retrieval and update

### 3.2 Food Catalog Management
- Public read access to available food list
- Restaurant staff create, update, and manage their food items
- Restaurant staff can upload/update food images

### 3.3 Order Management
- Customers create orders with multiple items
- Automatic order total computation from item prices and quantities
- Restaurant staff can view orders and perform approval/rejection actions
- Order statuses include: pending, approved, preparing, on the way, delivered, cancelled

### 3.4 Inventory Management
- Restaurant staff create and update inventory entries
- Quantity update operation available per inventory item

### 3.5 Notifications
- Notification generation for key order events
- User-specific notification listing
- Mark single or all notifications as read
- Unread notification count endpoint

### 3.6 Administrative Operations
- Django Admin support for users, profiles, foods, orders, order items, inventory, and notifications

---

## 4. Functional Requirements

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| FR-01 | The system shall allow public user registration as customer role. | High | New user can register and profile role is `customer`. |
| FR-02 | The system shall allow login by username or email. | High | Valid credentials return access and refresh tokens. |
| FR-03 | The system shall provide token refresh functionality. | High | Valid refresh token returns a new access token. |
| FR-04 | The system shall allow authenticated users to view/update own profile. | High | `GET/PUT profile` works for authenticated user only. |
| FR-05 | The system shall expose available foods to public users. | High | Unauthenticated request returns only `available=True` foods. |
| FR-06 | The system shall allow restaurant staff to create and manage own food items. | High | Restaurant can CRUD own menu items. |
| FR-07 | The system shall allow restaurant staff to upload food images. | Medium | Image upload succeeds only for owner restaurant item. |
| FR-08 | The system shall allow customers to create orders with one or more items. | High | Order + order items created and total_price computed. |
| FR-09 | The system shall limit customer order visibility to own orders. | High | Customer cannot list another customer's orders. |
| FR-10 | The system shall allow restaurant staff to view and process orders relevant to operations. | High | Staff can fetch staff order list and apply approve/reject actions. |
| FR-11 | The system shall generate notifications for key order events. | High | Notifications created on new order, approve, reject. |
| FR-12 | The system shall allow users to read and mark notifications as read. | Medium | Endpoints return correct counts and updated read flags. |
| FR-13 | The system shall allow restaurant staff to manage inventory items. | High | Staff can CRUD inventory entries and update quantity. |
| FR-14 | The system shall enforce authentication for protected endpoints. | High | Unauthorized access returns 401/403 as expected. |
| FR-15 | The system shall provide admin-level full management via Django Admin. | High | Admin login can access and manage all core entities. |

---

## 5. Non-Functional Requirements

### 5.1 Security
- JWT authentication must protect private endpoints.
- Role checks must prevent unauthorized operations.
- Sensitive values (secret keys, DB URL, allowed hosts) must be environment-based.
- CSRF and secure cookie settings must be enabled in production deployment.

### 5.2 Performance
- Standard list/read API responses should complete within 2 seconds under normal load.
- Order creation should complete within 3 seconds for typical cart sizes.

### 5.3 Reliability
- Service target availability: 99% monthly uptime.
- Failed notification creation should not break critical order operations.

### 5.4 Maintainability
- Codebase should follow clear module separation (`models`, `serializers`, `views`, `urls`).
- Version control with descriptive commit messages is required.
- Migrations must be applied in all environments.

### 5.5 Scalability
- Production database should be PostgreSQL.
- Application should support horizontal scaling through stateless API layer.

### 5.6 Usability
- API contracts should remain consistent and documented (Swagger/Redoc).
- Frontend should support mobile and desktop usage.

---

## 6. Data Requirements

### 6.1 Core Entities
- User (Django auth user)
- Profile (role and personal details)
- Food
- Order
- OrderItem
- Inventory
- Notification

### 6.2 Data Integrity Rules
- Each `Profile` must be linked to exactly one `User`.
- `Order` must belong to one customer.
- `OrderItem` must reference valid `Order` and `Food`.
- `Inventory` must belong to a restaurant user.
- `Notification` must belong to a valid user; order link is optional.

---

## 7. API-Level Requirements

### 7.1 Authentication Endpoints
- `POST /api/register/`
- `POST /api/login/`
- `POST /api/token/refresh/`

### 7.2 Profile Endpoint
- `GET /api/profile/`
- `PUT /api/profile/`

### 7.3 Resource Endpoints
- `foods` viewset
- `orders` viewset (+ custom actions: `approve`, `reject`, `staff_orders`)
- `inventory` viewset (+ custom action: `update_quantity`)
- `notifications` viewset (+ custom actions: `unread_count`, `mark_as_read`, `mark_all_as_read`)

---

## 8. Constraints and Assumptions

### 8.1 Constraints
- Public registration creates `customer` role only.
- Restaurant staff accounts are controlled internally.
- Media persistence depends on hosting environment configuration.

### 8.2 Assumptions
- Network connection is available for client-server communication.
- Environment variables are correctly configured in deployment platform.
- Database migrations are applied before production traffic.

---

## 9. Diagrams (Editable)

The following diagrams are provided as editable PlantUML source files:
- `docs/diagrams/use-case-diagram.puml`
- `docs/diagrams/process-diagram.puml`
- `docs/diagrams/class-diagram.puml`
- `docs/diagrams/erd-diagram.puml`
- `docs/diagrams/dfd-level-0.puml`
- `docs/diagrams/dfd-level-1.puml`

Each file uses `skinparam handwritten true` so rendered output looks hand-drawn by a person rather than machine-generated.

---

## 10. Verification Checklist

- Role access checks verified for customer and restaurant users
- Order lifecycle actions tested (create, approve, reject)
- Notification flows verified for key events
- Inventory CRUD and quantity update tested
- Admin panel access and entity listing verified
- Production config reviewed (`DEBUG`, secure cookies, allowed hosts)

