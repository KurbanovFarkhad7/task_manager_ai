// защищает маршруты, принимает запрос, проверяет, отправляет ответ на приложение
// в частности, токен JWT проверяет

const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']; // получение http заголовка
    // короткое замыкание для защиты от null. [1] - берет второй элемент, сам токен 
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({error: 'Токен отсутствует'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({error: 'Недействительный токен'});
    }
}

module.exports = authenticateToken;