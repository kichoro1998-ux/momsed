import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import './App.css'
import Login from './assets/pages/Login.jsx'
import Register from './assets/pages/Register.jsx'
import StaffDashboard from './assets/RestaurantStaff/StaffDashboard.jsx'
import StaffMenu from './assets/RestaurantStaff/StaffMenu.jsx'
import StaffLayout from './assets/RestaurantStaff/StaffLayout.jsx'
import StaffInventory from './assets/RestaurantStaff/StaffInventory.jsx'
import StaffProfile from './assets/RestaurantStaff/StaffProfile.jsx'
import Orders from './assets/RestaurantStaff/Orders.jsx'
import CustomerLayout from './assets/Customer/CustomerLayout.jsx'
import CustomerDashboard from './assets/Customer/CustomerDashboard.jsx'
import CustomerMenu from './assets/Customer/CustomerMenu.jsx'
import CustomerOrders from './assets/Customer/CustomerOrders.jsx'
import CustomerProfile from './assets/Customer/CustomerProfile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to login */}
          <Route path='/' element={<Navigate to='/login' replace />} />
          
          {/* Public Login/Register Page */}
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Staff Routes */}
          <Route path='/staff' element={
            <ProtectedRoute allowedRoles={['restaurant']}>
              <StaffLayout />
            </ProtectedRoute>
          }>
            <Route path='dashboard' element={<StaffDashboard />} />
            <Route path='menu' element={<StaffMenu />} />
            <Route path='inventory' element={<StaffInventory />} />
            <Route path='profile' element={<StaffProfile />} />
            <Route path='orders' element={<Orders />} />
          </Route>

          {/* Customer Routes */}
          <Route path='/customer' element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerLayout />
            </ProtectedRoute>
          }>
            <Route path='dashboard' element={<CustomerDashboard />} />
            <Route path='menu' element={<CustomerMenu />} />
            <Route path='orders' element={<CustomerOrders />} />
            <Route path='profile' element={<CustomerProfile />} />
          </Route>

          {/* Catch all - redirect to login */}
          <Route path='*' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
      <SpeedInsights />
    </>
  )
}

export default App
