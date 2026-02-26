const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');

router.get('/dashboard', reportsController.getDashboardOverview);
router.get('/revenue-trend', reportsController.getRevenueTrend);
router.get('/analytics', reportsController.getAnalytics);

module.exports = router;
