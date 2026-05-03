const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/user', authMiddleware, reservationController.getUserReservations);
router.post('/', authMiddleware, reservationController.createReservation);
router.put('/:id', authMiddleware, reservationController.updateReservation);
router.delete('/:id', authMiddleware, reservationController.cancelReservation);

module.exports = router;