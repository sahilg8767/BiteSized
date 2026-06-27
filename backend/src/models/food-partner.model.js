const mongoose = require('mongoose');

const foodPartnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        contactName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            select: false,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

const foodPartnerModel = mongoose.model('foodpartner', foodPartnerSchema);
module.exports = foodPartnerModel;
