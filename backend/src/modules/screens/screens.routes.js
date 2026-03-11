const express = require('express');
const router = express.Router();
const controller = require('./screens.controller');
const cacheMiddleware = require('../../middleware/cache.middleware');

// Apply Redis caching for 60 seconds to all screen endpoints
router.use(cacheMiddleware(60));

/**             
 * @route   GET /api/v1/screens/home-screen
 * @desc    Aggregate all data needed for the mobile home/main screen
 */
router.get('/home-screen', (req, res) => controller.getHome(req, res));

/**
 * @route   GET /api/v1/screens/search-results
 * @desc    Aggregate search results + filter lists + user specific context
 */
router.get('/search-results', (req, res) => controller.getSearch(req, res));

/**
 * @route   GET /api/v1/screens/hotel-details/:hotelId
 * @desc    Aggregate hotel info, room lists, recent reviews and suggestions
 */
router.get('/hotel-details/:hotelId', (req, res) => controller.getHotelDetail(req, res));

/**
 * @route   GET /api/v1/screens/booking-summary/:bookingId
 * @desc    Aggregate booking details, payment status and support policies
 */
router.get('/booking-summary/:bookingId', (req, res) => controller.getBookingSummary(req, res));

module.exports = router;
