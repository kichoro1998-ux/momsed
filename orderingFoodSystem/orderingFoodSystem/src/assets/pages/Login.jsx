import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserAlt, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa";
import { authAPI } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    // Check if accessed via /register route
    useEffect(() => {
        if (location.pathname === '/register') {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [location.pathname]);

    // Toggle between login and register
    const handleToggle = (targetState) => {
        setIsLogin(targetState);
        navigate(targetState ? '/login' : '/register', { replace: true });
    };
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login, getRedirectPath } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isLogin) {
            // Login validation
            const { email, password } = formData;

            if (!email || !password) {
                setError("Both email and password are required");
                return;
            }

            // Basic email validation
            if (!email.includes('@')) {
                setError("Please enter a valid email address");
                return;
            }

            // Password length
            if (password.length < 8) {
                setError("Password must be at least 8 characters");
                return;
            }

            setLoading(true);
            setError("");

            try {
                console.log(" Attempting login for:", email);
                const data = await authAPI.login(email, password);
                console.log("Login successful:", data);

                // Store auth data
                login(data.user, data.access, data.refresh);

                // Get user role and redirect to appropriate dashboard
                const userRole = data.user?.role || 'customer';
                const redirectPath = getRedirectPath(userRole);

                alert("Login successful!");
                navigate(redirectPath, { replace: true });
            } catch (err) {
                console.error(" Login failed:", err);
                console.error("Error response:", err.response?.data);
                console.error("Status:", err.response?.status);

                if (!err.response) {
                    setError("Cannot reach server. Check VITE_API_URL, backend deployment, and CORS settings.");
                    return;
                }

                setError(
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    "Login failed. Please check your credentials or try again."
                );
            } finally {
                setLoading(false);
            }
        } else {
            // Register validation
            const { username, email, password, confirmPassword } = formData;

            if (!username || !email || !password || !confirmPassword) {
                setError("All fields are required");
                return;
            }

            // Username validation
            if (username.length < 3) {
                setError("Username must be at least 3 characters");
                return;
            }

            // Basic email validation
            if (!email.includes('@')) {
                setError("Please enter a valid email address");
                return;
            }

            // Password validation
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
                await authAPI.register(username, password, email);
                alert("Registration successful! Please login.");
                setIsLogin(true);
                setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            } catch (err) {
                console.error("Registration failed:", err);
                console.error("Response data:", err.response?.data);
                console.error("Response status:", err.response?.status);
                if (!err.response) {
                    setError("Cannot reach server. Check VITE_API_URL, backend deployment, and CORS settings.");
                    return;
                }
                const errorMsg = err.response?.data?.username?.[0] ||
                               err.response?.data?.email?.[0] ||
                               err.response?.data?.password?.[0] ||
                               err.response?.data?.error ||
                               err.response?.data?.detail ||
                               "Registration failed. Please try again.";
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
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
                {/* Overlay for dark blur */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backdropFilter: "blur(5px)",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 1,
                    }}
                ></div>

        {/* LOGIN CARD */}
                <div
                    className="card p-5 shadow-lg fade-in-up login-card"
                    style={{
                        maxWidth: "450px",
                        width: "100%",
                        borderRadius: "20px",
                        backgroundColor: "rgba(255,255,255,0.1)", // glass effect
                        backdropFilter: "blur(10px)",
                        zIndex: 2,
                        color: "#fff",
                    }}
                >
                    <div className="text-center mb-4">
                        <h2 className="fw-bold">{isLogin ? "Welcome Back!" : "Create Your Account"}</h2>
                        <p>{isLogin ? "Log in to order your favorite meals" : "Register now to start ordering your favorite meals!"}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="alert alert-danger py-2 mb-3">
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                            <>
                                {/* USERNAME - Only for Register */}
                                <div className="mb-3 text-start" style={{ position: "relative" }}>
                                    <label htmlFor="username" className="form-label fw-bold">
                                        Username
                                    </label>
                                    <FaUserAlt
                                        style={{
                                            position: "absolute",
                                            top: "38px",
                                            left: "10px",
                                            color: "#e53935",
                                        }}
                                    />
                                    <input
                                        type="text"
                                        className="form-control ps-5"
                                        id="username"
                                        name="username"
                                        placeholder="Choose a username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </>
                        )}

                        {/* EMAIL */}
                        <div className="mb-3 text-start" style={{ position: "relative" }}>
                            <label htmlFor="email" className="form-label fw-bold">
                                Email
                            </label>
                            <FaEnvelope
                                style={{
                                    position: "absolute",
                                    top: "38px",
                                    left: "10px",
                                    color: "#e53935",
                                }}
                            />
                            <input
                                type="email"
                                className="form-control ps-5"
                                id="email"
                                name="email"
                                placeholder="email@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="mb-3 text-start" style={{ position: "relative" }}>
                            <label htmlFor="password" className="form-label fw-bold">
                                Password
                            </label>
                            <FaLock
                                style={{
                                    position: "absolute",
                                    top: "38px",
                                    left: "10px",
                                    color: "#e53935",
                                }}
                            />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control ps-5 pe-5"
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <span
                                style={{
                                    position: "absolute",
                                    top: "38px",
                                    right: "10px",
                                    cursor: "pointer",
                                    color: "#e53935",
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </span>
                        </div>

                        {!isLogin && (
                            <>
                                {/* CONFIRM PASSWORD - Only for Register */}
                                <div className="mb-3 text-start" style={{ position: "relative" }}>
                                    <label htmlFor="confirmPassword" className="form-label fw-bold">
                                        Confirm Password
                                    </label>
                                    <FaLock
                                        style={{
                                            position: "absolute",
                                            top: "38px",
                                            left: "10px",
                                            color: "#e53935",
                                        }}
                                    />
                                    <input
                                        type="password"
                                        className="form-control ps-5"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        placeholder="Confirm password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>

                                {/* ROLE SELECTION - Only for Register */}
                                <div className="mb-4 text-start">
                                    <label className="form-label fw-bold">Account Type</label>
                                    <select
                                        className="form-select"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            color: '#fff',
                                            border: '1px solid rgba(255,255,255,0.3)'
                                        }}
                                    >
                                        <option value="customer" style={{ color: '#000' }}>Customer</option>
                                        <option value="restaurant" style={{ color: '#000' }}>Restaurant Staff</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button type="submit" className="btn btn-danger w-100 mb-3" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {isLogin ? "Logging in..." : "Registering..."}
                                </>
                            ) : (
                                isLogin ? "Login" : "Register"
                            )}
                        </button>

                        {/* TOGGLE LINK */}
                        <p className="text-center mt-2">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                type="button"
                                className="btn btn-link text-warning fw-bold p-0"
                                style={{ textDecoration: "underline" }}
                                onClick={() => handleToggle(!isLogin)}
                            >
                                {isLogin ? "Register" : "Login"}
                            </button>
                        </p>
                    </form>
                </div>
            </section>
        </>
    );
}
