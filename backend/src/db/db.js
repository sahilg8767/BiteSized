const mongoose = require('mongoose');

// Fail fast: if the database is unreachable at boot, log clearly and exit
// instead of staying up and letting every query buffer-timeout after 10s.
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.error(
            'Tip: if using Atlas, allow your current IP under Network Access ' +
            '(or 0.0.0.0/0 for local dev), and check MONGO_URI in your .env.'
        );
        process.exit(1);
    }
}

module.exports = connectDB;
