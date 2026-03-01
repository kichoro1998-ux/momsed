import { useState, useEffect } from "react";
import {
  FaClipboardList,
  FaUtensils,
  FaBoxOpen,
  FaUser,
  FaSync,
  FaDollarSign
} from "react-icons/fa";
import { orderAPI } from "../../utils/api";

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    ready: 0,
    totalCustomers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  // Fetch dashboard stats from API
  const fetchDashboardStats = async () => {
    try {
      if (!refreshing) setLoading(true);
      
      // Fetch all orders for staff
      const response = await orderAPI.staffOrders();
      const ordersData = response.data.orders || [];
      
      // Calculate stats from orders
      const pending = ordersData.filter(o => o.status === 'pending').length;
      const preparing = ordersData.filter(o => o.status === 'approved' || o.status === 'preparing').length;
      const ready = ordersData.filter(o => o.status === 'on the way' || o.status === 'delivered').length;
      
      // Get unique customers from orders (using customer ID)
      const uniqueCustomers = new Set(ordersData.map(o => o.customer));
      
      // Calculate total revenue
      const totalRevenue = ordersData.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
      
      setStats({
        pending,
        preparing,
        ready,
        totalCustomers: uniqueCustomers.size,
        totalRevenue
      });
      
      // Transform recent orders for display
      const transformedOrders = ordersData.slice(0, 5).map(order => ({
        id: order.id,
        customer: order.customer_username || 'Unknown',
        status: order.status || 'pending',
        total: order.total_price || 0,
        items: order.items?.length || 0,
        date: order.created_at
      }));
      setRecentOrders(transformedOrders);
      
      setError("");
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load only. Refresh is controlled by the button.
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  const formatPrice = (price) => {
    return `Tzs${parseFloat(price || 0).toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-warning text-dark';
      case 'approved': return 'bg-info';
      case 'preparing': return 'bg-primary';
      case 'on the way': return 'bg-info';
      case 'delivered': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <h1 className="fw-bold mb-0">Dashboard</h1>
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 me-2"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh dashboard"
          >
            <FaSync className={refreshing ? "fa-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <span className="badge bg-danger">{stats.pending} pending</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger mb-4">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="row g-3 g-lg-4 mb-5">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow p-3 text-center h-100 rounded-4">
            <FaClipboardList size={30} className="text-danger" />
            <h5 className="mt-2 mb-1">Pending Orders</h5>
            <p className="fw-bold fs-4 mb-0">
              {stats.pending}
            </p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow p-3 text-center h-100 rounded-4">
            <FaUtensils size={30} className="text-danger" />
            <h5 className="mt-2 mb-1">Preparing</h5>
            <p className="fw-bold fs-4 mb-0">
              {stats.preparing}
            </p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow p-3 text-center h-100 rounded-4">
            <FaDollarSign size={30} className="text-success" />
            <h5 className="mt-2 mb-1">Revenue</h5>
            <p className="fw-bold fs-4 mb-0">
              {formatPrice(stats.totalRevenue)}
            </p>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow p-3 text-center h-100 rounded-4">
            <FaUser size={30} className="text-danger" />
            <h5 className="mt-2 mb-1">Total Customers</h5>
            <p className="fw-bold fs-4 mb-0">{stats.totalCustomers}</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="card shadow p-3" style={{ borderRadius: "15px" }}>
          <h3 className="fw-bold mb-3">Recent Orders</h3>
          <div className="table-responsive-custom">
            <table className="table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="fw-bold">#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.items > 0 ? `${order.items} items` : '0 items'}</td>
                    <td className="fw-bold">{formatPrice(order.total)}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status || 'Pending'}
                      </span>
                    </td>
                    <td className="small">
                      {order.date ? new Date(order.date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
