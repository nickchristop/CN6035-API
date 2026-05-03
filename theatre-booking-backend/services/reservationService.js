const pool = require('../config/db');

async function getReservationsByUserId(userId) {
    const [rows] = await pool.query(`
    SELECT
      r.reservation_id,
      r.seats_reserved,
      r.reservation_status,
      r.created_at,
      u.user_id,
      u.name AS user_name,
      u.email,
      st.showtime_id,
      st.show_date,
      st.show_time,
      s.title AS show_title,
      t.name AS theatre_name
    FROM reservations r
    JOIN users u ON r.user_id = u.user_id
    JOIN showtimes st ON r.showtime_id = st.showtime_id
    JOIN shows s ON st.show_id = s.show_id
    JOIN theatres t ON s.theatre_id = t.theatre_id
    WHERE r.user_id = ?
  `, [userId]);

    return rows;
}

async function createReservation(userId, showtimeId, seatsReserved) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [showtimeRows] = await connection.query(
            'SELECT available_seats FROM showtimes WHERE showtime_id = ? FOR UPDATE',
            [showtimeId]
        );

        if (showtimeRows.length === 0) {
            throw new Error('Showtime not found');
        }

        const availableSeats = showtimeRows[0].available_seats;

        if (availableSeats < seatsReserved) {
            throw new Error('Not enough available seats');
        }

        const [reservationResult] = await connection.query(
            `INSERT INTO reservations (user_id, showtime_id, seats_reserved, reservation_status)
       VALUES (?, ?, ?, 'active')`,
            [userId, showtimeId, seatsReserved]
        );

        await connection.query(
            'UPDATE showtimes SET available_seats = available_seats - ? WHERE showtime_id = ?',
            [seatsReserved, showtimeId]
        );

        await connection.commit();

        return {
            reservation_id: reservationResult.insertId,
            user_id: userId,
            showtime_id: showtimeId,
            seats_reserved: seatsReserved,
            reservation_status: 'active'
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function cancelReservation(userId, reservationId) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [reservationRows] = await connection.query(
            `SELECT reservation_id, user_id, showtime_id, seats_reserved, reservation_status
       FROM reservations
       WHERE reservation_id = ? FOR UPDATE`,
            [reservationId]
        );

        if (reservationRows.length === 0) {
            throw new Error('Reservation not found');
        }

        const reservation = reservationRows[0];

        if (reservation.user_id !== userId) {
            throw new Error('Unauthorized cancellation attempt');
        }

        if (reservation.reservation_status !== 'active') {
            throw new Error('Reservation is not active');
        }

        await connection.query(
            `UPDATE reservations
       SET reservation_status = 'cancelled'
       WHERE reservation_id = ?`,
            [reservationId]
        );

        await connection.query(
            `UPDATE showtimes
       SET available_seats = available_seats + ?
       WHERE showtime_id = ?`,
            [reservation.seats_reserved, reservation.showtime_id]
        );

        await connection.commit();

        return {
            reservation_id: reservation.reservation_id,
            reservation_status: 'cancelled',
            restored_seats: reservation.seats_reserved,
            showtime_id: reservation.showtime_id
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

async function updateReservation(userId, reservationId, newSeatsReserved) {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [reservationRows] = await connection.query(
            `SELECT reservation_id, user_id, showtime_id, seats_reserved, reservation_status
       FROM reservations
       WHERE reservation_id = ? FOR UPDATE`,
            [reservationId]
        );

        if (reservationRows.length === 0) {
            throw new Error('Reservation not found');
        }

        const reservation = reservationRows[0];

        if (reservation.user_id !== userId) {
            throw new Error('Unauthorized update attempt');
        }

        if (reservation.reservation_status !== 'active') {
            throw new Error('Reservation is not active');
        }

        if (newSeatsReserved <= 0) {
            throw new Error('Invalid seats_reserved value');
        }

        const currentSeatsReserved = reservation.seats_reserved;
        const seatDifference = newSeatsReserved - currentSeatsReserved;

        if (seatDifference > 0) {
            const [showtimeRows] = await connection.query(
                `SELECT available_seats
         FROM showtimes
         WHERE showtime_id = ? FOR UPDATE`,
                [reservation.showtime_id]
            );

            if (showtimeRows.length === 0) {
                throw new Error('Showtime not found');
            }

            const availableSeats = showtimeRows[0].available_seats;

            if (availableSeats < seatDifference) {
                throw new Error('Not enough available seats');
            }

            await connection.query(
                `UPDATE showtimes
         SET available_seats = available_seats - ?
         WHERE showtime_id = ?`,
                [seatDifference, reservation.showtime_id]
            );
        } else if (seatDifference < 0) {
            await connection.query(
                `UPDATE showtimes
         SET available_seats = available_seats + ?
         WHERE showtime_id = ?`,
                [Math.abs(seatDifference), reservation.showtime_id]
            );
        }

        await connection.query(
            `UPDATE reservations
       SET seats_reserved = ?
       WHERE reservation_id = ?`,
            [newSeatsReserved, reservationId]
        );

        await connection.commit();

        return {
            reservation_id: reservationId,
            user_id: userId,
            showtime_id: reservation.showtime_id,
            previous_seats_reserved: currentSeatsReserved,
            updated_seats_reserved: newSeatsReserved,
            reservation_status: reservation.reservation_status
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}


module.exports = {
    getReservationsByUserId,
    createReservation,
    cancelReservation,
    updateReservation
};