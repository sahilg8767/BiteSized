const express = require('express');
const rateLimit = require('express-rate-limit');
const authController = require('../controller/auth.controller');
const validate = require('../middlewares/validate.middleware');
const { authUserMiddleware, authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');
const {
    registerUserValidator,
    loginValidator,
    registerPartnerValidator,
} = require('../validators/auth.validators');

const router = express.Router();

// Throttle auth endpoints to slow down brute-force / spam attempts.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many attempts, please try again later' },
});

// user auth apis
router.post('/user/register', authLimiter, registerUserValidator, validate, authController.registerUser);
router.post('/user/login', authLimiter, loginValidator, validate, authController.loginUser);
router.get('/user/logout', authController.logoutUser);
router.patch('/user/profile', authUserMiddleware, authController.updateUserProfile);
router.delete('/user', authUserMiddleware, authController.deleteUserAccount);

// food partner auth apis
router.post('/food-partner/register', authLimiter, registerPartnerValidator, validate, authController.registerFoodPartner);
router.post('/food-partner/login', authLimiter, loginValidator, validate, authController.loginFoodPartner);
router.get('/food-partner/logout', authController.logoutFoodPartner);
router.patch('/food-partner/profile', authFoodPartnerMiddleware, authController.updateFoodPartnerProfile);

// shared
router.get('/me', authController.getMe);

module.exports = router;
