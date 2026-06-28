const orderModel = require('../models/order.model');
const foodModel = require('../models/food.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// POST /api/orders  (user only)
// Body: { items: [{ food, quantity }], deliveryAddress }
// Prices and the partner are resolved server-side — never trusted from client.
const createOrder = asyncHandler(async (req, res) => {
    const { items, deliveryAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, 'Your cart is empty');
    }
    if (!deliveryAddress || !deliveryAddress.trim()) {
        throw new ApiError(400, 'Delivery address is required');
    }

    const foodIds = items.map((i) => i.food);
    const foods = await foodModel.find({ _id: { $in: foodIds } }).lean();
    const foodMap = new Map(foods.map((f) => [String(f._id), f]));

    const orderItems = [];
    let totalAmount = 0;
    let partnerId = null;

    for (const item of items) {
        const food = foodMap.get(String(item.food));
        if (!food) throw new ApiError(404, 'One of the items is no longer available');

        const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

        // enforce single-partner carts
        if (partnerId && String(food.foodPartner) !== String(partnerId)) {
            throw new ApiError(400, 'All items must be from the same restaurant');
        }
        partnerId = food.foodPartner;

        orderItems.push({ food: food._id, name: food.name, price: food.price, quantity });
        totalAmount += food.price * quantity;
    }

    const order = await orderModel.create({
        user: req.user._id,
        foodPartner: partnerId,
        items: orderItems,
        totalAmount,
        deliveryAddress: deliveryAddress.trim(),
    });

    res.status(201).json({ message: 'Order placed successfully', order });
});

// GET /api/orders/mine  (user only)
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await orderModel
        .find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .populate('foodPartner', 'name address')
        .lean();

    res.status(200).json({ message: 'Orders fetched', orders });
});

// GET /api/orders/partner  (food partner only) — incoming orders
const getPartnerOrders = asyncHandler(async (req, res) => {
    const orders = await orderModel
        .find({ foodPartner: req.foodPartner._id })
        .sort({ createdAt: -1 })
        .populate('user', 'fullName email')
        .lean();

    res.status(200).json({ message: 'Orders fetched', orders });
});

// PATCH /api/orders/:id/status  (food partner only)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!orderModel.STATUSES.includes(status)) {
        throw new ApiError(400, 'Invalid status');
    }

    const order = await orderModel.findById(req.params.id);
    if (!order) throw new ApiError(404, 'Order not found');
    if (String(order.foodPartner) !== String(req.foodPartner._id)) {
        throw new ApiError(403, 'You can only update your own orders');
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: 'Order status updated', order });
});

module.exports = {
    createOrder,
    getMyOrders,
    getPartnerOrders,
    updateOrderStatus,
};
