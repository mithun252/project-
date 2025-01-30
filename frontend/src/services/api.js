import axios from 'axios';
import { API_BASE_URL, endpoints } from '../config/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Get all ads
export const getAds = async () => {
    try {
        console.log('Fetching all ads from:', `${API_BASE_URL}${endpoints.ads}`);
        const response = await api.get(endpoints.ads);
        console.log('Received ads:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching ads:', error.response || error);
        throw error;
    }
};

// Get ads by category
export const getAdsByCategory = async (category) => {
    try {
        console.log('Fetching ads for category:', category);
        const response = await api.get(`${endpoints.ads}/category/${encodeURIComponent(category)}`);
        console.log('Received category ads:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching ads by category:', error.response || error);
        throw error;
    }
};

// Get ad by id
export const getAdById = (id) => api.get(`${endpoints.ads}/${id}`);

// Create new ad
export const createAd = async (data) => {
    try {
        // Validate data before sending
        if (!data.title || !data.price || !data.category || !data.image) {
            throw new Error('Missing required fields');
        }

        // Ensure price is a number
        const adData = {
            ...data,
            price: Number(data.price)
        };

        console.log('Creating new ad:', { ...adData, image: 'Image data truncated...' });
        const response = await api.post(endpoints.ads, adData);
        console.log('Ad created successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating ad:', error.response?.data || error.message);
        throw error;
    }
};

// Login
export const login = (credentials) => api.post(`${endpoints.user}/signin`, credentials);

// Register
export const register = (userData) => api.post(`${endpoints.user}/signup`, userData);

// Add response interceptor for error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server Error:', {
                data: error.response.data,
                status: error.response.status,
                headers: error.response.headers
            });
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Network Error:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
