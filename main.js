const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const authenticationController = require('./controllers/authController');
require('dotenv').config();

let client;
let weatherCollection;

// Reusable function to initialize MongoDB connection
async function initMongoDB() {
    try {
        client = new MongoClient(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await client.connect();
        console.log('Connected to MongoDB!');

        const db = client.db('api');
        weatherCollection = db.collection('weather');

        console.log('Collections initialized:', { weatherCollection });
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

// Parse CSV and insert data into MongoDB
const parseCSV = async () => {
    const filePath = path.join(__dirname, '../data/AstAlmShym 2025-01-01 to 2025-01-21.csv');
    console.log('CSV file path:', filePath);  // Log file path

    const weatherData = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            console.log('Parsed row:', row);  // Log each parsed row
            weatherData.push({
                name: row.name,
                datetime: row.datetime,
                tempmax: parseFloat(row.tempmax),
                tempmin: parseFloat(row.tempmin),
                sunrise: row.sunrise,
                sunset: row.sunset,
            });
        })
        .on('end', async () => {
            console.log('CSV file processed.');
            console.log(weatherData);  // Log the parsed data to check

            try {
                if (weatherCollection) {
                    for (const data of weatherData) {
                        const exists = await weatherCollection.findOne({ datetime: data.datetime });
                        if (!exists) {
                            await weatherCollection.insertOne(data);
                        }
                    }
                    console.log('Data successfully added.');
                } else {
                    console.error('MongoDB collection not available.');
                }
            } catch (error) {
                console.error('Error inserting data into MongoDB:', error.stack);  // Log full error
            }
        });
};

// Initialize MongoDB connection and parse CSV
(async () => {
    await initMongoDB();
    parseCSV();
})();

// Export the authentication functions
module.exports = {
    signup: authenticationController.signup,
    login: authenticationController.login,
};

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed.');
        }
    } catch (error) {
        console.error(`Error closing MongoDB connection: ${error.message}`);
    } finally {
        process.exit(0);
    }
});