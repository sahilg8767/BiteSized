const express = require('express');
const multer = require('multer');
const foodController = require('../controller/food.controller');
const engagementController = require('../controller/engagement.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createFoodValidator } = require('../validators/food.validators');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB cap on reel uploads
});

const { authFoodPartnerMiddleware, authUserMiddleware, optionalUserMiddleware } = authMiddleware;

// --- partner-scoped (specific routes before the dynamic :id) ---
router.get('/partner/mine', authFoodPartnerMiddleware, foodController.getMyFood);

// --- user-scoped ---
router.get('/saved', authUserMiddleware, engagementController.getSavedFood);

// create a reel (food partner only)
router.post(
    '/',
    authFoodPartnerMiddleware,
    upload.single('video'),
    createFoodValidator,
    validate,
    foodController.createFood
);

// --- engagement (user only, except listing comments) ---
router.post('/:id/like', authUserMiddleware, engagementController.toggleLike);
router.post('/:id/save', authUserMiddleware, engagementController.toggleSave);
router.get('/:id/comments', engagementController.getComments);
router.post('/:id/comments', authUserMiddleware, engagementController.addComment);

// --- public (optional auth annotates isLiked/isSaved) ---
router.get('/', optionalUserMiddleware, foodController.getFoodItems);
router.get('/search', foodController.searchFood);
router.get('/partner/:id', optionalUserMiddleware, foodController.getFoodByPartner);
router.get('/:id', optionalUserMiddleware, foodController.getFoodById);

module.exports = router;
