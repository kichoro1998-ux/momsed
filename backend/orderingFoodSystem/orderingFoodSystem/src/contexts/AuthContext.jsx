import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('accessToken');

        if (storedUser && storedToken) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            } catch (e) {
                console.error('Error parsing stored user:', e);
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, accessToken, refreshToken) => {
        setUser(userData);
        setToken(accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    // Helper function to get redirect path based on user role
    const getRedirectPath = (userRole) => {
        switch (userRole) {
            case 'restaurant':
                return '/staff/dashboard';
            case 'customer':
                return '/customer/dashboard';
            default:
                return '/customer/dashboard';
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        getRedirectPath,
        isAuthenticated: !!token && !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
