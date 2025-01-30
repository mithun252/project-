import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        setError('');
    };

    const validateForm = () => {
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!formData.password) {
            setError('Password is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, formData);
            
            if (response.data.token && response.data.user) {
                // Store auth data
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Configure axios defaults for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
                
                // Redirect to home page
                history.push('/');
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.data?.errors) {
                setError(err.response.data.errors[0].msg);
            } else {
                setError('An error occurred during login. Please try again.');
            }
            
            // Clear password field on error
            setFormData(prev => ({
                ...prev,
                password: ''
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Login</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Logging in...' : 'Login'}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p>
                                    Don't have an account?{' '}
                                    <a href="/signup" className="text-primary">
                                        Sign up
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
