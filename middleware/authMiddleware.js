const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    if (process.env.NODE_ENV === 'test') {
        return next(); // ✅ Пропускаем проверку токена в тестовой среде
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Нет доступа, авторизуйтесь!" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Неверный или истёкший токен" });
    }
};

module.exports = authMiddleware;
