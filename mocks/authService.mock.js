const sinon = require('sinon');

const mockAuthService = {
    login: sinon.stub(),
    verifyOTP: sinon.stub(),
};

mockAuthService.login.callsFake((email, password) => {
    if (email === 'aakm25305@gmail.com' && password === '1234') {
        return Promise.resolve({ message: 'OTP отправлен на email' });
    }
    return Promise.reject({ message: 'Неверный email или пароль' });
});

mockAuthService.verifyOTP.callsFake((email, otp) => {
    if (otp === '0000') {
        return Promise.resolve({ message: 'Вход выполнен успешно', token: 'mock-token' });
    }
    return Promise.reject({ message: 'Неверный OTP' });
});

module.exports = mockAuthService;
