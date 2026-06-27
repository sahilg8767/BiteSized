const { body } = require('express-validator');

const registerUserValidator = [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidator = [
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

const registerPartnerValidator = [
    body('name').trim().notEmpty().withMessage('Business name is required'),
    body('contactName').trim().notEmpty().withMessage('Contact name is required'),
    body('email').trim().isEmail().withMessage('A valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('address').trim().notEmpty().withMessage('Address is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

module.exports = { registerUserValidator, loginValidator, registerPartnerValidator };
