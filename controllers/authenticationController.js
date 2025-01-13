exports.registerApiKey = (req, res) => {
    const { user, password, password_repeat } = req.body;

    if (!user && !password && !password_repeat) {
        return res.status(400).send({ message: 'All fields are required' });
    }

    if (password !== password_repeat) {
        return res.status(400).send({ message: 'Passwords do not match' });
    }

    const apiKey = Math.random().toString(36).substring(2, 15);

    return res.status(201).send({
        message: 'User registered successfully',
        apiKey,
    });
};


exports.validateApiKey = (req, res) => {
    const { apiKey } = req.body;
    if (apiKey === 'valid_key_example') {
        res.send({ message: 'API key is valid' });
    } else {
        res.status(400).send({ message: 'Invalid API key' });
    }
};
// Delete an API key
exports.deleteApiKey = (req, res) => {
    const { id } = req.params;
    res.send({ message: `API key ${id} deleted` });
};
