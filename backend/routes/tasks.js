// CRUD задачи
const express = require('express');
const pool = require('../db/pool');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// python service
const axios = require('axios');

// для всех маршрутов требование авторизации
router.use(authenticateToken);

// GET /api/tasks - получить все задачи пользователя
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, description, status, priority, category, created_at, ended_at
            FROM tasks WHERE user_id = $1
            ORDER BY created_at DESC`,
            [req.user.userId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка при получении задач'});
    }
});

router.post('/', async (req, res) => {
    const {title, description, ended_at} = req.body;

    if(!title) {
        return res.status(400).json({error: 'Обязательно название задачи'});
    }

    try {
        // python service, отправляет текст для анализа
        const fullText =  `${title} ${description || ''}`;
        let priority = 'medium';
        let category = 'other';

        try {
            const analysis = await axios.post('http://localhost:5001/analyze', {
                text: fullText
            });
            priority = analysis.data.priority;
            category = analysis.data.category;
            console.log(`Анализ ${priority} / ${category}`);
        } catch (pythonErr) {
            console.error('Python сервис недоступен, использовать значения по умолчанию');
        }

        // будет считывать с тела запроса по нужные индексы, подставлять их относительно друг друга, возвращая все данные
        const result = await pool.query(
            `INSERT INTO tasks (user_id, title, description, ended_at, status, priority, category)
            VALUES ($1, $2, $3, $4, 'new', $5, $6)
            RETURNING *`, 
            [req.user.userId, title, description, ended_at || null, priority, category]
        );

        res.status(201).json(result.rows[0])

    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка создания задачи'});
    }
});

// PUT /api/tasks/:id - обновляет задачи, берет какую-то по ид
router.put('/:id', async (req,res) => {
    const {id} = req.params;
    const {status} = req.body;

    const validStatuses = ['new', 'in_progress', 'done'];
    if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({error: 'Неверный статус'});
    }

    try {
        const result = await pool.query(
            `UPDATE tasks
            SET status = $1
            WHERE id = $2 AND user_id = $3
            RETURNING *`,
            [status, id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Задача не найдена'});
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка обновления задачи'});
    }
});

// DELETE /api/tasks/:id - удаляет задачу по ид также
router.delete('/:id', async(req, res) => {
    const {id} = req.params;

    try {
        const result = await pool.query(
            `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({error: 'Задача не найдена'});
        }

        res.json({message: 'Задача удалена', id: parseInt(id)});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: 'Ошибка удаления задачи'});
    }
});

module.exports = router;