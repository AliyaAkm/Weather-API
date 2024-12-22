const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Import routes
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/authentication');
const featureRoutes = require('./routes/features');

// Use routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
app.use('/features', featureRoutes);

// 404 Error for undefined routes
app.use((req, res) => {
    res.status(404).send({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Internal Server Error' });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
