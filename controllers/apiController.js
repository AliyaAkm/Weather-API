const { weatherData } = require('../helpers/weatherData');

// Get weather forecast
exports.getForecast = (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).send({ message: 'Location is required' });
  }

  const filteredData = weatherData.filter((data) => data.name === location);

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

// Get weather data by location and date
exports.getLocationWeather = (req, res) => {
  try {
    const { location, date, attribute } = req.query;

    if (!location || !date) {
      return res.status(400).send({ message: 'Location and date are required' });
    }

    const filteredData = weatherData.filter(
        (data) => data.name === location && data.datetime === date
    );

    if (filteredData.length === 0) {
      return res.status(404).send({ message: `Weather data for ${location} on ${date} not found` });
    }

    if (!attribute) {
      return res.send(filteredData);
    }

    const weather = filteredData[0];
    const validAttributes = [
      'tempmax', 'tempmin', 'feelslike', 'humidity', 'precipprob',
      'snow', 'windspeed', 'sealevelpressure', 'cloudcover', 'uvindex',
      'sunrise', 'sunset', 'moonphase'
    ];

    if (validAttributes.includes(attribute)) {
      return res.send({ [attribute]: weather[attribute] });
    }

    return res.status(400).send({ message: `Invalid attribute requested. Valid attributes are: ${validAttributes.join(', ')}` });
  } catch (error) {
    console.error('Error in getLocationWeather:', error);
    return res.status(500).send({ message: 'Internal Server Error', error: error.message });
  }
};
