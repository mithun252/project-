import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear errors when user starts typing
        setError('');
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }
        if (!/^[0-9]{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, formData);
            setSuccess('Account created successfully! Redirecting to login...');
            
            // Clear form
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: ''
            });

            // Wait for 2 seconds before redirecting to show success message
            setTimeout(() => {
                history.push('/login');
            }, 2000);

        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.data?.errors) {
                setError(err.response.data.errors[0].msg);
            } else {
                setError('An error occurred during signup. Please try again.');
            }
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
                            <h2 className="text-center mb-4">Sign Up</h2>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="alert alert-success" role="alert">
                                    {success}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
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
                                        minLength="6"
                                    />
                                    <small className="text-muted">
                                        Password must be at least 6 characters long
                                    </small>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{10}"
                                        placeholder="10-digit phone number"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Sign Up'}
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p>
                                    Already have an account?{' '}
                                    <a href="/login" className="text-primary">
                                        Login
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

export default Signup;
