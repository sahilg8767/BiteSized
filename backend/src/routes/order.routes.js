const express = require('express');
const orderController = require('../controller/order.controller');
const { authUserMiddleware, authFoodPartnerMiddleware } = require('../middlewares/auth.middleware');

const router = express.Router();

// user
router.post('/', authUserMiddleware, orderController.createOrder);
router.get('/mine', authUserMiddleware, orderController.getMyOrders);

// food partner
router.get('/partner', authFoodPartnerMiddleware, orderController.getPartnerOrders);
router.patch('/:id/status', authFoodPartnerMiddleware, orderController.updateOrderStatus);

module.exports = router;
