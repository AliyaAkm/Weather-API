const { MongoClient } = require('mongodb');
require('dotenv').config();

let client;
let db;

// Initialize MongoDB connection
async function initMongoDB() {
    if (!client) {
        try {
            console.log('Attempting MongoDB connection...');
            client = new MongoClient(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            await client.connect();
            console.log('Connected to MongoDB!');
            db = client.db('api');
            console.log('Database initialized:', db.databaseName); // Confirm database assignment
        } catch (error) {
            console.error(`Error connecting to MongoDB: ${error.message}`);
            process.exit(1);
        }
    } else {
        console.log('MongoDB client already initialized.');
    }
}

// Get collection helper
function getCollection(collectionName) {
    if (!db) {
        throw new Error('Database connection is not initialized. Ensure initMongoDB() is called and awaited.');
    }
    return db.collection(collectionName);
}

// Close connection on shutdown
async function closeMongoDB() {
    if (client) {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

module.exports = { initMongoDB, getCollection, closeMongoDB };