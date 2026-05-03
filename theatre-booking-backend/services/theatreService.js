const pool = require('../config/db');

async function getAllTheatres() {
    const [rows] = await pool.query('SELECT * FROM theatres');
    return rows;
}

module.exports = {
    getAllTheatres
};