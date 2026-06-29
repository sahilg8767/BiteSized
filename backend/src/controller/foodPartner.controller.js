const foodPartnerModel = require('../models/food-partner.model');
const foodModel = require('../models/food.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// GET /api/food-partner  -> list all restaurants with reel counts (for the
// landing "browse restaurants" section). Only partners who have posted reels.
const listPartners = asyncHandler(async (req, res) => {
    // count reels per partner
    const counts = await foodModel.aggregate([
        { $group: { _id: '$foodPartner', totalReels: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.totalReels]));

    const partners = await foodPartnerModel
        .find({ _id: { $in: counts.map((c) => c._id) } })
        .select('name address')
        .lean();

    const restaurants = partners
        .map((p) => ({ ...p, totalReels: countMap.get(String(p._id)) || 0 }))
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

    res.status(200).json({
        message: 'Partner profile fetched',
        foodPartner: { ...partner, totalReels },
    });
});

module.exports = { listPartners, getPartnerProfile };
