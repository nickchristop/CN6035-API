const reservationService = require('../services/reservationService');

async function getUserReservations(req, res) {
    try {
        const userId = req.user.user_id;
        const reservations = await reservationService.getReservationsByUserId(userId);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reservations', error: error.message });
    }
}

async function createReservation(req, res) {
    try {
        const userId = req.user.user_id;
        const { showtime_id, seats_reserved } = req.body;

        if (!showtime_id || !seats_reserved) {
            return res.status(400).json({
                message: 'showtime_id and seats_reserved are required'
            });
        }

        const reservation = await reservationService.createReservation(
            userId,
            showtime_id,
            seats_reserved
        );

        res.status(201).json({
            message: 'Reservation created successfully',
            reservation
        });
    } catch (error) {
        if (
            error.message === 'Showtime not found' ||
            error.message === 'Not enough available seats'
        ) {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({ message: 'Error creating reservation', error: error.message });
    }
}

async function cancelReservation(req, res) {
    try {
        const userId = req.user.user_id;
        const reservationId = parseInt(req.params.id, 10);

        if (!reservationId) {
            return res.status(400).json({ message: 'Valid reservation id is required' });
        }

        const result = await reservationService.cancelReservation(userId, reservationId);

        res.json({
            message: 'Reservation cancelled successfully',
            reservation: result
        });
    } catch (error) {
        if (
            error.message === 'Reservation not found' ||
            error.message === 'Reservation is not active'
        ) {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === 'Unauthorized cancellation attempt') {
            return res.status(403).json({ message: error.message });
        }

        res.status(500).json({ message: 'Error cancelling reservation', error: error.message });
    }
}

async function updateReservation(req, res) {
    try {
        const userId = req.user.user_id;
        const reservationId = parseInt(req.params.id, 10);
        const { seats_reserved } = req.body;

        if (!reservationId) {
            return res.status(400).json({ message: 'Valid reservation id is required' });
        }

        if (!seats_reserved) {
            return res.status(400).json({ message: 'seats_reserved is required' });
        }

        const result = await reservationService.updateReservation(
            userId,
            reservationId,
            seats_reserved
        );

        res.json({
            message: 'Reservation updated successfully',
            reservation: result
        });
    } catch (error) {
        if (
            error.message === 'Reservation not found' ||
            error.message === 'Reservation is not active' ||
            error.message === 'Invalid seats_reserved value' ||
            error.message === 'Not enough available seats' ||
            error.message === 'Showtime not found'
        ) {
            return res.status(400).json({ message: error.message });
        }

        if (error.message === 'Unauthorized update attempt') {
            return res.status(403).json({ message: error.message });
        }

        res.status(500).json({ message: 'Error updating reservation', error: error.message });
    }
}

module.exports = {
    getUserReservations,
    createReservation,
    cancelReservation,
    updateReservation
};