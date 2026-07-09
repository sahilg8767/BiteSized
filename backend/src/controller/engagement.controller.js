const foodModel = require('../models/food.model');
const likeModel = require('../models/like.model');
const saveModel = require('../models/save.model');
const commentModel = require('../models/comment.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// POST /api/food/:id/like  -> toggle like (user only)
const toggleLike = asyncHandler(async (req, res) => {
    const foodId = req.params.id;
    const food = await foodModel.findById(foodId);
    if (!food) throw new ApiError(404, 'Food not found');

    const existing = await likeModel.findOne({ user: req.user._id, food: foodId });

    if (existing) {
        await existing.deleteOne();
        food.likeCount = Math.max(0, food.likeCount - 1);
        await food.save();
        return res.status(200).json({ liked: false, likeCount: food.likeCount });
    }

    await likeModel.create({ user: req.user._id, food: foodId });
    food.likeCount += 1;
    await food.save();
    res.status(201).json({ liked: true, likeCount: food.likeCount });
});

// POST /api/food/:id/save  -> toggle save (user only)
const toggleSave = asyncHandler(async (req, res) => {
    const foodId = req.params.id;
    const food = await foodModel.findById(foodId);
    if (!food) throw new ApiError(404, 'Food not found');

    const existing = await saveModel.findOne({ user: req.user._id, food: foodId });

    if (existing) {
        await existing.deleteOne();
        food.savesCount = Math.max(0, food.savesCount - 1);
        await food.save();
        return res.status(200).json({ saved: false, savesCount: food.savesCount });
    }

    await saveModel.create({ user: req.user._id, food: foodId });
    food.savesCount += 1;
    await food.save();
    res.status(201).json({ saved: true, savesCount: food.savesCount });
});

// GET /api/food/saved  -> the user's saved reels as a feed (user only)
const getSavedFood = asyncHandler(async (req, res) => {
    const saves = await saveModel
        .find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate({
            path: 'food',
            populate: { path: 'foodPartner', select: 'name address' },
        })
        .lean();

    // a reel might have been deleted; drop dangling saves
    const foodItems = saves
        .map((s) => {
            if (!s.food) return null;
            const foodObj = s.food.toObject ? s.food.toObject() : s.food;
            return {
                _id: foodObj._id,
                name: foodObj.name,
                video: foodObj.video,
                description: foodObj.description,
                price: foodObj.price,
                category: foodObj.category,
                foodPartner: foodObj.foodPartner,
                likeCount: foodObj.likeCount,
                savesCount: foodObj.savesCount,
                commentsCount: foodObj.commentsCount,
                isSaved: true,
            };
        })
        .filter(Boolean);

    res.status(200).json({ message: 'Saved reels fetched', foodItems });
});

// GET /api/food/:id/comments  -> list comments (public)
const getComments = asyncHandler(async (req, res) => {
    const comments = await commentModel
        .find({ food: req.params.id })
        .sort({ createdAt: -1 })
        .populate('user', 'fullName')
        .lean();

    res.status(200).json({ message: 'Comments fetched', comments });
});

// POST /api/food/:id/comments  -> add a comment (user only)
const addComment = asyncHandler(async (req, res) => {
    const foodId = req.params.id;
    const text = (req.body.text || '').trim();
    if (!text) throw new ApiError(400, 'Comment cannot be empty');

    const food = await foodModel.findById(foodId);
    if (!food) throw new ApiError(404, 'Food not found');

    const comment = await commentModel.create({
        user: req.user._id,
        food: foodId,
        text,
    });
    food.commentsCount += 1;
    await food.save();

    const populated = await comment.populate('user', 'fullName');
    res.status(201).json({ message: 'Comment added', comment: populated });
});

module.exports = {
    toggleLike,
    toggleSave,
    getSavedFood,
    getComments,
    addComment,
};
