const express = require('express');
const router = express.Router();
const roomsController = require('./rooms.controller');

router.get('/', roomsController.getAllRooms);
router.get('/hotel/:hotelId', roomsController.getRoomsByHotelId);
router.get('/:id', roomsController.getRoomById);
router.post('/', roomsController.createRoom);
router.put('/:id', roomsController.updateRoom);
router.delete('/:id', roomsController.deleteRoom);

module.exports = router;
