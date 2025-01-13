const express = require('express');
const router = express.Router();
const featureController = require('../controllers/featuresController');
const { validateNotification } = require('../helpers/validators');

// Routes
router.get('/notification', featureController.getNotifications); // Get notifications
router.get('/sunrise-sunset', featureController.getSunriseSunset); // Sunrise/sunset times
router.put('/notification/:id', validateNotification, featureController.updateNotification); // Update notification
router.delete('/notification/:id', featureController.deleteNotification); // Delete notification
router.get('/notification/:id', featureController.getByIDNotification); // Get notification

module.exports = router;
