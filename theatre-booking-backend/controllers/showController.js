const showService = require('../services/showService');

async function getShows(req, res) {
    try {
        const shows = await showService.getAllShows();
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shows', error: error.message });
    }
}

async function getShowtimes(req, res) {
    try {
        const showtimes = await showService.getAllShowtimes();
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching showtimes', error: error.message });
    }
}

module.exports = {
    getShows,
    getShowtimes
};