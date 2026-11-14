const { MongoClient } = require("mongodb");
require("../utils/env");

const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "Adopet";

const client = new MongoClient(dbURI, {
    maxPoolSize: 20,
    serverSelectionTimeoutMS: 5000,
});

let db = client.db(dbName);
let isConnected = false;

async function connectToDatabase() {
    try {
        await client.connect();
        isConnected = true;
        console.log(`Connected successfully to MongoDB database: ${dbName}`);

        // Ensure database indexes for security and performance
        try {
            await db.collection("Admin").createIndex({ email: 1 }, { unique: true });
            await db.collection("User").createIndex({ email: 1 }, { unique: true });
            // TTL index: MongoDB automatically purges documents when expiresAt is reached
            await db.collection("OTP").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
        } catch (indexErr) {
            // Index creation might fail if duplicates already exist, log warning
            console.warn("Index initialization notice:", indexErr.message);
        }
    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
    }
}

connectToDatabase();

module.exports = db;
