console.log("🔹 auth.js загружен!");

// Функция запроса с авторизацией
const fetchWithAuth = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.log("⚠ Нет accessToken, пытаемся обновить...");
        await refreshToken();
        accessToken = localStorage.getItem('accessToken');
    }

    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${accessToken}`;
    headers['Content-Type'] = 'application/json';

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        console.log("🔄 Access token expired, refreshing...");
        await refreshToken();
        accessToken = localStorage.getItem('accessToken');
        headers['Authorization'] = `Bearer ${accessToken}`;
        return fetch(url, { ...options, headers });
    }

    return response;
};

// Функция для обновления accessToken через refreshToken
const refreshToken = async () => {
    const token = localStorage.getItem('refreshToken');

    if (!token) {
        console.log("❌ No refresh token, logging out...");
        logout();
        return;
    }

    const response = await fetch('/auth/refreshToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (response.ok) {
        console.log("✅ Новый access token получен.");
        localStorage.setItem('accessToken', data.accessToken);
    } else {
        console.error("❌ Ошибка обновления accessToken, выполняем logout.");
        logout();
    }
};

// Функция выхода из системы
const logout = async () => {
    const username = localStorage.getItem('username');
    console.log(`🚪 Logout: ${username}`);

    await fetch('/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');

    window.location.href = "/login";
};

// Делаем функции доступными глобально
window.fetchWithAuth = fetchWithAuth;
window.refreshToken = refreshToken;
window.logout = logout;

console.log("✅ fetchWithAuth, refreshToken и logout добавлены в window!");
