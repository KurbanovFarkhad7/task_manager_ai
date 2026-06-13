const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool'); // тут внимательнее, на 2 папки переходим ..
const router = express.Router();
// jwt авторизация
const jwt = require('jsonwebtoken');
require('dotenv').config();


// для браузера будет POST /api/auth/register
router.post('/register', async (req, res) => {
    // в параметр req будет попадать инфа для регистрации, читаем введенную инфу
    const {email, password, last_name, first_name, middle_name} = req.body; 

    // Валидация, параметр res вернет ошибку при проверки
    if (!email || !password || !last_name || !first_name) {
        return res.status(400).json({error: 'Обязательные поля!'})
    }

    if (password.length < 6) {
        return res.status(400).json({error: 'Пароль минимум 6 символов'})
    }

    try {
        const existingUser = await pool.query(
            // $1 вместо '${email}', чтобы в инъекции не взяло значение DROP TABLE и не поломало БД
            `SELECT id FROM users WHERE email = $1`,
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({error:'Пользователь с таким email уже существует'})
        }

        // хеширование пароля, просто берем введеный пароль, прогоняем алгоритмом, потом в бд закинем готовый
        const hashTimes = 10; // сколько раз будет алгоритм
        const password_hashed = await bcrypt.hash(password, hashTimes);
        
        // создать пользователя
        const profile_filled = await pool.query(
            `INSERT INTO users (email, password_hash, last_name, first_name, middle_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, email, last_name, first_name, created_at`,
            [email, password_hashed, last_name, first_name, middle_name || null] //middle_name - может быть Null
        );
        const newUser = profile_filled.rows[0]; // когда все ОК, вернем строку запроса с введенными данными

        res.status(201).json({
            message: 'Пользователь зарегистрирован',
            user: newUser
        });

    // если что-то не то, ловим ошибку и передаем ее номер
    } catch (err) {
        console.error('Ошибка регистрации: ', err)
        res.status(500).json({error: 'Внутренняя ошибка сервера'});
    }

});

// JWT авторизация, POST /api/auth/login
router.post('/login', async(req, res) => {
    const {email, password} = req.body;

    // проверка, принимает данные от роута выше
    if (!email || !password) {
        return res.status(400).json({error: 'Обязательно Email и пароль'})
    }

    // заходим в бд, ищем запись
    try {
        const profile_filled = await pool.query(
            `Select id, email, password_hash, last_name, first_name
            FROM users WHERE email = $1`,
            [email]
        );

        //  если ничего не нашлось
        if (profile_filled.rows.length === 0) {
            return res.status(401).json({error: 'Неверный пароль или email'});
        }

        // при успех передаем строку в константу
        const user = profile_filled.rows[0];

        // сравнить введенный пароль пользователем (password) с хешем в БД
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({error: 'Неверный пароль или email'});
        }

        // создание JWT токена
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                first_name: user.first_name
            },
            process.env.JWT_SECRET,
            {expiresIn: '24h'}
        );

        // отправить токен и данные пользователя (без пароля, при успехе)
        res.json({
            message: 'Успешный вход',
            token,
            user: {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
        });
    } catch (err) {
        console.error('Ошибка входа', err);
        res.status(500).json({error: 'внутренняя ошибка сервера'});
    }
});

module.exports = router;