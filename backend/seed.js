/**
 * Seed script — populates the database with demo restaurants, users and reels
 * so the app looks alive for a demo / on a fresh clone.
 *
 * Usage:
 *   node seed.js          # wipe demo collections and insert fresh demo data
 *
 * NOTE: this clears the food, user, foodpartner, like, save, comment and order
 * collections. Only run it on a database you're happy to reset.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userModel = require('./src/models/user.model');
const foodPartnerModel = require('./src/models/food-partner.model');
const foodModel = require('./src/models/food.model');

// Reuse a few real, playable video URLs so the reels actually render.
const VIDEOS = [
    'https://ik.imagekit.io/Sahil12345/8edfc389-e67c-4af6-b8d5-ce15e96d1748_5WLdG3A7P',
    'https://ik.imagekit.io/Sahil12345/3991b48f-2c94-4ef9-ab2a-78ed89c4fac0_nEV3CXxqo',
    'https://ik.imagekit.io/Sahil12345/a6a9e85f-fd63-4759-93ee-eb14ae15e1c8_cIUqqO_X9',
];
const video = (i) => VIDEOS[i % VIDEOS.length];

const PARTNERS = [
    {
        name: 'Spice Garden',
        contactName: 'Ravi Kumar',
        email: 'spicegarden@demo.com',
        phone: '9990000001',
        address: '12 MG Road, Bengaluru',
        dishes: [
            { name: 'Paneer Butter Masala', price: 249, category: 'veg', description: 'Creamy tomato gravy with soft paneer cubes.' },
            { name: 'Veg Biryani', price: 199, category: 'veg', description: 'Fragrant basmati rice cooked with garden vegetables.' },
            { name: 'Gulab Jamun', price: 89, category: 'dessert', description: 'Warm syrup-soaked dumplings.' },
        ],
    },
    {
        name: 'Grill House',
        contactName: 'Aisha Khan',
        email: 'grillhouse@demo.com',
        phone: '9990000002',
        address: '45 Park Street, Kolkata',
        dishes: [
            { name: 'Chicken Tikka', price: 299, category: 'non-veg', description: 'Char-grilled spiced chicken skewers.' },
            { name: 'Mutton Seekh Kebab', price: 349, category: 'non-veg', description: 'Smoky minced mutton kebabs.' },
            { name: 'Cold Coffee', price: 129, category: 'beverage', description: 'Thick, chilled and frothy.' },
        ],
    },
    {
        name: 'Slice of Italy',
        contactName: 'Marco Neri',
        email: 'sliceofitaly@demo.com',
        phone: '9990000003',
        address: '7 Linking Road, Mumbai',
        dishes: [
            { name: 'Margherita Pizza', price: 279, category: 'veg', description: 'Wood-fired pizza with fresh basil and mozzarella.' },
            { name: 'Pasta Alfredo', price: 259, category: 'veg', description: 'Creamy white sauce penne.' },
            { name: 'Tiramisu', price: 149, category: 'dessert', description: 'Classic coffee-soaked layered dessert.' },
        ],
    },
];

const USERS = [
    { fullName: 'Demo User', email: 'user@demo.com', password: 'password123' },
    { fullName: 'Priya Sharma', email: 'priya@demo.com', password: 'password123' },
];

async function seed() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI missing in .env');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected. Clearing demo collections...');

    // Clear collections that exist (models optional-loaded to avoid crashes).
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

    // Users
    const hashedUsers = await Promise.all(
        USERS.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10) }))
    );
    await userModel.insertMany(hashedUsers);
    console.log(`Inserted ${hashedUsers.length} users`);

    // Partners + their reels
    let reelIndex = 0;
    let totalReels = 0;
    for (const partner of PARTNERS) {
        const { dishes, ...partnerData } = partner;
        const created = await foodPartnerModel.create({
            ...partnerData,
            password: await bcrypt.hash('password123', 10),
        });

        const foods = dishes.map((d) => ({
            ...d,
            video: video(reelIndex++),
            foodPartner: created._id,
        }));
        await foodModel.insertMany(foods);
        totalReels += foods.length;
    }
    console.log(`Inserted ${PARTNERS.length} partners and ${totalReels} reels`);

    console.log('\nDemo logins:');
    console.log('  User      -> user@demo.com / password123');
    console.log('  Partner   -> spicegarden@demo.com / password123');

    await mongoose.disconnect();
    console.log('\nDone.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
