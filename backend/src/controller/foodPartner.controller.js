const foodPartnerModel = require('../models/food-partner.model');
const foodModel = require('../models/food.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/food-partner  -> list all restaurants with reel counts (for the
// landing "browse restaurants" section). Only partners who have posted reels.
const listPartners = asyncHandler(async (req, res) => {
    // reels per partner + a cover video (newest reel) for a rich card
    const agg = await foodModel.aggregate([
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: '$foodPartner',
                totalReels: { $sum: 1 },
                cover: { $first: '$video' },
            },
        },
    ]);
    const metaMap = new Map(agg.map((c) => [String(c._id), c]));

    const partners = await foodPartnerModel
        .find({ _id: { $in: agg.map((c) => c._id) } })
        .select('name address')
        .lean();

    const restaurants = partners
        .map((p) => {
            const meta = metaMap.get(String(p._id)) || {};
            return { ...p, totalReels: meta.totalReels || 0, cover: meta.cover || null };
        })
        .sort((a, b) => b.totalReels - a.totalReels);

    res.status(200).json({ message: 'Restaurants fetched', restaurants });
});

// GET /api/food-partner/:id  -> public profile (name, address, reel count)
const getPartnerProfile = asyncHandler(async (req, res) => {
    const partner = await foodPartnerModel
        .findById(req.params.id)
        .select('name address contactName')
        .lean();

    if (!partner) throw new ApiError(404, 'Restaurant not found');

    const totalReels = await foodModel.countDocuments({ foodPartner: partner._id });

    let totalOrders = 0;
    try {
        const orderModel = require('../models/order.model');
        totalOrders = await orderModel.countDocuments({ foodPartner: partner._id });
    } catch {
        // order model unavailable — leave at 0
    }

    res.status(200).json({
        message: 'Partner profile fetched',
        foodPartner: { ...partner, totalReels, totalOrders },
    });
});

module.exports = { listPartners, getPartnerProfile };
