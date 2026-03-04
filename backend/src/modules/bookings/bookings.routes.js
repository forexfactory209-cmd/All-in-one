const express = require('express');
const router = express.Router();
const bookingsController = require('./bookings.controller');
const validate = require('../../middleware/validate.middleware');
const { bookingSchema } = require('../../utils/validation.schemas');

router.get('/', (req, res) => bookingsController.getAll(req, res));
router.post('/', validate(bookingSchema), (req, res) => bookingsController.create(req, res));
router.get('/user/:userId', (req, res) => bookingsController.getMyBookings(req, res));
router.get('/:id', (req, res) => bookingsController.getDetails(req, res));
router.put('/:id', validate(bookingSchema.partial()), (req, res) => bookingsController.update(req, res));
router.put('/:id/status', (req, res) => bookingsController.updateStatus(req, res));
router.delete('/:id', (req, res) => bookingsController.delete(req, res));

module.exports = router;
