const foodPartnerModel = require('../models/food-partner.model');
const userModel = require('../models/user.model');
const { verifyToken } = require('../utils/jwt');
const { COOKIE_NAME } = require('../utils/cookies');
const ApiError = require('../utils/ApiError');

// Reads + verifies the auth cookie and returns the decoded payload, or throws
// a 401. Token payload shape: { id, role: 'user' | 'food-partner' }.
function getDecodedToken(req) {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
        throw new ApiError(401, 'Please login first');
    }
    try {
        return verifyToken(token);
    } catch {
        throw new ApiError(401, 'Session expired, please login again');
    }
}

async function authFoodPartnerMiddleware(req, res, next) {
    try {
        const decoded = getDecodedToken(req);
        if (decoded.role !== 'food-partner') {
            throw new ApiError(403, 'Only food partners can perform this action');
        }
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) {
            throw new ApiError(401, 'Account not found');
        }
        req.foodPartner = foodPartner;
        next();
    } catch (err) {
        next(err);
    }
}

async function authUserMiddleware(req, res, next) {
    try {
        const decoded = getDecodedToken(req);
        if (decoded.role !== 'user') {
            throw new ApiError(403, 'Only users can perform this action');
        }
        const user = await userModel.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, 'Account not found');
        }
        req.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

// Optional auth: attaches req.user if a valid user cookie exists, but never
// blocks the request. Used by the public feed to compute isLiked / isSaved.
async function optionalUserMiddleware(req, res, next) {
    try {
        const token = req.cookies[COOKIE_NAME];
        if (token) {
            const decoded = verifyToken(token);
            if (decoded.role === 'user') {
                req.user = await userModel.findById(decoded.id);
            }
        }
    } catch {
        // ignore invalid/expired tokens for optional auth
    }
    next();
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware,
    optionalUserMiddleware,
    getDecodedToken,
};
