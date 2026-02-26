const express = require('express');
const router = express.Router();
const settingsController = require('./settings.controller');

/**
 * Settings Routes
 * Prefix: /api/v1/settings
 */

// GET all settings grouped
router.get('/', settingsController.getAll);

// GET settings for a specific group (e.g. /api/v1/settings/group/general)
router.get('/group/:group', settingsController.getGroup);

// PUT bulk update settings
router.put('/', settingsController.bulkUpdate);

// PUT update a single setting by key
router.put('/:key', settingsController.updateOne);

// POST reset all settings to defaults
router.post('/reset', settingsController.resetDefaults);

module.exports = router;
