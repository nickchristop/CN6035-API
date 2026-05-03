const pool = require('../config/db');
const bcrypt = require('bcryptjs');

async function registerUser(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
    );

    return {
        user_id: result.insertId,
        name,
        email
    };
}

async function findUserByEmail(email) {
    const [rows] = await pool.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    return rows[0];
}

module.exports = {
    registerUser,
    findUserByEmail
};
