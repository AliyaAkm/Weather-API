const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let weatherData = [];
let client;
let collection;

// Function to connect to MongoDB
async function initMongoDB() {
    try {
        client = new MongoClient('mongodb+srv://username:password@cluster.mongodb.net/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        await client.connect();
        console.log('Connected to MongoDB!');
        const db = client.db('weather');
        collection = db.collection('weather');
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

// Parse CSV and insert data into MongoDB
const parseCSV = async () => {
    const filePath = path.join(__dirname, '../data/AstAlmShym 2025-01-01 to 2025-01-21.csv');

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
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

            try {
                if (collection) {
                    for (const data of weatherData) {
                        const exists = await collection.findOne({ datetime: data.datetime });
                        if (!exists) {
                            await collection.insertOne(data);
                        }
                    }
                    console.log('Data successfully added.');
                } else {
                    console.error('MongoDB collection not available.');
                }
            } catch (error) {
                console.error('Error inserting data into MongoDB:', error);
            }
        });
};

// Initialize MongoDB connection and parse CSV
(async () => {
    await initMongoDB();
    parseCSV();
})();

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
