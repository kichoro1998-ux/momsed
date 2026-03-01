import { Link } from "react-router-dom";
import { FaUtensils, FaUserCircle, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return '/customer/dashboard';
    const role = user.role || 'customer';
    if (role === 'restaurant') return '/staff/dashboard';
    return '/customer/dashboard';
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top custom-navbar">
        <div className="container-fluid px-4">
          
          {/* LOGO */}
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <FaUtensils className="logo-icon" />
            <span className="logo-text">QuickBite</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navMenu"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navMenu">
            <ul className="navbar-nav ms-auto gap-lg-3">
              {/* Cart Icon - only for authenticated customers */}
              {isAuthenticated && user?.role === 'customer' && (
                <li className="nav-item">
                  <Link className="nav-link custom-link position-relative" to="/customer/menu">
                    <FaShoppingCart />
                    {cartItemCount > 0 && (
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </li>
              )}
              
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link custom-link d-flex align-items-center gap-1" to={getDashboardLink()}>
                      <FaUserCircle /> Dashboard
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link custom-link btn btn-link text-decoration-none"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link custom-link" to="/login">Login / Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

        </div>
      </nav>
    </>
  );
}
