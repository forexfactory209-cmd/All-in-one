const express = require('express');
const router = express.Router();
const wishlistController = require('./wishlist.controller');
// const { protect } = require('../../middleware/auth.middleware');

const cacheMiddleware = require('../../middleware/cache.middleware');

// Note: Protection is commented out until auth is fully validated, but should be used in prod
router.get('/', cacheMiddleware(60), wishlistController.getMyWishlist);
router.post('/toggle', wishlistController.toggle);

module.exports = router;
