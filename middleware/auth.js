const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        req.user = { id: user.id, name: user.name, email: user.email }; // Pass user details to req
        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = auth;
