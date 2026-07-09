const userModel = require('../models/user.model');
const foodPartnerModel = require('../models/food-partner.model');
const bcrypt = require('bcryptjs');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');
const { setAuthCookie, clearAuthCookie } = require('../utils/cookies');

// ---------- User ----------

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
        throw new ApiError(400, 'An account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({ fullName, email, password: hashedPassword });

    const token = signToken({ id: user._id, role: 'user' });
    setAuthCookie(res, token);

    res.status(201).json({
        message: 'User registered successfully',
        role: 'user',
        user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // password has select:false on the schema, so request it explicitly
    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(400, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid email or password');
    }

    const token = signToken({ id: user._id, role: 'user' });
    setAuthCookie(res, token);

    res.status(200).json({
        message: 'User logged in successfully',
        role: 'user',
        user: { _id: user._id, email: user.email, fullName: user.fullName },
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    clearAuthCookie(res);
    res.status(200).json({ message: 'User logged out successfully' });
});

// ---------- Food partner ----------

const registerFoodPartner = asyncHandler(async (req, res) => {
    const { name, contactName, email, phone, address, password } = req.body;

    const isAccountAlreadyExists = await foodPartnerModel.findOne({ email });
    if (isAccountAlreadyExists) {
        throw new ApiError(400, 'A food partner account with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        contactName,
        address,
    });

    const token = signToken({ id: foodPartner._id, role: 'food-partner' });
    setAuthCookie(res, token);

    res.status(201).json({
        message: 'Food partner registered successfully',
        role: 'food-partner',
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName,
        },
    });
});

const loginFoodPartner = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const foodPartner = await foodPartnerModel.findOne({ email }).select('+password');
    if (!foodPartner) {
        throw new ApiError(400, 'Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) {
        throw new ApiError(400, 'Invalid email or password');
    }

    const token = signToken({ id: foodPartner._id, role: 'food-partner' });
    setAuthCookie(res, token);

    res.status(200).json({
        message: 'Food partner logged in successfully',
        role: 'food-partner',
        foodPartner: { _id: foodPartner._id, name: foodPartner.name, email: foodPartner.email },
    });
});

const logoutFoodPartner = asyncHandler(async (req, res) => {
    clearAuthCookie(res);
    res.status(200).json({ message: 'Food partner logged out successfully' });
});

// PATCH /api/auth/user/profile  (user only) — edit name / phone / address
const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, phone, address } = req.body;
    const updates = {};
    if (typeof fullName === 'string' && fullName.trim()) updates.fullName = fullName.trim();
    if (typeof phone === 'string') updates.phone = phone.trim();
    if (typeof address === 'string') updates.address = address.trim();

    const user = await userModel.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({ message: 'Profile updated', user });
});

// PATCH /api/auth/food-partner/profile  (food partner only)
const updateFoodPartnerProfile = asyncHandler(async (req, res) => {
    const { name, phone, contactName, address } = req.body;
    const updates = {};

    if (typeof name === 'string' && name.trim()) updates.name = name.trim();
    if (typeof phone === 'string') updates.phone = phone.trim();
    if (typeof contactName === 'string' && contactName.trim()) updates.contactName = contactName.trim();
    if (typeof address === 'string') updates.address = address.trim();

    const foodPartner = await foodPartnerModel.findByIdAndUpdate(
        req.foodPartner._id,
        updates,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({ message: 'Profile updated', foodPartner });
});

// DELETE /api/auth/user  (user only) — delete account + related data
const deleteUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // best-effort cleanup of the user's engagement + orders
    const related = ['like.model', 'save.model', 'comment.model', 'order.model'];
    await Promise.all(
        related.map(async (m) => {
            try {
                const model = require(`../models/${m}`);
                await model.deleteMany({ user: userId });
            } catch {
                // model may not exist / no matching docs — ignore
            }
        })
    );

    await userModel.findByIdAndDelete(userId);
    clearAuthCookie(res);
    res.status(200).json({ message: 'Account deleted' });
});

// ---------- Shared ----------

// Lets the frontend bootstrap auth state on load from the httpOnly cookie.
const getMe = asyncHandler(async (req, res) => {
    const { getDecodedToken } = require('../middlewares/auth.middleware');
    const decoded = getDecodedToken(req);

    if (decoded.role === 'user') {
        const user = await userModel.findById(decoded.id);
        if (!user) throw new ApiError(401, 'Account not found');
        return res.status(200).json({ role: 'user', user });
    }

    if (decoded.role === 'food-partner') {
        const foodPartner = await foodPartnerModel.findById(decoded.id);
        if (!foodPartner) throw new ApiError(401, 'Account not found');
        return res.status(200).json({ role: 'food-partner', foodPartner });
    }

    throw new ApiError(401, 'Invalid session');
});

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner,
    updateUserProfile,
    updateFoodPartnerProfile,
    deleteUserAccount,
    getMe,
};
