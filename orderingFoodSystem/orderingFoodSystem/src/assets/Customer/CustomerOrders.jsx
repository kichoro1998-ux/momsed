import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaRedo, FaStar, FaSearch, FaFilter, FaSync } from "react-icons/fa";
import { orderAPI } from "../../utils/api";

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load only (manual refresh button handles updates)
  useEffect(() => {
    fetchOrders();
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const formatPrice = (price) => {
    return `Tzs${parseFloat(price || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = (order.id?.toString().includes(searchTerm)) ||
                         (order.delivery_address?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "success";
      case "pending": return "warning";
      case "approved": return "info";
      case "preparing": return "warning";
      case "on the way": return "info";
      case "cancelled": return "danger";
      default: return "secondary";
    }
  };

  const reorderItems = (order) => {
    alert(`Reorder feature coming soon for order #${order.id}`);
  };

  if (loading) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold" style={{ color: "#3a3736ff" }}>My Orders</h1>
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh orders"
          >
            <FaSync className={refreshing ? "fa-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
          <span className="badge" style={{ backgroundColor: "#ff5722", fontSize: "1rem", padding: "8px 12px" }}>
            {orders.length} orders
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="card p-3 mb-4" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
        <div className="row g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: "#f8f9fa", borderColor: "#dee2e6" }}>
                <FaSearch style={{ color: "#ff5722" }} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: "#dee2e6" }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ borderColor: "#dee2e6" }}
            >
              <option value="All">All Orders</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="preparing">Preparing</option>
              <option value="on the way">On the way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center mb-4">
          {error}
        </div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-5">
          <FaSearch size={48} className="text-muted mb-3" />
          <h5 className="text-muted">No orders found</h5>
          <p className="text-muted">
            {orders.length === 0 ? "You haven't placed any orders yet." : "Try different search words"}
          </p>
          {orders.length === 0 && (
            <button 
              className="btn btn-primary mt-3"
              onClick={() => navigate('/customer/menu')}
            >
              Browse Menu
            </button>
          )}
        </div>
      ) : (
        <div className="row g-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="col-12">
              <div className="card shadow-sm" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-2">
                      <h5 className="mb-1" style={{ color: "#ff5722" }}>#{order.id}</h5>
                      <small className="text-muted">{formatDate(order.created_at)}</small>
                    </div>
                    <div className="col-md-3">
                      <small className="text-muted d-block">Delivery Address:</small>
                      <h6 className="mb-1">{order.delivery_address || 'N/A'}</h6>
                    </div>
                    <div className="col-md-2">
                      <div className="mb-2">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, index) => (
                            <small key={index} className="d-block text-muted">
                              {item.food_name || `Food #${item.food}`} x {item.quantity}
                            </small>
                          ))
                        ) : (
                          <small className="text-muted">No items</small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-1">
                      <span className={`badge bg-${getStatusColor(order.status)}`} style={{ fontSize: "0.8rem" }}>
                        {order.status || 'Unknown'}
                      </span>
                    </div>
                    <div className="col-md-2 text-center">
                      <div className="fw-bold fs-5" style={{ color: "#ff5722" }}>{formatPrice(order.total_price)}</div>
                      <small className="text-muted">{order.items?.length || 0} items</small>
                    </div>
                    <div className="col-md-2">
                      <div className="d-flex gap-2 justify-content-center">
                        <button 
                          className="btn btn-outline-primary btn-sm" 
                          title="View Details"
                          style={{ borderColor: "#ff5722", color: "#ff5722" }}
                          onClick={() => alert(`Order #${order.id} details coming soon!`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm"
                          onClick={() => reorderItems(order)}
                          title="Order Again"
                          style={{ backgroundColor: "#ff5722", borderColor: "#ff5722", color: "white" }}
                        >
                          <FaRedo />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {orders.length > 0 && (
        <div className="row g-4 mt-4">
          <div className="col-md-3">
            <div className="card shadow-sm text-center" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <div className="card-body">
                <h4 style={{ color: "#ff5722" }}>{orders.length}</h4>
                <small className="text-muted">Total Orders</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <div className="card-body">
                <h4 style={{ color: "#ff5722" }}>
                  {formatPrice(orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0))}
                </h4>
                <small className="text-muted">Total Spent</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <div className="card-body">
                <h4 style={{ color: "#ff5722" }}>
                  {orders.filter(o => o.status === 'delivered').length}
                </h4>
                <small className="text-muted">Delivered</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm text-center" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <div className="card-body">
                <h4 style={{ color: "#ff5722" }}>
                  {orders.filter(o => o.status === 'pending').length}
                </h4>
                <small className="text-muted">Pending</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
