const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const isTestEnv = process.env.NODE_ENV === 'test';

const app = express();

const featureRoutes = require('./routes/features'); // ✅ Подключаем маршруты
app.use('/features', featureRoutes);

const apiRoutes = require('./routes/api'); // ✅ Подключаем API маршруты
app.use('/api', apiRoutes);

// ✅ Логирование запросов (для отладки)
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ✅ Разрешаем CORS для фронтенда
app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// ✅ Парсим JSON-запросы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// ✅ Подключаем маршруты
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

// ✅ Обслуживаем статические файлы (фронтенд)
app.use(express.static(path.join(__dirname, 'front')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'index.html'));
});

// ✅ Страницы входа, регистрации и дашборда
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'signup.html'));
});


app.get('/dashboard', isTestEnv ? (req, res, next) => next() : authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, 'front', 'dashboard.html'));
});

// ✅ Обработка неизвестных маршрутов (404)
app.use((req, res) => {
    res.status(404).json({ message: "Маршрут не найден" });
});

// ✅ Экспортируем приложение для использования в тестах
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
if (process.env.NODE_ENV === 'test') {
    const mockAuthService = require('./mocks/authService.mock');

    app.post('/auth/login', (req, res) => {
        const { email, password } = req.body;
        mockAuthService.login(email, password)
            .then(response => res.json(response))
            .catch(err => res.status(400).json(err));
    });

    app.post('/auth/verify-otp', (req, res) => {
        const { email, otp } = req.body;
        mockAuthService.verifyOTP(email, otp)
            .then(response => res.json(response))
            .catch(err => res.status(400).json(err));
    });
} else {
    // ✅ Use real controller logic in production
    const authRoutes = require('./routes/authRoutes');
    app.use('/auth', authRoutes);
}


let server;

const startServer = () => {
    const PORT = process.env.PORT || 3001;
    server = app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
};

const closeServer = async () => {
    if (server && server.listening) {
        await new Promise((resolve) => server.close(resolve));
        console.log('✅ Server закрыт после тестов.');
    }
};


if (process.env.NODE_ENV !== 'test') {
    startServer();
}

module.exports = { app, startServer, closeServer };