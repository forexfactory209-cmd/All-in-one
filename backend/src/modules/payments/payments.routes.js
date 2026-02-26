const express = require('express');
const router = express.Router();
const paymentsController = require('./payments.controller');

// Matches /api/v1/payments/
router.get('/', (req, res) => paymentsController.getAll(req, res));
router.get('/:id', (req, res) => paymentsController.getDetails(req, res));
router.post('/verify/:id', (req, res) => paymentsController.verify(req, res));

module.exports = router;
