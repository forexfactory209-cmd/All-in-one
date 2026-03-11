const express = require('express');
const router = express.Router();
const searchController = require('../search/search.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

/**
 * 💡 Availability API
 * Target: /api/v1/availability
 * Real-time availability check (< 80ms)
 * Important: Real-time data, cache TTL is very short (5s) for peak performance without stale data.
 */
router.get('/', cacheMiddleware(5), searchController.getAvailability);

module.exports = router;
