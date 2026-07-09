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

// GET /api/food  -> paginated reels feed, randomized to mix different restaurants
const getFoodItems = asyncHandler(async (req, res) => {
    const foodItems = await foodModel
        .find({})
        .populate('foodPartner', 'name address')
        .lean();

    const annotated = await annotateEngagement(foodItems, req.user?._id);

    // Deterministic/Random Fisher-Yates Shuffle
    const shuffled = [...annotated];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    res.status(200).json({
        message: 'Food items fetched successfully',
        page: 1,
        hasMore: false,
        foodItems: shuffled,
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

// Returns a map of foodId -> total quantity ordered, for the given foods.
async function orderCountsFor(foodIds) {
    if (foodIds.length === 0) return new Map();
    try {
        const orderModel = require('../models/order.model');
        const rows = await orderModel.aggregate([
            { $unwind: '$items' },
            { $match: { 'items.food': { $in: foodIds } } },
            { $group: { _id: '$items.food', count: { $sum: '$items.quantity' } } },
        ]);
        return new Map(rows.map((r) => [String(r._id), r.count]));
    } catch {
        return new Map();
    }
}

// GET /api/food/partner/:id  -> a partner's reels (public profile feed)
const getFoodByPartner = asyncHandler(async (req, res) => {
    const foodItems = await foodModel
        .find({ foodPartner: req.params.id })
        .sort({ createdAt: -1 })
        .populate('foodPartner', 'name address')
        .lean();

    const annotated = await annotateEngagement(foodItems, req.user?._id);
    const counts = await orderCountsFor(annotated.map((f) => f._id));
    const withCounts = annotated.map((f) => ({
        ...f,
        orderCount: counts.get(String(f._id)) || 0,
    }));

    res.status(200).json({
        message: 'Partner food items fetched successfully',
        foodItems: withCounts,
    });
});

// GET /api/food/category/:category  -> dishes in a category (grid browse)
const getFoodByCategory = asyncHandler(async (req, res) => {
    const foodItems = await foodModel
        .find({ category: req.params.category })
        .sort({ createdAt: -1 })
        .populate('foodPartner', 'name address')
        .lean();

    res.status(200).json({ message: 'Category items fetched', foodItems });
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
        return res.status(200).json({ message: 'No query', foodItems: [], partners: [] });
    }

    const foodPartnerModel = require('../models/food-partner.model');

    const [foodItems, partners] = await Promise.all([
        foodModel
            .find({
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { description: { $regex: q, $options: 'i' } },
                    { category: { $regex: q, $options: 'i' } },
                ],
            })
            .sort({ createdAt: -1 })
            .populate('foodPartner', 'name address')
            .lean(),
        foodPartnerModel
            .find({
                $or: [
                    { name: { $regex: q, $options: 'i' } },
                    { address: { $regex: q, $options: 'i' } },
                ],
            })
            .lean(),
    ]);

    res.status(200).json({ message: 'Search results', foodItems, partners });
});

// DELETE /api/food/:id (food partner only)
const deleteFoodItem = asyncHandler(async (req, res) => {
    const foodId = req.params.id;
    const foodItem = await foodModel.findById(foodId);

    if (!foodItem) {
        throw new ApiError(404, 'Food item not found');
    }

    // Verify ownership
    if (String(foodItem.foodPartner) !== String(req.foodPartner._id)) {
        throw new ApiError(403, 'You do not own this food item');
    }

    // Delete item
    await foodModel.findByIdAndDelete(foodId);

    // Best-effort cleanup of likes, saves, comments
    try {
        const likeModel = require('../models/like.model');
        const saveModel = require('../models/save.model');
        const commentModel = require('../models/comment.model');
        await Promise.all([
            likeModel.deleteMany({ food: foodId }),
            saveModel.deleteMany({ food: foodId }),
            commentModel.deleteMany({ food: foodId }),
        ]);
    } catch {
        // ignore
    }

    res.status(200).json({ message: 'Food item deleted successfully' });
});

module.exports = {
    createFood,
    getFoodItems,
    getFoodById,
    getFoodByPartner,
    getFoodByCategory,
    getMyFood,
    searchFood,
    deleteFoodItem,
};
