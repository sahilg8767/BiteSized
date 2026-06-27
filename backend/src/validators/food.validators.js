const { body } = require('express-validator');

const createFoodValidator = [
    body('name').trim().notEmpty().withMessage('Food name is required'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .bail()
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category')
        .optional()
        .isIn(['veg', 'non-veg', 'dessert', 'beverage', 'other'])
        .withMessage('Invalid category'),
];

module.exports = { createFoodValidator };
