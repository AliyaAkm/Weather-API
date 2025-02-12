const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const featuresController = require('../controllers/featuresController');

// API Routes
router.get('/forecast', apiController.getForecast);
router.get('/location-weather', apiController.getLocationWeather);
router.get('/sunrise-sunset', featuresController.getSunriseSunset);

module.exports = router;
