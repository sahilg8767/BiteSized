const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        video: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: String,
            enum: ['veg', 'non-veg', 'dessert', 'beverage', 'other'],
            default: 'other',
        },
        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'foodpartner',
            required: true,
        },
        likeCount: {
            type: Number,
            default: 0,
        },
        savesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Text index powers the search endpoint (name + description).
foodSchema.index({ name: 'text', description: 'text' });

const foodModel = mongoose.model('food', foodSchema);
module.exports = foodModel;
