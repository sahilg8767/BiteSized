const foodModel = require('../models/food.model');
const likeModel = require('../models/like.model');
const saveModel = require('../models/save.model');
const storageService = require('../services/storage.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { v4: uuid } = require('uuid');

const PAGE_SIZE = 10;

// Marks which of these reels the current user has liked/saved, so the feed can
// render filled hearts/bookmarks. No-op for logged-out (optional auth) users.
async function annotateEngagement(foodItems, userId) {
    if (!userId || foodItems.length === 0) return foodItems;

    const ids = foodItems.map((f) => f._id);
    const [likes, saves] = await Promise.all([
        likeModel.find({ user: userId, food: { $in: ids } }).select('food').lean(),
        saveModel.find({ user: userId, food: { $in: ids } }).select('food').lean(),
    ]);

    const likedSet = new Set(likes.map((l) => String(l.food)));
    const savedSet = new Set(saves.map((s) => String(s.food)));

    return foodItems.map((f) => ({
        ...f,
        isLiked: likedSet.has(String(f._id)),
        isSaved: savedSet.has(String(f._id)),
    }));
}

// POST /api/food  (food partner only)
const createFood = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(400, 'A video file is required');
    }

    const fileUploadResult = await storageService.uploadFile(req.file.buffer, uuid());

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category || 'other',
        video: fileUploadResult.url,
        foodPartner: req.foodPartner._id,
    });

    res.status(201).json({
        message: 'Food created successfully',
        food: foodItem,
    });
});

// GET /api/food  -> paginated reels feed, newest first
const getFoodItems = asyncHandler(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);

    const [foodItems, total] = await Promise.all([
        foodModel
            .find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .populate('foodPartner', 'name address')
            .lean(),
        foodModel.countDocuments({}),
    ]);

    const annotated = await annotateEngagement(foodItems, req.user?._id);

    res.status(200).json({
        message: 'Food items fetched successfully',
        page,
        hasMore: page * PAGE_SIZE < total,
        foodItems: annotated,
    });
});

// GET /api/food/:id
const getFoodById = asyncHandler(async (req, res) => {
    const food = await foodModel
        .findById(req.params.id)
        .populate('foodPartner', 'name address')
        .lean();

    if (!food) {
        throw new ApiError(404, 'Food not found');
    }

    const [annotated] = await annotateEngagement([food], req.user?._id);
    res.status(200).json({ message: 'Food fetched successfully', food: annotated });
});

// GET /api/food/partner/:id  -> a partner's reels (public profile feed)
const getFoodByPartner = asyncHandler(async (req, res) => {
    const foodItems = await foodModel
        .find({ foodPartner: req.params.id })
        .sort({ createdAt: -1 })
        .populate('foodPartner', 'name address')
        .lean();

    const annotated = await annotateEngagement(foodItems, req.user?._id);

    res.status(200).json({
        message: 'Partner food items fetched successfully',
        foodItems: annotated,
    });
});

// GET /api/food/partner/mine  -> logged-in partner's own reels
const getMyFood = asyncHandler(async (req, res) => {
    const foodItems = await foodModel
        .find({ foodPartner: req.foodPartner._id })
        .sort({ createdAt: -1 })
        .lean();

    res.status(200).json({
        message: 'Your food items fetched successfully',
        foodItems,
    });
});

// GET /api/food/search?q=
const searchFood = asyncHandler(async (req, res) => {
    const q = (req.query.q || '').trim();
    if (!q) {
        return res.status(200).json({ message: 'No query', foodItems: [] });
    }

    const foodItems = await foodModel
        .find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } },
            ],
        })
        .sort({ createdAt: -1 })
        .populate('foodPartner', 'name address')
        .lean();

    res.status(200).json({ message: 'Search results', foodItems });
});

module.exports = {
    createFood,
    getFoodItems,
    getFoodById,
    getFoodByPartner,
    getMyFood,
    searchFood,
};
