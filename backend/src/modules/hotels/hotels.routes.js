const express = require('express');
const router = express.Router();
const hotelsController = require('./hotels.controller');
const validate = require('../../middleware/validate.middleware');
const { hotelSchema } = require('../../utils/validation.schemas');

const cacheMiddleware = require('../../middleware/cache.middleware');

router.get('/', hotelsController.getAllHotels);
router.get('/locations', cacheMiddleware(3600), hotelsController.getLocations);
router.get('/search', cacheMiddleware(120), hotelsController.searchHotels);
router.get('/:id', cacheMiddleware(300), hotelsController.getHotelById);

// Specialized/Lazy endpoints
router.get('/:id/basic', cacheMiddleware(300), hotelsController.getHotelBasic);
router.get('/:id/rooms', cacheMiddleware(120), hotelsController.getHotelRooms);
router.get('/:id/reviews', cacheMiddleware(120), hotelsController.getHotelReviews);

router.post('/', validate(hotelSchema), hotelsController.createHotel);
router.put('/:id', validate(hotelSchema), hotelsController.updateHotel);
router.delete('/:id', hotelsController.deleteHotel);

module.exports = router;
