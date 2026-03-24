const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', auth, adminOnly, orderController.getAllOrders);
router.get('/my-orders', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);
router.get('/:id/invoice', auth, orderController.generateInvoice);
router.post('/', auth, orderController.createOrder);
router.put('/:id/status', auth, adminOnly, orderController.updateOrderStatus);
router.put('/:id/cancel', auth, orderController.cancelOrder);

module.exports = router;
