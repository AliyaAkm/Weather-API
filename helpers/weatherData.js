const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let weatherData = [];

const parseCSV = () => {
  const filePath = path.join(__dirname, '../data/AstAlmShym 2025-01-01 to 2025-01-21.csv');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      weatherData.push({
        name: row.name,
        datetime: row.datetime,
        tempmax: parseFloat(row.tempmax),
        tempmin: parseFloat(row.tempmin),
        feelslike: parseFloat(row.feelslike),
        humidity: parseFloat(row.humidity),
        precipprob: parseFloat(row.precipprob),
        snow: parseFloat(row.snow),
        windspeed: parseFloat(row.windspeed),
        sealevelpressure: parseFloat(row.sealevelpressure),
        cloudcover: parseFloat(row.cloudcover),
        uvindex: parseInt(row.uvindex, 10),
        sunrise: row.sunrise,
        sunset: row.sunset,
        moonphase: parseFloat(row.moonphase),
      });
    })
    .on('end', () => {
      console.log('CSV file successfully processed.');
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
    });
};

parseCSV();

module.exports = { weatherData };