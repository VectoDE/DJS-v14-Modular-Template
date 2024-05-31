const mongoose = require('mongoose');
const mongodbURL = process.env.MONGODBURL;

async function connectToDatabase() {
    try {
        if (!mongodbURL) {
            console.log('MongoDB URL not provided!');
            return;
        }

        await mongoose.connect(mongodbURL, {});

        console.log('MongoDB Connected!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = connectToDatabase;