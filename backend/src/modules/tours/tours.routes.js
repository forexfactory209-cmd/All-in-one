const express = require('express');
const toursController = require('./tours.controller');

const router = express.Router();

router.get('/', toursController.getAllTours);
router.get('/:id', toursController.getTourById);
router.post('/', toursController.createTour);
router.put('/:id', toursController.updateTour);
router.delete('/:id', toursController.deleteTour);

module.exports = router;
