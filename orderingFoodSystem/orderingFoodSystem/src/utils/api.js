import axios from 'axios';

// Backend server URL configuration
// During development, Vite proxy will forward /api/* requests to the backend
// In production, set VITE_BACKEND_URL environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';
const API_URL = BACKEND_URL ? `${BACKEND_URL.replace(/\/$/, '')}/api` : '/api';

console.log('API Configuration:', { API_URL, BACKEND_URL });

/**
 * Constructs a full image URL from a relative path or returns full URL as-is
 * @param {string} imagePath - The image path from the backend (e.g., '/media/foods/image.jpg' or full URL)
 * @returns {string} Full URL to the image
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return '/foodpic.jpg';
    }
    
    // If already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // If path starts with /media/, return as relative path for proxy
    // The Vite proxy will forward /media/* to the backend
    if (imagePath.startsWith('/media/')) {
        return imagePath;
    }
    
    // If path starts with /, return as relative path
    if (imagePath.startsWith('/')) {
        return imagePath;
    }
    
    // Otherwise, prepend /media/
    return `/media/${imagePath}`;
};

/**
 * Fallback image URL for food items - uses Vite proxy to avoid CORS issues
 * This ensures images work by using same-origin requests through Vite dev server proxy
 * @param {string} imagePath - The image path from the backend (can be full URL or relative path)
 * @returns {string} URL for the image (uses proxy path for same-origin loading)
 */
export const getFoodImageUrl = (imagePath) => {
    if (!imagePath) {
        return '/foodpic.jpg';
    }
    
    // If already a full URL, extract just the path portion
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        // Extract path from full URL
        const url = new URL(imagePath);
        imagePath = url.pathname;
    }
    
    // Ensure path starts with /
    if (!imagePath.startsWith('/')) {
        imagePath = '/' + imagePath;
    }
    
    // Ensure path starts with /media/ for Vite proxy
    if (!imagePath.startsWith('/media/')) {
        imagePath = '/media/' + imagePath.replace(/^\//, '');
    }
    
    return imagePath;
};

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    xsrfCookieName: 'csrftoken',
    xsrfHeaderName: 'X-CSRFToken',
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${API_URL}/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccessToken = response.data.access;
                    localStorage.setItem('accessToken', newAccessToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed, logout user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API functions
export const authAPI = {
    login: async (email, password) => {
        // Use a separate axios instance for login without auth headers
        const loginApi = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        try {
            const response = await loginApi.post('/login/', { email, password });
            return response.data;
        } catch (error) {
            console.error('Login API error:', error.response?.data || error.message);
            throw error;
        }
    },

    register: async (username, password, email, role = 'customer', first_name = '', last_name = '', phone = '', address = '') => {
        // Use a separate axios instance for registration without auth headers
        const registerApi = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        try {
            const response = await registerApi.post('/register/', { username, password, email, role, first_name, last_name, phone, address });
            return response.data;
        } catch (error) {
            console.error('Register API error:', error.response?.data || error.message);
            throw error;
        }
    },
};

// Food API functions
export const foodAPI = {
    getAll: () => api.get('/foods/'),
    getById: (id) => api.get(`/foods/${id}/`),
    create: (data) => api.post('/foods/', data),
    update: (id, data) => api.put(`/foods/${id}/`, data),
    delete: (id) => api.delete(`/foods/${id}/`),
    uploadImage: (id, formData) => {
        // Use FormData for image upload
        const imageApi = axios.create({
            baseURL: API_URL,
            headers: {
                // Don't set Content-Type - let browser set it with boundary for multipart/form-data
            },
            withCredentials: true,
            xsrfCookieName: 'csrftoken',
            xsrfHeaderName: 'X-CSRFToken',
        });
        
        // Add JWT token to image upload request
        imageApi.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            }
        );
        
        return imageApi.post(`/foods/${id}/upload_image/`, formData);
    },
};

// Order API functions
export const orderAPI = {
    getAll: () => api.get('/orders/'),
    getById: (id) => api.get(`/orders/${id}/`),
    create: (data) => {
        // Transform cart items to backend format
        const orderData = {
            items: data.items.map(item => ({
                food: item.id,
                quantity: item.quantity
            })),
            delivery_address: data.delivery_address,
            status: 'pending'
        };
        return api.post('/orders/', orderData);
    },
    update: (id, data) => api.put(`/orders/${id}/`, data),
    delete: (id) => api.delete(`/orders/${id}/`),
    approve: (id) => api.post(`/orders/${id}/approve/`),
    reject: (id, reason) => api.post(`/orders/${id}/reject/`, { reason }),
    staffOrders: (status = null) => {
        const url = status ? `/orders/staff_orders/?status=${status}` : '/orders/staff_orders/';
        return api.get(url);
    },
};

// Inventory API functions
export const inventoryAPI = {
    getAll: () => api.get('/inventory/'),
    getById: (id) => api.get(`/inventory/${id}/`),
    create: (data) => api.post('/inventory/', data),
    update: (id, data) => api.put(`/inventory/${id}/`, data),
    delete: (id) => api.delete(`/inventory/${id}/`),
    updateQuantity: (id, quantity) => api.post(`/inventory/${id}/update_quantity/`, { quantity }),
};

// Notification API functions
export const notificationAPI = {
    getAll: () => api.get('/notifications/'),
    getUnreadCount: () => api.get('/notifications/unread_count/'),
    markAsRead: (id) => api.post(`/notifications/${id}/mark_as_read/`),
    markAllAsRead: () => api.post('/notifications/mark_all_as_read/'),
};

// Profile API functions
export const profileAPI = {
    getProfile: () => api.get('/profile/'),
    updateProfile: (data) => api.put('/profile/', data),
};

export default api;
