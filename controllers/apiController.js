exports.getForecast = (req, res) => {
    res.send({ message: 'Weather forecast data' });
};

exports.getLocationWeather = (req, res) => {
    const { location } = req.query;
    res.send({ message: `Weather data for location: ${location || 'unknown'}` });
};
