const settingsService = require('./settings.service');
const { sendResponse, sendError } = require('../../utils/response');

/**
 * Settings Controller
 * Handles HTTP request/response cycle.
 */
const settingsController = {

    /**
     * GET /api/v1/settings
     * Returns all settings grouped by category.
     */
    async getAll(req, res) {
        try {
            const settings = await settingsService.getAllGrouped();
            return sendResponse(res, 200, true, 'Settings retrieved successfully', settings);
        } catch (error) {
            console.error('[Settings] getAll error:', error);
            return sendError(res, 500, 'Failed to retrieve settings', error.message);
        }
    },

    /**
     * GET /api/v1/settings/:group
     * Returns settings for a specific group.
     */
    async getGroup(req, res) {
        try {
            const { group } = req.params;
            const settings = await settingsService.getGroup(group);
            return sendResponse(res, 200, true, `Settings for group "${group}" retrieved`, settings);
        } catch (error) {
            console.error('[Settings] getGroup error:', error);
            return sendError(res, 500, 'Failed to retrieve settings group', error.message);
        }
    },

    /**
     * PUT /api/v1/settings/:key
     * Updates a single setting value.
     * Body: { value: "..." }
     */
    async updateOne(req, res) {
        try {
            const { key } = req.params;
            const { value } = req.body;
            if (value === undefined || value === null) {
                return sendError(res, 400, 'Missing required field: value');
            }
            const updated = await settingsService.updateSetting(key, String(value));
            return sendResponse(res, 200, true, 'Setting updated successfully', updated);
        } catch (error) {
            console.error('[Settings] updateOne error:', error);
            if (error.message.includes('not found')) {
                return sendError(res, 404, error.message);
            }
            return sendError(res, 500, 'Failed to update setting', error.message);
        }
    },

    /**
     * PUT /api/v1/settings
     * Bulk update multiple settings at once.
     * Body: { settings: { key1: value1, key2: value2, ... } }
     */
    async bulkUpdate(req, res) {
        try {
            const { settings } = req.body;
            if (!settings || typeof settings !== 'object') {
                return sendError(res, 400, 'Invalid body: expected { settings: { ... } }');
            }
            const results = await settingsService.bulkUpdate(settings);
            return sendResponse(res, 200, true, 'Settings updated successfully', results);
        } catch (error) {
            console.error('[Settings] bulkUpdate error:', error);
            return sendError(res, 500, 'Failed to bulk update settings', error.message);
        }
    },

    /**
     * POST /api/v1/settings/reset
     * Resets ALL settings to factory defaults.
     */
    async resetDefaults(req, res) {
        try {
            const settings = await settingsService.resetToDefaults();
            return sendResponse(res, 200, true, 'All settings have been reset to defaults', settings);
        } catch (error) {
            console.error('[Settings] resetDefaults error:', error);
            return sendError(res, 500, 'Failed to reset settings', error.message);
        }
    }
};

module.exports = settingsController;
