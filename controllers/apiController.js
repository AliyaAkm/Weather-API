const { weatherData } = require('../helpers/weatherData');

exports.getForecast = (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).send({ message: 'Location is required' });
  }

  const filteredData = weatherData.filter((data) => data.name.toLowerCase() === location.toLowerCase());

  if (filteredData.length === 0) {
    return res.status(404).send({ message: `No weather data found for ${location}` });
  }

  const avgTempMax = filteredData.reduce((sum, data) => sum + data.tempmax, 0) / filteredData.length;
  const avgTempMin = filteredData.reduce((sum, data) => sum + data.tempmin, 0) / filteredData.length;

  return res.send({
    location: location,
    averageTempMax: avgTempMax,
    averageTempMin: avgTempMin,
    totalDays: filteredData.length,
  });
};

exports.getLocationWeather = (req, res) => {
  try {
    const { location, date } = req.query;

    if (!location || !date) {
      return res.status(400).send({ message: 'Location and date are required' });
    }

    const filteredData = weatherData.filter(
        (data) => data.name.toLowerCase() === location.toLowerCase() && data.datetime === date
    );

    if (filteredData.length === 0) {
      return res.status(404).send({ message: `Weather data for ${location} on ${date} not found` });
    }

    return res.send(filteredData);
  } catch (error) {
    console.error('Error in getLocationWeather:', error);
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
};
