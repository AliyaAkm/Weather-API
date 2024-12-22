const validateNotification = (req, res, next) => {
    const { title, message } = req.body;
    if (!title || !message) {
        return res.status(400).send({ message: 'Missing required fields: title or message' });
    }
    next();
};

const validateApiKey = (req, res, next) => {
    const { apiKey } = req.body;
    if (!apiKey) {
        return res.status(400).send({ message: 'Missing API key' });
    }
    next();
};

module.exports = { validateNotification, validateApiKey };
