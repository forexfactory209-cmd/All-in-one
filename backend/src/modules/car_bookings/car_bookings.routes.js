const express = require('express');
const router = express.Router();
const carBookingsController = require('./car_bookings.controller');

// Create a new car booking (Check availability + Transaction)
router.post('/', carBookingsController.createBooking);

// Get bookings for user
router.get('/my-bookings', carBookingsController.getUserBookings);

// Get all bookings (Admin)
router.get('/', carBookingsController.getAllBookings);

// Get a single car booking by ID
router.get('/:id', carBookingsController.getBookingById);

// Update status (Admin/Agent)
router.put('/:id/status', carBookingsController.updateBookingStatus);

// Check availability
router.post('/check-availability', carBookingsController.checkAvailability);

module.exports = router;
