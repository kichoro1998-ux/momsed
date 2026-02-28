import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash, } from "react-icons/fa";
import { authAPI } from "../../utils/api";

export default function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  // All public registrations are automatically customers
  const role = "customer";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  // Generate username from first_name and last_name
  const generateUsername = (firstName, lastName) => {
    if (firstName && lastName) {
      return (firstName.toLowerCase() + "." + lastName.toLowerCase()).replace(/\s+/g, '');
    }
    return "";
  };

  // Form submit validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, email, password, confirmPassword, phone, address, role } = formData;

    if (!first_name || !last_name || !email || !password || !confirmPassword) {
      setError("All required fields must be filled");
      return;
    }

    // Generate username from first_name and last_name
    const username = generateUsername(first_name, last_name);
    if (!username) {
      setError("Please enter valid first name and last name");
      return;
    }

    // Basic email validation
    if (!email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }

    // Password
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authAPI.register(
        username, 
        password, 
        email, 
        role,
        first_name,
        last_name,
        phone,
        address
      );
      alert("Registration successful! Please login.");
      navigate('/login');
    } catch (err) {
      console.error("Registration failed:", err);
      if (!err.response) {
        setError("Cannot reach server. Check VITE_API_URL, backend deployment, and CORS settings.");
        return;
      }
      const errorMsg = err.response?.data?.username?.[0] || 
                       err.response?.data?.email?.[0] || 
                       err.response?.data?.password?.[0] ||
                       err.response?.data?.error || 
                       "Registration failed. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        className="hero d-flex align-items-center justify-content-center"
        style={{
          minHeight: "100vh",
          backgroundImage: "url('/foodpic.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1,
          }}
        ></div>

        <div
          className="card p-5 shadow-lg fade-in-up login-card"
          style={{
            maxWidth: "500px",
            width: "100%",
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            zIndex: 2,
            color: "#fff",
          }}
        >
          <div className="text-center mb-4">
            <h2 className="fw-bold">Create Your Account</h2>
            <p>Register now to start ordering your favorite meals!</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ERROR MESSAGE */}
            {error && (
              <div className="alert alert-danger py-2 mb-3">
                {error}
              </div>
            )}

            {/* FIRST NAME */}
            <div className="mb-3 text-start" style={{ position: "relative" }}>
              <label className="form-label fw-bold">First Name <span className="text-danger">*</span></label>
              <FaUserAlt
                style={{ position: "absolute", top: "38px", left: "10px", color: "#e53935" }}
              />
              <input
                type="text"
                className="form-control ps-5"
                name="first_name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* LAST NAME */}
            <div className="mb-3 text-start" style={{ position: "relative" }}>
              <label className="form-label fw-bold">Last Name <span className="text-danger">*</span></label>
              <FaUserAlt
                style={{ position: "absolute", top: "38px", left: "10px", color: "#e53935" }}
              />
              <input
                type="text"
                className="form-control ps-5"
                name="last_name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>

            {/* EMAIL */}
            <div className="mb-3 text-start" style={{ position: "relative" }}>
              <label className="form-label fw-bold">Email Address <span className="text-danger">*</span></label>
              <FaEnvelope
                style={{ position: "absolute", top: "38px", left: "10px", color: "#e53935" }}
              />
              <input
                type="email"
                className="form-control ps-5"
                name="email"
                placeholder="email@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PHONE */}
            <div className="mb-3 text-start" style={{ position: "relative" }}>
              <label className="form-label fw-bold">Phone Number</label>
              <FaPhone
                style={{ position: "absolute", top: "38px", left: "10px", color: "#e53935" }}
              />
              <input
                type="tel"
                className="form-control ps-5"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* ADDRESS */}
            <div className="mb-3 text-start" style={{ position: "relative" }}>
              <label className="form-label fw-bold">Address</label>
              <FaMapMarkerAlt
                style={{ position: "absolute", top: "38px", left: "10px", color: "#e53935" }}
              />
              <input
                type="text"
                className="form-control ps-5"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3 text-start" style={{ position: "relative" }}>
              <label className="form-label fw-bold">Password <span className="text-danger">*</span></label>
              <FaLock
                style={{ position: "absolute", top: "38px", left: "10px", color: "#e53935" }}
              />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control ps-5 pe-5"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                style={{ position: "absolute", top: "38px", right: "10px", cursor: "pointer", color: "#e53935" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-3 text-start" style={{ position: "relative" }}>
              <label className="form-label fw-bold">Confirm Password <span className="text-danger">*</span></label>
              <FaLock
                style={{ position: "absolute", top: "38px", left: "10px", color: "#e53935" }}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control ps-5 pe-5"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                style={{ position: "absolute", top: "38px", right: "10px", cursor: "pointer", color: "#e53935" }}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash/>}
              </span>
            </div>

            <button type="submit" className="btn btn-danger w-100 mb-3" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </>
              ) : (
                "Register"
              )}
            </button>

            <p className="text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-warning fw-bold" style={{ textDecoration: "underline" }}>
                Login
              </Link>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
