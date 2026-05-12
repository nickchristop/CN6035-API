const pool = require('../config/db');

async function getAllShows(filters = {}) {
    const { title, theatre_id, age_rating } = filters;

    const conditions = [];
    const params = [];

    if (title) {
        conditions.push('s.title LIKE ?');
        params.push(`%${title}%`);
    }
    if (theatre_id) {
        conditions.push('s.theatre_id = ?');
        params.push(theatre_id);
    }
    if (age_rating) {
        conditions.push('s.age_rating = ?');
        params.push(age_rating);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(`
        SELECT
          s.show_id,
          s.title,
          s.description,
          s.duration,
          s.age_rating,
          s.theatre_id,
          t.name AS theatre_name,
          t.location AS theatre_location
        FROM shows s
        JOIN theatres t ON s.theatre_id = t.theatre_id
        ${where}
        ORDER BY s.title
    `, params);

    return rows;
}

async function getShowById(id) {
    const [showRows] = await pool.query(`
        SELECT
          s.show_id,
          s.title,
          s.description,
          s.duration,
          s.age_rating,
          s.theatre_id,
          t.name AS theatre_name,
          t.location AS theatre_location
        FROM shows s
        JOIN theatres t ON s.theatre_id = t.theatre_id
        WHERE s.show_id = ?
    `, [id]);

    if (showRows.length === 0) {
        return null;
    }

    const [showtimeRows] = await pool.query(`
        SELECT
          showtime_id,
          show_date,
          show_time,
          hall_name,
          price,
          total_seats,
          available_seats
        FROM showtimes
        WHERE show_id = ?
        ORDER BY show_date, show_time
    `, [id]);

    return { ...showRows[0], showtimes: showtimeRows };
}

async function getAllShowtimes(filters = {}) {
    const { show_id, date, available_only } = filters;

    const conditions = [];
    const params = [];

    if (show_id) {
        conditions.push('st.show_id = ?');
        params.push(show_id);
    }
    if (date) {
        conditions.push('st.show_date = ?');
        params.push(date);
    }
    if (available_only === 'true') {
        conditions.push('st.available_seats > 0');
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const [rows] = await pool.query(`
        SELECT
          st.showtime_id,
          st.show_date,
          st.show_time,
          st.hall_name,
          st.price,
          st.total_seats,
          st.available_seats,
          st.show_id,
          s.title AS show_title
        FROM showtimes st
        JOIN shows s ON st.show_id = s.show_id
        ${where}
        ORDER BY st.show_date, st.show_time
    `, params);

    return rows;
}

module.exports = {
    getAllShows,
    getShowById,
    getAllShowtimes
};