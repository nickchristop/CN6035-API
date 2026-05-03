const theatreService = require('../services/theatreService');

async function getTheatres(req, res) {
    try {
        const theatres = await theatreService.getAllTheatres();
        res.json(theatres);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching theatres', error: error.message });
    }
}

module.exports = {
    getTheatres
};