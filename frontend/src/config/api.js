export const API_BASE_URL = 'http://localhost:9000/api';

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const setAuthData = (data) => {
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
    }
};

export const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with a status code outside the 2xx range
        const errorMessage = error.response.data.error || 'An error occurred';
        if (error.response.status === 401) {
            // Clear auth data if unauthorized
            clearAuthData();
        }
        return errorMessage;
    }
    if (error.request) {
        // Request was made but no response received
        return 'No response from server';
    }
    // Something else happened while setting up the request
    return 'Error setting up request';
};

export const endpoints = {
    // Auth endpoints
    login: '/auth/login',
    signup: '/auth/signup',
    profile: '/auth/profile',
    
    // Ad endpoints
    ads: '/ads',
    adById: (id) => `/ads/${id}`,
    adsByCategory: (category) => `/ads/category/${category}`,
    myAds: '/ads/user/my-ads',
    
    // User endpoints
    users: '/users',
    userById: (id) => `/users/${id}`
};
