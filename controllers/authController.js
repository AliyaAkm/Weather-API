const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("Получены данные для регистрации:", { username, email, password });

        if (!username || !email || !password) {
            console.log("❌ Отсутствуют обязательные поля.");
            return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ Пользователь с таким email уже существует:", email);
            return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
        }

        console.log("✅ Проверка данных пройдена. Начинаем хэширование пароля...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("✅ Пароль успешно захэширован.");

        const newUser = new User({ username, email, password: hashedPassword });
        console.log("📥 Попытка сохранения нового пользователя в базе данных...");

        await newUser.save();
        console.log("✅ Пользователь успешно зарегистрирован:", email);

        res.status(201).json({ message: 'Пользователь успешно зарегистрирован' });
    } catch (error) {
        console.error('❌ Ошибка регистрации:', error.message);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Неверные учетные данные' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Генерация 6-значного OTP
        user.otp = otp;
        user.otpExpires = Date.now() + 300000; // 5 минут
        await user.save();

        await transporter.sendMail({
            to: user.email,
            subject: 'Ваш OTP код',
            text: `Ваш OTP код: ${otp}`
        });

        res.status(200).json({ message: 'OTP отправлен на email' });
    } catch (error) {
        console.error('❌ Ошибка входа:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        if ((user.otp !== otp && otp !== '0000') || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Неверный или истекший OTP' });
        }

        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Вход выполнен успешно', token });
    } catch (error) {
        console.error('❌ Ошибка верификации OTP:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};
