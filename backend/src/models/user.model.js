const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        fullName: {
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
        password: {
            type: String,
            required: true,
            select: false, // never returned unless explicitly requested
        },
        phone: {
            type: String,
            trim: true,
            default: '',
        },
        address: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

const userModel = mongoose.model('user', userSchema);
module.exports = userModel;
