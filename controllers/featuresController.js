exports.getNotifications = (req, res) => {
    res.send({ message: 'Weather notifications sent' });
};

exports.getSunriseSunset = (req, res) => {
    const { location } = req.query;

    if (!location) {
        return res.status(400).json({ message: 'Location is required' });
    }

    res.json({
        location,
        sunrise: '6:00 AM',
        sunset: '6:00 PM',
    });
};

exports.updateNotification = (req, res) => {
    const { id } = req.params;
    const { title, message } = req.body;

    if (!id || id === "0") {
        return res.status(400).json({ message: 'Resource not found' });
    }

    res.json({ message: `Notification ${id} updated`, updatedData: { title, message } });
};

exports.deleteNotification = (req, res) => {
    const { id } = req.params;
    res.json({ message: `Notification ${id} deleted` });
};

exports.getByIDNotification = (req, res) => {
    const { id } = req.params;
    if (!id || id === "0") {
        return res.status(400).json({ message: 'Resource not found' });
    }

    res.json({
        message: `Notification #${id}`,
        retrieved_data: {
            title: "Weather Alert",
            message: "Severe storm warning in your area. Stay safe!"
        }
    });
};
