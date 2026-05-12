const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');

router.get('/', showController.getShows);
router.get('/showtimes', showController.getShowtimes);
router.get('/:id', showController.getShowById);

module.exports = router;