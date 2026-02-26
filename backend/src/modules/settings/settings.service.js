const settingsRepository = require('./settings.repository');

/**
 * Settings Service
 * Business logic layer for system settings.
 */
const settingsService = {

    /**
     * Get all settings grouped by category.
     */
    async getAllGrouped() {
        await settingsRepository.seedDefaults();
        const rows = await settingsRepository.getAll();
        // Group them into an object keyed by group name
        const grouped = {};
        for (const row of rows) {
            if (!grouped[row.setting_group]) {
                grouped[row.setting_group] = [];
            }
            grouped[row.setting_group].push({
                key: row.setting_key,
                value: row.setting_value,
                label: row.label,
                description: row.description,
                value_type: row.value_type,
                is_public: row.is_public,
                updated_at: row.updated_at
            });
        }
        return grouped;
    },

    /**
     * Get all settings as flat list for a specific group.
     */
    async getGroup(group) {
        await settingsRepository.seedDefaults();
        return settingsRepository.getAll(group);
    },

    /**
     * Update a single setting.
     */
    async updateSetting(key, value) {
        const existing = await settingsRepository.getByKey(key);
        if (!existing) {
            throw new Error(`Setting key "${key}" not found.`);
        }
        await settingsRepository.upsert(
            key, value,
            existing.setting_group,
            existing.label,
            existing.description,
            existing.value_type,
            existing.is_public
        );
        return settingsRepository.getByKey(key);
    },

    /**
     * Bulk-update settings from a flat { key: value } map.
     * Only updates settings that already exist (no new key creation from frontend).
     */
    async bulkUpdate(updates) {
        await settingsRepository.seedDefaults();
        const results = [];
        for (const [key, value] of Object.entries(updates)) {
            const existing = await settingsRepository.getByKey(key);
            if (existing) {
                await settingsRepository.upsert(
                    key, String(value),
                    existing.setting_group,
                    existing.label,
                    existing.description,
                    existing.value_type,
                    existing.is_public
                );
                results.push({ key, updated: true });
            } else {
                results.push({ key, updated: false, reason: 'Key not found' });
            }
        }
        return results;
    },

    /**
     * Reset a single setting to its default value.
     */
    async resetToDefaults() {
        // Drop all rows and re-seed
        await settingsRepository.ensureTable();
        const pool = require('../../config/database');
        await pool.query('DELETE FROM system_settings');
        await settingsRepository.seedDefaults();
        return this.getAllGrouped();
    }
};

module.exports = settingsService;
