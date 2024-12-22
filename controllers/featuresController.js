exports.getNotifications = (req, res) => {
    res.send({ message: 'Weather notifications sent' });
};

exports.getSunriseSunset = (req, res) => {
    const { location } = req.query;
    res.send({
        location: location || 'unknown',
        sunrise: '6:00 AM',
        sunset: '6:00 PM',
    });
};
// Update a weather notification
exports.updateNotification = (req, res) => {
    const { id } = req.params;
    const { title, message } = req.body;
    if (!id || id === "0") {
        return res.status(400).send({ message: 'Resource not found' });
    }
    res.send({ message: `Notification ${id} updated`, updatedData: { title, message } });
};

// Delete a weather notification
exports.deleteNotification = (req, res) => {
    const { id } = req.params;
    res.send({ message: `Notification ${id} deleted` });
};

exports.getByIDNotification = (req, res) => {
    const { id } = req.params;
    if (!id || id === "0") {
        return res.status(400).send({ message: 'Resource not found' });
    }
    var title="!Служба спасения"
    var message="19.12.24 Astana k. katty burkasin, 20 m/s deiin zheldin uiytkuy, koktaigak. G. Astana silnaya metel, usileniye vetra s poryvami do 20 m/s, gololed."
    res.send({ message: `notification # ${id} `, retrieved_data: { title, message } });
};