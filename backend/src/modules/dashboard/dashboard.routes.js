const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

/**
 * @route   GET /api/v1/dashboard
 * @desc    Aggregate all-in-one data for the mobile UI
 * @access  Public (for now)
 */
router.get('/', (req, res) => dashboardController.getDashboard(req, res));

module.exports = router;
