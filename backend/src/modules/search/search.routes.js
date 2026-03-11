const express = require('express');
const router = express.Router();
const controller = require('./search.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

/**
 * 💡 Search API (Discovery & Availability)
 * Target: /api/v1/search
 * Target Performance: < 200ms
 * Features: Pagination, Filtering, Sorting, Price ranges, Rating, Real-time availability
 */
router.get('/', cacheMiddleware(60), (req, res) => controller.unifiedSearch(req, res));

/**
 * 💡 Availability API
 * Target: /api/v1/availability
 * Real-time availability check (< 80ms)
 * Important: Availability is real-time, NEVER cache for long. (Use much shorter TTL or NO cache)
 */
router.get('/availability', cacheMiddleware(5), (req, res) => controller.getAvailability(req, res));

module.exports = router;
