import { useState, useEffect } from 'react';
import { FaShoppingCart, FaFire } from "react-icons/fa";
import { foodAPI, getFoodImageUrl } from "../../utils/api";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

export default function Menu() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

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

  const handleAddToCart = (food) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }
    addToCart(food);
    alert(`${food.name} added to cart!`);
  };

  const formatPrice = (price) => {
    return `Tzs${parseFloat(price).toLocaleString()}`;
  };

  return (
    <>
      {/* HERO */}
      <section className="menu-hero d-flex align-items-center text-light">
        <div className="container-fluid text-center">
          <h1 className="display-3 fw-bold">Our Menu</h1>
          <p className="lead mt-2">
            Fresh • Fast • Delicious meals crafted just for you
          </p>
        </div>
      </section>

      {/* MENU SECTION */}
      <section className="py-4 py-lg-5 bg-light">
        <div className="container-fluid">
          {error && (
            <div className="alert alert-danger text-center mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading menu...</p>
            </div>
          ) : (
            <>
              {foods.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No food items available at the moment.</p>
                </div>
              ) : (
                <div className="row g-3 g-lg-4">
                  {foods.map((food) => (
                    <div key={food.id} className="col-6 col-md-4 col-lg-3">
                      <div className="menu-card h-100">
                        {food.available && (
                          <span className="badge-hot">
                            <FaFire /> Hot
                          </span>
                        )}
                        <img 
                          src={getFoodImageUrl(food.image)} 
                          alt={food.name}
                          onError={(e) => {
                            e.target.src = "/foodpic.jpg";
                          }}
                        />
                        <div className="menu-body">
                          <h5 className="mb-1">{food.name}</h5>
                          <p className="mb-2">{food.description || 'Delicious food item'}</p>
                          <div className="menu-footer">
                            <span className="price">{formatPrice(food.price)}</span>
                            <button 
                              className="btn btn-sm btn-danger"
                              onClick={() => handleAddToCart(food)}
                              disabled={!food.available}
                            >
                              <FaShoppingCart />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
