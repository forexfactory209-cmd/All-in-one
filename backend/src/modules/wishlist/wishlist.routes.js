const express = require('express');
const router = express.Router();
const wishlistController = require('./wishlist.controller');
// const { protect } = require('../../middleware/auth.middleware');

// Note: Protection is commented out until auth is fully validated, but should be used in prod
router.get('/', wishlistController.getMyWishlist);
router.post('/toggle', wishlistController.toggle);

module.exports = router;
