const express = require('express');
const router = express.Router();
const authController = require('../controllers/authenticationController');
const { validateApiKey } = require('../helpers/validators');

// Routes
router.post('/register', authController.registerApiKey); // Register API key
router.post('/validate', validateApiKey, authController.validateApiKey); // Validate API key
router.delete('/key/:id', authController.deleteApiKey); // Delete API key

module.exports = router;
