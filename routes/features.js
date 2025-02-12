const express = require('express');
const router = express.Router();
const featuresController = require('../controllers/featuresController'); // Импорт контроллера

// Проверяем, что все методы существуют
if (!featuresController.getSunriseSunset) {
    console.error(" ERROR: getSunriseSunset is undefined in featuresController");
}

// Маршруты фич
router.get('/notification', featuresController.getNotifications);
router.get('/sunrise-sunset', featuresController.getSunriseSunset); // Sunrise/sunset times
router.put('/notification/:id', featuresController.updateNotification);
router.delete('/notification/:id', featuresController.deleteNotification);
router.get('/notification/:id', featuresController.getByIDNotification);

module.exports = router;
