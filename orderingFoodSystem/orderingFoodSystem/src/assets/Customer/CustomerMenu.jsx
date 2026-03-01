import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingCart, FaSearch } from "react-icons/fa";
import { foodAPI, orderAPI, getFoodImageUrl } from "../../utils/api";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export default function CustomerMenu() {
  const FALLBACK_IMAGE = "/vite.svg";
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch foods from API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await foodAPI.getAll();
        setFoods(response.data);
      } catch (err) {
        console.error("Error fetching foods:", err);
        setError("Failed to load menu. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // Get unique categories
  const categories = ["All", ...new Set(foods.map(item => item.category || 'Other'))];

  // Filter foods
  const filteredItems = foods.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory && item.available;
  });

  const handleAddToCart = (food) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      navigate('/login');
      return;
    }
    addToCart(food);
  };

  const getCartItem = (foodId) => {
    return cart.find(item => item.id === foodId);
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
      console.log("Order placed successfully:", response);
      
      alert("Order placed successfully!");
      clearCart();
      setDeliveryAddress("");
      navigate('/customer/orders');
    } catch (err) {
      console.error("Error placing order:", err);
      console.error("Error response:", err.response?.data);
      alert(`Failed to place order: ${err.response?.data?.detail || err.message}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  const formatPrice = (price) => {
    return `Tzs${parseFloat(price).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="container-fluid text-center py-5">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold" style={{ color: "#383635ff" }}>Order Food</h1>
        <div className="d-flex align-items-center">
          <FaShoppingCart className="me-2" style={{ color: "#ff5722" }} />
          <span className="badge" style={{ backgroundColor: "#3b3837ff", fontSize: "1rem", padding: "8px 12px" }}>
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items
          </span>
        </div>
      </div>

      {/* Search and Filter */}
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
                placeholder="Search for food..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: "#dee2e6" }}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ borderColor: "#dee2e6" }}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center mb-4">
          {error}
        </div>
      )}

      <div className="row">
        {/* Menu Items */}
        <div className="col-md-8">
          {filteredItems.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No food items found.</p>
            </div>
          ) : (
            <div className="row g-4">
              {filteredItems.map((item) => {
                const cartItem = getCartItem(item.id);
                return (
                  <div key={item.id} className="col-md-6">
                    <div className="card h-100 shadow-sm" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
                      <img 
                        src={getFoodImageUrl(item.image)} 
                        alt={item.name}
                        style={{ height: "150px", objectFit: "contain", borderRadius: "15px 15px 0 0", backgroundColor: "#f8f9fa" }}
                        onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">{item.name}</h5>
                        <p className="card-text text-muted small">{item.description || 'Delicious food item'}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold fs-5" style={{ color: "#ff5722" }}>{formatPrice(item.price)}</span>
                          {cartItem ? (
                            <div className="d-flex align-items-center">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => updateQuantity(item.id, cartItem.quantity - 1)}
                              >
                                <FaMinus />
                              </button>
                              <span className="mx-2 fw-bold">{cartItem.quantity}</span>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => updateQuantity(item.id, cartItem.quantity + 1)}
                              >
                                <FaPlus />
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn"
                              onClick={() => handleAddToCart(item)}
                              style={{ backgroundColor: "#252221ff", borderColor: "#ff5722", color: "white" }}
                              disabled={!item.available}
                            >
                              Add to Cart
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

        {/* Cart Sidebar */}
        <div className="col-md-4">
          <div className="card shadow-sm sticky-top" style={{ borderRadius: "15px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", top: "20px" }}>
            <div className="card-header" style={{ backgroundColor: "#252221ff", color: "white", borderRadius: "15px 15px 0 0" }}>
              <h5 className="mb-0">Your Order</h5>
            </div>
            <div className="card-body">
              {cart.length === 0 ? (
                <p className="text-muted text-center">Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      <div className="me-3">
                        <img 
                          src={getFoodImageUrl(item.image)} 
                          alt={item.name}
                          style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                          onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                        />
                      </div>
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
                    
                    {/* Delivery Address Input */}
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
    </div>
  );
}
