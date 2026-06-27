const express = require('express');
const multer = require('multer');
const foodController = require('../controller/food.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createFoodValidator } = require('../validators/food.validators');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB cap on reel uploads
});

// --- partner-scoped (specific routes before the dynamic :id) ---
router.get('/partner/mine', authMiddleware.authFoodPartnerMiddleware, foodController.getMyFood);

// create a reel (food partner only)
router.post(
    '/',
    authMiddleware.authFoodPartnerMiddleware,
    upload.single('video'),
    createFoodValidator,
    validate,
    foodController.createFood
);

// --- public ---
router.get('/', foodController.getFoodItems);
router.get('/search', foodController.searchFood);
router.get('/partner/:id', foodController.getFoodByPartner);
router.get('/:id', foodController.getFoodById);

module.exports = router;
