// зависимости
const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
require('dotenv').config();

const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// обязательная фукция, которые дает серверу читать порты и запускаться в браузере
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));

app.use('/api/tasks', require('./routes/tasks'));