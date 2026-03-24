const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/stats', auth, adminOnly, dashboardController.getDashboardStats);
router.get('/inventory', auth, adminOnly, dashboardController.getInventoryStats);

module.exports = router;
