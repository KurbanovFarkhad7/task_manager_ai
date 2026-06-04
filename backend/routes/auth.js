const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/pool'); // тут внимательнее, на 2 папки переходим ..
const router = express.Router();


// для браузера будет POST /api/auth/register
router.post('/register', async (req, res) => {
    // в параметр req будет попадать инфа для регистрации
    const {email, password_hash, last_name, first_name, middle_name} = req.body; 

    // Валидация, параметр res вернет ошибку при проверки
    if (!email || !password_hash || !last_name || !first_name) {
        return res.status(400).json({error: 'Обязательные поля!'})
    }

    if (password_hash.length < 6) {
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
        const password_hashed = await bcrypt.hash(password_hash, hashTimes);
        
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

module.exports = router;