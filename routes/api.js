const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController'); // Require API controller
const authController = require('../controllers/authenticationController'); // Require Auth controller

// API routes
router.get('/forecast', apiController.getForecast); // Get weather forecast
router.get('/location-weather', apiController.getLocationWeather); // Get weather by location

// DELETE route for API key
router.delete('/key/:id', authController.deleteApiKey); // Delete an API key

module.exports = router;