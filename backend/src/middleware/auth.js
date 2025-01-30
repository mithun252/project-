const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = { id: decoded.userId }; 
            next();
        } catch (error) {
            res.status(401).json({ error: 'Token is invalid or expired' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = auth;
