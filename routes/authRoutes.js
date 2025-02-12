const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ✅ Убедитесь, что путь правильный

router.post('/signup', authController.signup);       // ✅ Передаем правильную функцию
router.post('/login', authController.login);         // ✅ Проверяем правильность импорта
router.post('/verify-otp', authController.verifyOTP); // ✅ Проверка правильности для OTP

module.exports = router;
