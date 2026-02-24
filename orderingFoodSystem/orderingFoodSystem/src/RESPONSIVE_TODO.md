# Responsive Design Implementation Plan

## Overview
Implement comprehensive responsive design for the ordering food system to work properly on all devices (desktop, tablet, mobile).

## Tasks

### Phase 1: Global Styles & Base Responsive ✅
- [x] 1.1 Create `src/responsive.css` with global responsive styles
- [x] 1.2 Update `index.css` to import responsive styles
- [x] 1.3 Add responsive typography and utility classes

### Phase 2: Layout Components ✅
- [x] 2.1 Update `AdminLayout.jsx` - Fix sidebar margin on mobile
- [x] 2.2 Update `StaffLayout.jsx` - Fix sidebar margin on mobile
- [x] 2.3 Update `CustomerLayout.jsx` - Improve mobile padding

### Phase 3: Sidebar Components ✅
- [x] 3.1 Update `AdminSideBar.jsx` - Add mobile toggle button & overlay
- [x] 3.2 Update `StaffSideBar.jsx` - Add mobile toggle button & overlay

### Phase 4: Dashboard Pages ✅
- [x] 4.1 Update `AdminDashboard.jsx` - Responsive grid for stat cards
- [x] 4.2 Update `StaffDashboard.jsx` - Responsive grid for stat cards
- [x] 4.3 Update `CustomerDashboard.jsx` - Responsive layout

### Phase 5: Orders Pages (Tables) ✅
- [x] 5.1 Update `Orders.jsx` (Staff) - Responsive table with horizontal scroll
- [x] 5.2 Update `AdminOrders.jsx` - Responsive table with horizontal scroll
- [ ] 5.3 Update `CustomerOrders.jsx` - Responsive table/card layout (pending)

### Phase 6: Public Pages ✅
- [x] 6.1 Update `Home.jsx` - Responsive hero & grid layouts
- [x] 6.2 Update `Menu.jsx` - Responsive menu cards grid
- [ ] 6.3 Update `CustomerMenu.jsx` - Responsive menu layout (pending)

### Phase 7: Navbar Components ⏳
- [ ] 7.1 Update `Header.jsx` - Improve mobile navbar
- [ ] 7.2 Update `CustomerNavbar.jsx` - Improve mobile navbar

### Phase 8: Additional Components ⏳
- [ ] 8.1 Update `AdminMenu.jsx` - Responsive menu management
- [ ] 8.2 Update `StaffMenu.jsx` - Responsive menu management
- [ ] 8.3 Update `AdminInventory.jsx` - Responsive inventory table
- [ ] 8.4 Update `StaffInventory.jsx` - Responsive inventory table

## Breakpoints
- **xs**: < 576px ( phones )
- **sm**: 576px - 767px ( large phones )
- **md**: 768px - 991px ( tablets )
- **lg**: 992px - 1199px ( small laptops )
- **xl**: ≥ 1200px ( desktops )

## Success Criteria
1. All dashboards display correctly on mobile, tablet, and desktop
2. Sidebars can be toggled on mobile devices
3. Tables have horizontal scroll on small screens
4. Cards and grids stack properly on smaller screens
5. Navigation works properly on all devices

## Files Modified
1. `src/responsive.css` - New comprehensive responsive styles
2. `src/main.jsx` - Import responsive.css
3. `assets/Admin/AdminLayout.jsx` - Mobile sidebar toggle
4. `assets/RestaurantStaff/StaffLayout.jsx` - Mobile sidebar toggle
5. `assets/components/AdminSideBar.jsx` - Mobile responsive sidebar
6. `assets/components/StaffSideBar.jsx` - Mobile responsive sidebar
7. `assets/Admin/AdminDashboard.jsx` - Responsive stat cards
8. `assets/RestaurantStaff/StaffDashboard.jsx` - Responsive stat cards
9. `assets/Customer/CustomerDashboard.jsx` - Responsive dashboard
10. `assets/RestaurantStaff/Orders.jsx` - Responsive table
11. `assets/Admin/AdminOrders.jsx` - Responsive table
12. `assets/pages/Home.jsx` - Responsive hero and sections
13. `assets/pages/Menu.jsx` - Responsive menu grid

