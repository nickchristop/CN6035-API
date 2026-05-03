const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authService = require('../services/authService');
require('dotenv').config();

async function register(req, res) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const existingUser = await authService.findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const user = await authService.registerUser(name, email, password);

        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        res.status(500).json({ message: 'Register error', error: error.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await authService.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login error', error: error.message });
    }
}

module.exports = {
    register,
    login
};