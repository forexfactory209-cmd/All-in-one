import api from '../../../services/api';

/**
 * Settings Service - Pure API Bridge
 * All settings CRUD for the admin panel.
 */
export const settingsService = {

    /**
     * Fetch all settings grouped by category.
     */
    getAllSettings: async () => {
        const response = await api.get('/v1/settings');
        return response.data; // grouped object
    },

    /**
     * Fetch settings for a specific group.
     */
    getGroup: async (group) => {
        const response = await api.get(`/v1/settings/group/${group}`);
        return response.data;
    },

    /**
     * Update a single setting by key.
     */
    updateSetting: async (key, value) => {
        const response = await api.put(`/v1/settings/${key}`, { value });
        return response.data;
    },

    /**
     * Bulk update multiple settings at once.
     * @param {Object} settings - { key: value, ... }
     */
    bulkUpdate: async (settings) => {
        const response = await api.put('/v1/settings', { settings });
        return response.data;
    },

    /**
     * Reset all settings to factory defaults.
     */
    resetToDefaults: async () => {
        const response = await api.post('/v1/settings/reset');
        return response.data;
    }
};
