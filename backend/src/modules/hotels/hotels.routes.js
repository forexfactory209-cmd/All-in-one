const express = require('express');
const router = express.Router();
const hotelsController = require('./hotels.controller');
const validate = require('../../middleware/validate.middleware');
const { hotelSchema } = require('../../utils/validation.schemas');

router.get('/', hotelsController.getAllHotels);
router.get('/locations', hotelsController.getLocations);
router.get('/search', hotelsController.searchHotels);
router.get('/:id', hotelsController.getHotelById);
router.post('/', validate(hotelSchema), hotelsController.createHotel);
router.put('/:id', validate(hotelSchema), hotelsController.updateHotel);
router.delete('/:id', hotelsController.deleteHotel);

module.exports = router;
