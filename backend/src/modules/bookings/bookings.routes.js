const express = require('express');
const router = express.Router();
const bookingsController = require('./bookings.controller');

router.get('/', (req, res) => bookingsController.getAll(req, res));
router.post('/', (req, res) => bookingsController.create(req, res));
router.get('/user/:userId', (req, res) => bookingsController.getMyBookings(req, res));
router.get('/:id', (req, res) => bookingsController.getDetails(req, res));
router.put('/:id', (req, res) => bookingsController.update(req, res));
router.put('/:id/status', (req, res) => bookingsController.updateStatus(req, res));
router.delete('/:id', (req, res) => bookingsController.delete(req, res));

module.exports = router;
