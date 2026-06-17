import axios from 'axios';

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor - add JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error
            const message = error.response.data.message || 'Bir hata oluştu';

            // Handle 401 Unauthorized
            if (error.response.status === 401) {
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
                window.location.href = '/admin';
            }

            return Promise.reject(new Error(message));
        } else if (error.request) {
            // Request made but no response
            return Promise.reject(new Error('Sunucuya bağlanılamadı'));
        } else {
            // Something else happened
            return Promise.reject(error);
        }
    }
);

// ============ AUTH API ============
export const authAPI = {
    login: async (username, password, recaptchaToken) => {
        return await api.post('/auth/login', { username, password, recaptchaToken });
    },

    register: async (username, email, password) => {
        return await api.post('/auth/register', { username, email, password });
    },

    verify: async () => {
        return await api.get('/auth/verify');
    }
};

// ============ PRODUCTS API ============
export const productsAPI = {
    getAll: async (category = null) => {
        const params = category ? { category } : {};
        return await api.get('/products', { params });
    },

    getBySlug: async (slug) => {
        return await api.get(`/products/${slug}`);
    },

    create: async (formData) => {
        return await api.post('/products', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    update: async (id, formData) => {
        return await api.put(`/products/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    delete: async (id) => {
        return await api.delete(`/products/${id}`);
    }
};

// ============ CONTACT API ============
export const contactAPI = {
    submit: async (formData) => {
        return await api.post('/contact', formData);
    },

    getAll: async (status = null) => {
        const params = status ? { status } : {};
        return await api.get('/contact', { params });
    },

    getById: async (id) => {
        return await api.get(`/contact/${id}`);
    },

    updateStatus: async (id, status) => {
        return await api.patch(`/contact/${id}/status`, { status });
    },

    delete: async (id) => {
        return await api.delete(`/contact/${id}`);
    }
};

export default api;
