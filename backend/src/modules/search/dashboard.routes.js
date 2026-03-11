const express = require('express');
const router = express.Router();
const controller = require('../screens/screens.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

/**
 * 💡 User Dashboard (Aggregation)
 * Target: /api/v1/dashboard
 * Aggregates: Recent bookings, Wishlist, Recommendations, Pending reviews, Notifications
 * Uses parallel fetching (Promise.all)
 */
router.get('/', cacheMiddleware(60), (req, res) => controller.getDashboard(req, res));

module.exports = router;
