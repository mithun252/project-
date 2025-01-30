const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation middleware
const validateSignup = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please enter a valid 10-digit phone number')
];

const validateLogin = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
];

// Sign up route
router.post('/signup', validateSignup, async (req, res) => {
    console.log('Received signup request:', {
        ...req.body,
        password: '[REDACTED]' // Don't log the actual password
    });

    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ 
                error: errors.array()[0].msg,
                errors: errors.array() 
            });
        }

        const { name, email, password, phone } = req.body;

        // Check if user already exists
        console.log('Checking for existing user with email:', email.toLowerCase());
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
            console.log('User already exists with email:', email);
            return res.status(400).json({ error: 'Email is already registered' });
        }

        // Create new user
        console.log('Creating new user with email:', email);
        const user = new User({
            name,
            email: email.toLowerCase(),
            password,
            phone
        });

        // Save user to database
        console.log('Attempting to save user to database...');
        await user.save();
        console.log('User saved successfully with ID:', user._id);

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        // Send success response without sensitive data
        const response = {
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        };
        console.log('Sending success response:', {
            ...response,
            token: '[REDACTED]' // Don't log the actual token
        });

        res.status(201).json(response);
    } catch (error) {
        console.error('Signup error:', {
            message: error.message,
            stack: error.stack,
            code: error.code,
            name: error.name
        });
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(400).json({ 
                error: 'This email is already registered. Please use a different email.' 
            });
        }
        
        res.status(500).json({ 
            error: 'Error creating user. Please try again.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Login route
router.post('/login', validateLogin, async (req, res) => {
    console.log('Received login request for email:', req.body.email);

    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Login validation errors:', errors.array());
            return res.status(400).json({ 
                error: errors.array()[0].msg,
                errors: errors.array() 
            });
        }

        const { email, password } = req.body;

        // Find user
        console.log('Looking up user with email:', email.toLowerCase());
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        console.log('Checking password for user:', user._id);
        const isMatch = await user.comparePassword(password);
        
        if (!isMatch) {
            console.log('Invalid password for user:', user._id);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        const response = {
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        };

        console.log('Login successful for user:', user._id);
        res.json(response);
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Error logging in. Please try again.' });
    }
});

// Get user profile route (protected)
router.get('/profile', auth, async (req, res) => {
    try {
        console.log('Fetching profile for user:', req.user._id);
        const user = await User.findById(req.user._id).select('-password');
        
        if (!user) {
            console.log('User not found:', req.user._id);
            return res.status(404).json({ error: 'User not found' });
        }
        
        console.log('Profile fetched successfully for user:', req.user._id);
        res.json({ user });
    } catch (error) {
        console.error('Profile fetch error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Error fetching profile' });
    }
});

// Logout route (protected)
router.post('/logout', auth, async (req, res) => {
    try {
        console.log('Logging out user:', req.user._id);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', {
            message: error.message,
            stack: error.stack
        });
        res.status(500).json({ error: 'Error logging out' });
    }
});

module.exports = router;
