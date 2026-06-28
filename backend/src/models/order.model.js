const mongoose = require('mongoose');

// A line item is denormalised (name + price captured at order time) so the
// order history stays correct even if the dish is later edited or deleted.
const orderItemSchema = new mongoose.Schema(
    {
        food: { type: mongoose.Schema.Types.ObjectId, ref: 'food', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    },
    { _id: false }
);

const ORDER_STATUSES = ['placed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        // Carts are single-partner (like Swiggy/Zomato), so one partner owns the order.
        foodPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'foodpartner',
            required: true,
        },
        items: {
            type: [orderItemSchema],
            validate: [(v) => v.length > 0, 'An order needs at least one item'],
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        deliveryAddress: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ORDER_STATUSES,
            default: 'placed',
        },
    },
    { timestamps: true }
);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ foodPartner: 1, createdAt: -1 });

const orderModel = mongoose.model('order', orderSchema);
orderModel.STATUSES = ORDER_STATUSES;
module.exports = orderModel;
