/**
 * Wipe script — completely clears all collections in the database
 * to give you a clean slate to register your own users, partners, and reels.
 */
require('dotenv').config();
const mongoose = require('mongoose');

const userModel = require('./src/models/user.model');
const foodPartnerModel = require('./src/models/food-partner.model');
const foodModel = require('./src/models/food.model');

async function wipe() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI missing in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB. Wiping all collections...');

    const optionalModels = ['like.model', 'save.model', 'comment.model', 'order.model'];
    const extraModels = optionalModels
        .map((m) => {
            try {
                return require(`./src/models/${m}`);
            } catch {
                return null;
            }
        })
        .filter(Boolean);

    await Promise.all([
        foodModel.deleteMany({}),
        userModel.deleteMany({}),
        foodPartnerModel.deleteMany({}),
        ...extraModels.map((m) => m.deleteMany({})),
    ]);

    console.log('Database wiped! All users, partners, reels, orders, likes, saves, and comments deleted.');
    await mongoose.disconnect();
    process.exit(0);
}

wipe().catch((err) => {
    console.error('Wipe failed:', err);
    process.exit(1);
});
