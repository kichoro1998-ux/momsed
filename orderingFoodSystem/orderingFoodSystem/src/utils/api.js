import axios from 'axios';

const normalizeBaseUrl = (url, { stripApi = false } = {}) => {
    const trimmed = (url || "").trim().replace(/\.+$/, "").replace(/\/+$/, "");
    if (!trimmed) return "";
    if (stripApi && /\/api$/i.test(trimmed)) {
        return trimmed.replace(/\/api$/i, "");
    }
    return trimmed;
};

const rawApiUrl = import.meta.env.VITE_API_URL || "https://momsed-1-vkv7.onrender.com";
const apiBaseUrl = normalizeBaseUrl(rawApiUrl, { stripApi: true });
const mediaBaseUrl = normalizeBaseUrl(import.meta.env.VITE_MEDIA_URL || apiBaseUrl);
const API_URL = `${apiBaseUrl}/api`;
const MEDIA_URL = mediaBaseUrl;

console.log('API Configuration:', { API_URL, MEDIA_URL });

/**
 * Gets the full URL for images.
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return '/foodpic.jpg';
    }
    
    // If already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Prepend the media URL for production
    if (imagePath.startsWith('/media/')) {
        return `${MEDIA_URL}${imagePath}`;
    }
    
    // If path starts with /, prepend media URL
    if (imagePath.startsWith('/')) {
        return `${MEDIA_URL}${imagePath}`;
    }
    
    // Otherwise, prepend /media/ and media URL
    return `${MEDIA_URL}/media/${imagePath}`;
};

/**
 * Gets the full URL for food item images.
 */
export const getFoodImageUrl = (imagePath) => {
    if (!imagePath) {
        return '/foodpic.jpg';
    }
    
    // If already a full URL, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Ensure path starts with /
    if (!imagePath.startsWith('/')) {
        imagePath = '/' + imagePath;
    }
    
    // Ensure path starts with /media/ and prepend media URL
    if (!imagePath.startsWith('/media/')) {
        imagePath = '/media/' + imagePath.replace(/^\//, '');
    }
    
    return `${MEDIA_URL}${imagePath}`;
};

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
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
            withCredentials: false,
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
