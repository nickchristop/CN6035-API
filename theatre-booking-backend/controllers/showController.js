const showService = require('../services/showService');

async function getShows(req, res) {
    try {
        const { title, theatre_id, age_rating } = req.query;
        const shows = await showService.getAllShows({ title, theatre_id, age_rating });
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shows', error: error.message });
    }
}

async function getShowById(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (!id) {
            return res.status(400).json({ message: 'Valid show id is required' });
        }
        const show = await showService.getShowById(id);
        if (!show) {
            return res.status(404).json({ message: 'Show not found' });
        }
        res.json(show);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching show', error: error.message });
    }
}

async function getShowtimes(req, res) {
    try {
        const { show_id, date, available_only } = req.query;
        const showtimes = await showService.getAllShowtimes({ show_id, date, available_only });
        res.json(showtimes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching showtimes', error: error.message });
    }
}

module.exports = {
    getShows,
    getShowById,
    getShowtimes
};