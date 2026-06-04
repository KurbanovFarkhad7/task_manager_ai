// зависимости
const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// обязательная фукция, которые дает серверу читать порты и запускаться в браузере
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Тестовый маршрут
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

app.get('/api/test-db', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});