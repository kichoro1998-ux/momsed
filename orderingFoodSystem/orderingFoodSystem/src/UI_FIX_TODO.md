# UI Layout Fix - TODO List

## Issues
- Admin and Staff dashboards have UI overlap issues
- Sidebar overlays content instead of pushing it
- Close (X) button doesn't adapt properly
- Layout is not flexible/responsive

## Fix Plan

### Step 1: Fix AdminLayout.jsx
- [x] 1.1 Change sidebar from position-fixed to position-relative in flex container
- [x] 1.2 Add dynamic marginLeft to main content based on sidebar state
- [x] 1.3 Fix hamburger toggle button visibility

### Step 2: Fix StaffLayout.jsx
- [x] 2.1 Change sidebar from position-fixed to position-relative in flex container
- [x] 2.2 Add dynamic marginLeft to main content based on sidebar state
- [x] 2.3 Fix hamburger toggle button visibility

### Step 3: Fix AdminSideBar.jsx
- [x] 3.1 Remove position-fixed and transform properties
- [x] 3.2 Use flexbox for proper layout
- [x] 3.3 Fix width transitions

### Step 4: Fix StaffSideBar.jsx
- [x] 4.1 Remove position-fixed and transform properties
- [x] 4.2 Use flexbox for proper layout
- [x] 4.3 Fix width transitions

### Step 5: Fix index.css
- [x] 5.1 Update .main-content class for responsive margins
- [x] 5.2 Remove fixed 24px margin that causes overlap

### Step 6: Testing
- [ ] 6.1 Verify Admin dashboard layout
- [ ] 6.2 Verify Staff dashboard layout
- [ ] 6.3 Test responsive behavior

