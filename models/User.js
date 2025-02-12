const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, default: null },               // ✅ Добавлено поле для хранения OTP
    otpExpires: { type: Date, default: null }           // ✅ Добавлено поле для срока действия OTP
});

module.exports = mongoose.model('User', userSchema);
