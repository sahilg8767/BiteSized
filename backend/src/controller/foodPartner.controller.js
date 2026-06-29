const foodPartnerModel = require('../models/food-partner.model');
const foodModel = require('../models/food.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

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

module.exports = { getPartnerProfile };
