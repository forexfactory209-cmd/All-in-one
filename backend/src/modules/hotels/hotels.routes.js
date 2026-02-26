const express = require('express');
const router = express.Router();
const hotelsController = require('./hotels.controller');

router.get('/', hotelsController.getAllHotels);
router.get('/:id', hotelsController.getHotelById);
router.post('/', hotelsController.createHotel);
router.put('/:id', hotelsController.updateHotel);
router.delete('/:id', hotelsController.deleteHotel);

module.exports = router;
