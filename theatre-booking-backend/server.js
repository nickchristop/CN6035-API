const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const pool = require('./config/db');

const theatreRoutes = require('./routes/theatreRoutes');
const showRoutes = require('./routes/showRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req, res) => {
    res.json({ message: 'Theatre booking backend is running' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/theatres', theatreRoutes);
app.use('/shows', showRoutes);
app.use('/reservations', reservationRoutes);

app.get('/db-test', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DATABASE() AS db');
        res.json({
            status: 'db connected',
            database: rows[0].db
        });
    } catch (error) {
        res.status(500).json({
            status: 'db error',
            error: error.message
        });
    }
});

app.listen(PORT, '0.0.0.0',() => {
    console.log(`Server running on http://localhost:${PORT}`);
});



