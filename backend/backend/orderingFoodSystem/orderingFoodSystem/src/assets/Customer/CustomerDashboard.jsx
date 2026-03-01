import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHistory, FaStar, FaClock, FaBell, FaUtensils, FaPlus, FaMinus, FaSearch, FaCamera } from "react-icons/fa";
import { orderAPI, foodAPI, getFoodImageUrl } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function CustomerDashboard() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [allFoods, setAllFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    avgRating: 0,
    avgDeliveryTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState({});
  
  const { user, isAuthenticated } = useAuth();
  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Fetch orders and foods from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await orderAPI.getAll();
        const orders = ordersResponse.data || [];
        
        // Get recent orders (last 3)
        setRecentOrders(orders.slice(0, 3));
        
        // Calculate stats
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_price || 0), 0);
        
        setStats({
          totalOrders,
          totalSpent,
          avgRating: 4.5,
          avgDeliveryTime: 25
        });

        // Fetch foods for menu
        const foodsResponse = await foodAPI.getAll();
        const foods = foodsResponse.data || [];
        setAllFoods(foods.filter(f => f.available));
        setFilteredFoods(foods.filter(f => f.available));
        
      } catch (err) {
        console.error("Error fetching data:", err);
        setRecentOrders([]);
        setAllFoods([]);
        setFilteredFoods([]);
        setStats({
          totalOrders: 0,
          totalSpent: 0,
          avgRating: 0,
          avgDeliveryTime: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter foods when search or category changes
  useEffect(() => {
    let filtered = allFoods.filter(f => f.available);
    
    if (searchTerm) {
      filtered = filtered.filter(f => 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (f.description && f.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(f => f.category === selectedCategory);
    }
    
    setFilteredFoods(filtered);
  }, [searchTerm, selectedCategory, allFoods]);

  const formatPrice = (price) => {
    return `Tzs${parseFloat(price || 0).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const getCartItem = (foodId) => {
    return cart.find(item => item.id === foodId);
  };

  const handleAddToCart = (food) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate('/login');
      return;
    }
    addToCart(food);
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      alert("Please login to place an order");
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address");
      return;
    }

    setPlacingOrder(true);
    
    try {
      const orderData = {
        items: cart,
        delivery_address: deliveryAddress
      };
      
      const response = await orderAPI.create(orderData);
      
      alert("Order placed successfully!");
      clearCart();
      setDeliveryAddress("");
      
      // Refresh orders
      const ordersResponse = await orderAPI.getAll();
      setRecentOrders((ordersResponse.data || []).slice(0, 3));
      
      navigate('/customer/orders');
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  const categories = ["All", ...new Set(allFoods.map(f => f.category || 'Other'))];

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h1 className="fw-bold mb-0" style={{ color: "#252221ff" }}>Welcome back{user?.username ? `, ${user.username}` : ''}!</h1>
          <p className="text-muted mb-0 small">Ready to order your favorite food?</p>
        </div>
        <div className="d-flex align-items-center">
          <FaShoppingCart className="me-2" style={{ color: "#ff5722" }} />
          <span className="badge" style={{ backgroundColor: "#3b3837ff", fontSize: "0.9rem", padding: "6px 10px" }}>
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="row g-3 g-lg-4 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px", backgroundColor: "#252221ff", color: "white" }}>
            <div className="card-body text-center p-3 p-lg-4">
              <FaShoppingCart size={24} className="mb-2" />
              <h4 className="mb-1">{stats.totalOrders}</h4>
              <small>Total Orders</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px", backgroundColor: "#252221ff", color: "white" }}>
            <div className="card-body text-center p-3 p-lg-4">
              <FaHistory size={24} className="mb-2" />
              <h4 className="mb-1">{formatPrice(stats.totalSpent)}</h4>
              <small>Total Spent</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px", backgroundColor: "#252221ff", color: "white" }}>
            <div className="card-body text-center p-3 p-lg-4">
              <FaStar size={24} className="mb-2" />
              <h4 className="mb-1">{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : 'N/A'}</h4>
              <small>Avg Rating</small>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card shadow-sm border-0 h-100" style={{ borderRadius: "15px", backgroundColor: "#252221ff", color: "white" }}>
            <div className="card-body text-center p-3 p-lg-4">
              <FaClock size={24} className="mb-2" />
              <h4 className="mb-1">{stats.avgDeliveryTime} min</h4>
              <small>Avg Delivery</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Food Menu Section */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm mb-4" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div className="card-header bg-white border-0 pt-3 pt-lg-4">
              <h5 className="mb-0 fw-bold" style={{ color: "#ff5722" }}>
                <FaUtensils className="me-2" />
                Our Menu
              </h5>
            </div>
            <div className="card-body">
              {/* Search and Filter */}
              <div className="row g-2 mb-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text" style={{ backgroundColor: "#f8f9fa" }}>
                      <FaSearch style={{ color: "#ff5722" }} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for food..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <select
                    className="form-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Food Grid */}
              {filteredFoods.length === 0 ? (
                <div className="text-center py-4">
                  <FaUtensils size={40} className="text-muted mb-3" />
                  <p className="text-muted">No food items found.</p>
                </div>
              ) : (
                <div className="row g-3">
                  {filteredFoods.map((food) => {
                    const cartItem = getCartItem(food.id);
                    return (
                      <div key={food.id} className="col-6 col-md-4">
                        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: "15px" }}>
                          {food.image && !imageLoadErrors[food.id] ? (
                            <img
                              src={getFoodImageUrl(food.image)}
                              alt={food.name}
                              style={{ height: "120px", width: "100%", objectFit: "cover", borderRadius: "15px 15px 0 0" }}
                              onError={() => setImageLoadErrors((prev) => ({ ...prev, [food.id]: true }))}
                            />
                          ) : (
                            <div style={{ height: "120px", borderRadius: "15px 15px 0 0", backgroundColor: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <FaCamera className="text-muted" />
                            </div>
                          )}
                          <div className="card-body p-2 text-center">
                            <h6 className="card-title mb-1" style={{ fontSize: "0.9rem" }}>{food.name}</h6>
                            <p className="card-text text-muted mb-1" style={{ fontSize: "0.75rem" }}>
                              {food.description?.substring(0, 30)}...
                            </p>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="fw-bold" style={{ color: "#ff5722", fontSize: "0.9rem" }}>
                                {formatPrice(food.price)}
                              </span>
                              {cartItem ? (
                                <div className="d-flex align-items-center">
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => updateQuantity(food.id, cartItem.quantity - 1)}
                                  >
                                    <FaMinus />
                                  </button>
                                  <span className="mx-2 fw-bold">{cartItem.quantity}</span>
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => updateQuantity(food.id, cartItem.quantity + 1)}
                                  >
                                    <FaPlus />
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  className="btn btn-sm"
                                  style={{ backgroundColor: "#252221ff", color: "white" }}
                                  onClick={() => handleAddToCart(food)}
                                >
                                  <FaPlus />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

      {/* Recent Orders */}
          <div className="card shadow-sm" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div className="card-header bg-white border-0 pt-3 pt-lg-4">
              <h5 className="mb-0 fw-bold" style={{ color: "#ff5722" }}>Recent Orders</h5>
            </div>
            <div className="card-body">
              {recentOrders.length === 0 ? (
                <div className="text-center py-4">
                  <FaShoppingCart size={40} className="text-muted mb-3" />
                  <p className="text-muted mb-3">No orders yet</p>
                  <p className="text-muted small">Place your first order using the menu!</p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center border-bottom py-3 gap-2">
                    <div>
                      <h6 className="mb-1">Order #{order.id}</h6>
                      <small className="text-muted">
                        {formatDate(order.created_at)} • {order.items?.length || 0} items
                      </small>
                    </div>
                    <div className="text-sm-end">
                      <small className={`badge bg-${getStatusColor(order.status)} mb-1`}>
                        {order.status || 'Unknown'}
                      </small>
                      <div className="fw-bold" style={{ color: "#ff5722" }}>{formatPrice(order.total_price)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", top: "20px" }}>
            <div className="card-header" style={{ backgroundColor: "#252221ff", color: "white", borderRadius: "15px 15px 0 0" }}>
              <h5 className="mb-0"><FaShoppingCart className="me-2" />Your Order</h5>
            </div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted text-center">Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{item.name}</h6>
                        <small className="text-muted">{formatPrice(item.price)} each</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <button
                          className="btn btn-sm btn-outline-secondary me-2"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <FaMinus />
                        </button>
                        <span className="fw-bold mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary ms-2"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="border-top pt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>{formatPrice(cartTotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Delivery Fee:</span>
                      <span>{formatPrice(2000)}</span>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-bold">Delivery Address</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Enter your delivery address..."
                      ></textarea>
                    </div>
                    
                    <div className="d-flex justify-content-between mb-3 fw-bold">
                      <span>Total:</span>
                      <span style={{ color: "#ff5722" }}>{formatPrice(cartTotal + 2000)}</span>
                    </div>
                    <button 
                      className="btn w-100" 
                      style={{ backgroundColor: "#ff5722", borderColor: "#ff5722", color: "white" }}
                      onClick={handlePlaceOrder}
                      disabled={placingOrder || !deliveryAddress.trim()}
                    >
                      {placingOrder ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Placing Order...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
