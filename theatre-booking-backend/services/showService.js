const pool = require('../config/db');

async function getAllShows() {
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
  `);
    return rows;
}

async function getAllShowtimes() {
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
  `);
    return rows;
}

module.exports = {
    getAllShows,
    getAllShowtimes
};