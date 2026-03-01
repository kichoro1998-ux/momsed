import { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { orderAPI } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState("all");
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(null);
    
    const { user } = useAuth();

    // Fetch orders from API
    useEffect(() => {
        fetchOrders();
    }, [statusFilter]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            let response;
            if (statusFilter && statusFilter !== "all") {
                response = await orderAPI.staffOrders(statusFilter);
            } else {
                response = await orderAPI.staffOrders();
            }
            
            console.log("Staff orders response:", response);
            
            // The backend returns { total: X, orders: [...] }
            const ordersData = response.data;
            if (ordersData && ordersData.orders && Array.isArray(ordersData.orders)) {
                setOrders(ordersData.orders);
            } else if (Array.isArray(ordersData)) {
                setOrders(ordersData);
            } else {
                setOrders([]);
            }
            setError("");
        } catch (err) {
            console.error("Error fetching orders:", err);
            console.error("Error details:", err.response?.data);
            setError("Failed to load orders. Please try again later.");
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return `Tzs${parseFloat(price || 0).toLocaleString()}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const approveOrder = async (id) => {
        setUpdatingId(id);
        try {
            await orderAPI.approve(id);
            setOrders(orders.map(order => 
                order.id === id ? { ...order, status: 'approved' } : order
            ));
            alert("Order approved successfully!");
        } catch (err) {
            console.error("Error approving order:", err);
            alert("Failed to approve order. Please try again.");
        } finally {
            setUpdatingId(null);
        }
    };

    const rejectOrder = async (id) => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }
        
        setUpdatingId(id);
        try {
            await orderAPI.reject(id, rejectReason);
            setOrders(orders.map(order => 
                order.id === id ? { ...order, status: 'cancelled' } : order
            ));
            setShowRejectModal(null);
            setRejectReason("");
            alert("Order rejected successfully!");
        } catch (err) {
            console.error("Error rejecting order:", err);
            console.error("Error response:", err.response?.data);
            const errorMessage = err.response?.data?.error || err.response?.data?.detail || "Failed to reject order. Please try again.";
            alert(errorMessage);
        } finally {
            setUpdatingId(null);
        }
    };

    const updateOrderStatus = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await orderAPI.update(id, { status: newStatus });
            setOrders(orders.map(order => 
                order.id === id ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            console.error("Error updating order:", err);
            alert("Failed to update order status. Please try again.");
        } finally {
            setUpdatingId(null);
        }
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

    const pendingCount = orders.filter(o => o.status === 'pending').length;
    const approvedCount = orders.filter(o => o.status === 'approved').length;

    if (loading) {
        return (
            <div className="container-fluid text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading orders...</p>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
                <h1 className="fw-bold mb-0">📦 Orders Management</h1>
                <div className="d-flex align-items-center gap-2">
                    {pendingCount > 0 && (
                        <span className="badge bg-danger">{pendingCount} Pending</span>
                    )}
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mb-4">
                    {error}
                </div>
            )}

            {/* Status Filter */}
            <div className="mb-4 d-flex gap-2 flex-wrap">
                <button 
                    className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setStatusFilter('all')}
                >
                    All Orders ({orders.length})
                </button>
                <button 
                    className={`btn ${statusFilter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setStatusFilter('pending')}
                >
                    Pending ({orders.filter(o => o.status === 'pending').length})
                </button>
                <button 
                    className={`btn ${statusFilter === 'approved' ? 'btn-info' : 'btn-outline-info'}`}
                    onClick={() => setStatusFilter('approved')}
                >
                    Approved ({orders.filter(o => o.status === 'approved').length})
                </button>
                <button 
                    className={`btn ${statusFilter === 'preparing' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setStatusFilter('preparing')}
                >
                    Preparing ({orders.filter(o => o.status === 'preparing').length})
                </button>
            </div>

            {/* Orders Table */}
            <div className="card shadow p-3" style={{ borderRadius: "15px" }}>
                <h3 className="fw-bold mb-3">Orders ({orders.length})</h3>
                
                {orders.length === 0 ? (
                    <div className="text-center py-4">
                        <p className="text-muted">No orders found for this status.</p>
                    </div>
                ) : (
                    <div className="table-responsive-custom">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Delivery Address</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="fw-bold">#{order.id}</td>
                                        <td>
                                            {order.customer_username || 'Unknown'}
                                            <br />
                                            <small className="text-muted">{order.customer_email || ''}</small>
                                        </td>
                                        <td>
                                            {order.items && order.items.length > 0 ? (
                                                <ul className="mb-0 ps-3">
                                                    {order.items.map((item, idx) => (
                                                        <li key={idx} className="small">
                                                            {item.food_name || `Food #${item.food}`} x {item.quantity}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : 'No items'}
                                        </td>
                                        <td className="fw-bold">{formatPrice(order.total_price)}</td>
                                        <td className="small">{order.delivery_address || 'N/A'}</td>
                                        <td className="small">{formatDate(order.created_at)}</td>
                                        <td>
                                            <span className={`badge ${getStatusBadge(order.status)}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="d-flex flex-wrap gap-1">
                                                {order.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            className="btn btn-sm btn-success d-flex align-items-center gap-1"
                                                            onClick={() => approveOrder(order.id)}
                                                            disabled={updatingId === order.id}
                                                            title="Approve this order"
                                                        >
                                                            {updatingId === order.id ? (
                                                                <span className="spinner-border spinner-border-sm"></span>
                                                            ) : (
                                                                <>
                                                                    <FaCheckCircle size={14} />
                                                                    Approve
                                                                </>
                                                            )}
                                                        </button>
                                                        <button 
                                                            className="btn btn-sm btn-danger d-flex align-items-center gap-1"
                                                            onClick={() => setShowRejectModal(order.id)}
                                                            disabled={updatingId === order.id}
                                                            title="Reject this order"
                                                        >
                                                            <FaTimesCircle size={14} />
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {order.status === 'approved' && (
                                                    <button 
                                                        className="btn btn-sm btn-primary"
                                                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                                                        disabled={updatingId === order.id}
                                                    >
                                                        {updatingId === order.id ? (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        ) : (
                                                            'Start Preparing'
                                                        )}
                                                    </button>
                                                )}
                                                {order.status === 'preparing' && (
                                                    <button 
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => updateOrderStatus(order.id, 'on the way')}
                                                        disabled={updatingId === order.id}
                                                    >
                                                        {updatingId === order.id ? (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        ) : (
                                                            'Mark Ready'
                                                        )}
                                                    </button>
                                                )}
                                                {order.status === 'on the way' && (
                                                    <button 
                                                        className="btn btn-sm btn-info text-white"
                                                        onClick={() => updateOrderStatus(order.id, 'delivered')}
                                                        disabled={updatingId === order.id}
                                                    >
                                                        {updatingId === order.id ? (
                                                            <span className="spinner-border spinner-border-sm"></span>
                                                        ) : (
                                                            'Mark Delivered'
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title">Reject Order #{showRejectModal}</h5>
                                <button 
                                    type="button" 
                                    className="btn-close btn-close-white"
                                    onClick={() => setShowRejectModal(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label className="form-label">Reason for rejection:</label>
                                <textarea 
                                    className="form-control"
                                    rows="4"
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Enter reason (e.g., Out of stock, unable to prepare)"
                                ></textarea>
                            </div>
                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setShowRejectModal(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger"
                                    onClick={() => rejectOrder(showRejectModal)}
                                    disabled={updatingId === showRejectModal}
                                >
                                    {updatingId === showRejectModal ? (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    ) : (
                                        'Reject Order'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}


