const pool = require('../../config/database');

/**
 * Settings Repository
 * Raw SQL data layer for system settings stored in DB.
 * Uses a key-value store pattern in the `system_settings` table.
 */

const settingsRepository = {

    /**
     * Ensure the settings table exists on first use.
     */
    async ensureTable() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS system_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                setting_key VARCHAR(100) NOT NULL UNIQUE,
                setting_value TEXT,
                setting_group VARCHAR(50) NOT NULL DEFAULT 'general',
                label VARCHAR(150),
                description TEXT,
                value_type ENUM('string', 'boolean', 'number', 'json') DEFAULT 'string',
                is_public TINYINT(1) DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
    },

    /**
     * Fetch all settings, optionally filtered by group.
     */
    async getAll(group = null) {
        await this.ensureTable();
        let query = 'SELECT * FROM system_settings';
        const params = [];
        if (group) {
            query += ' WHERE setting_group = ?';
            params.push(group);
        }
        query += ' ORDER BY setting_group, setting_key';
        const [rows] = await pool.query(query, params);
        return rows;
    },

    /**
     * Fetch a single setting by key.
     */
    async getByKey(key) {
        await this.ensureTable();
        const [rows] = await pool.query(
            'SELECT * FROM system_settings WHERE setting_key = ?',
            [key]
        );
        return rows[0] || null;
    },

    /**
     * Upsert (insert or update) a setting value.
     */
    async upsert(key, value, group = 'general', label = null, description = null, valueType = 'string', isPublic = 0) {
        await this.ensureTable();
        await pool.query(`
            INSERT INTO system_settings (setting_key, setting_value, setting_group, label, description, value_type, is_public)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                setting_value = VALUES(setting_value),
                setting_group = VALUES(setting_group),
                label = COALESCE(VALUES(label), label),
                description = COALESCE(VALUES(description), description),
                value_type = VALUES(value_type),
                is_public = VALUES(is_public),
                updated_at = CURRENT_TIMESTAMP
        `, [key, value, group, label, description, valueType, isPublic]);
    },

    /**
     * Bulk upsert multiple settings at once.
     * Expects array of { key, value, group, label, description, valueType, isPublic }
     */
    async bulkUpsert(settingsArray) {
        await this.ensureTable();
        for (const s of settingsArray) {
            await this.upsert(
                s.key, s.value,
                s.group || 'general',
                s.label || null,
                s.description || null,
                s.value_type || 'string',
                s.is_public !== undefined ? s.is_public : 0
            );
        }
    },

    /**
     * Delete a setting by key (admin only).
     */
    async deleteByKey(key) {
        await this.ensureTable();
        const [result] = await pool.query(
            'DELETE FROM system_settings WHERE setting_key = ?',
            [key]
        );
        return result.affectedRows;
    },

    /**
     * Seed default settings if the table is empty.
     */
    async seedDefaults() {
        await this.ensureTable();
        const [rows] = await pool.query('SELECT COUNT(*) AS cnt FROM system_settings');
        if (rows[0].cnt > 0) return; // Already seeded

        const defaults = [
            // General
            { key: 'site_name', value: 'Somstay', group: 'general', label: 'Platform Name', description: 'The name displayed throughout the platform', value_type: 'string', is_public: 1 },
            { key: 'site_tagline', value: 'Your Premium Stay in Somaliland', group: 'general', label: 'Tagline', description: 'Short slogan shown on the landing page', value_type: 'string', is_public: 1 },
            { key: 'support_email', value: 'support@somstay.com', group: 'general', label: 'Support Email', description: 'Primary customer support email', value_type: 'string', is_public: 1 },
            { key: 'support_phone', value: '+252 63 000 0000', group: 'general', label: 'Support Phone', description: 'Primary support phone number', value_type: 'string', is_public: 1 },
            { key: 'default_currency', value: 'USD', group: 'general', label: 'Default Currency', description: 'Currency used for all pricing', value_type: 'string', is_public: 1 },
            { key: 'timezone', value: 'Africa/Nairobi', group: 'general', label: 'Timezone', description: 'Server and display timezone', value_type: 'string', is_public: 0 },
            // Booking
            { key: 'min_booking_days', value: '1', group: 'booking', label: 'Minimum Stay (nights)', description: 'Minimum number of nights per booking', value_type: 'number', is_public: 1 },
            { key: 'max_booking_days', value: '30', group: 'booking', label: 'Maximum Stay (nights)', description: 'Maximum number of nights per booking', value_type: 'number', is_public: 1 },
            { key: 'cancellation_hours', value: '24', group: 'booking', label: 'Cancellation Window (hours)', description: 'Hours before check-in that cancellations are allowed', value_type: 'number', is_public: 1 },
            { key: 'auto_confirm_bookings', value: 'false', group: 'booking', label: 'Auto-confirm Bookings', description: 'Automatically confirm bookings upon payment', value_type: 'boolean', is_public: 0 },
            // Payments
            { key: 'zaad_merchant_id', value: '', group: 'payments', label: 'ZAAD Merchant ID', description: 'Your ZAAD payment gateway merchant ID', value_type: 'string', is_public: 0 },
            { key: 'edahab_merchant_id', value: '', group: 'payments', label: 'eDahab Merchant ID', description: 'Your eDahab payment gateway merchant ID', value_type: 'string', is_public: 0 },
            { key: 'platform_fee_percent', value: '10', group: 'payments', label: 'Platform Fee (%)', description: 'Percentage charged on each booking as platform revenue', value_type: 'number', is_public: 0 },
            { key: 'tax_rate_percent', value: '0', group: 'payments', label: 'Tax Rate (%)', description: 'Tax rate applied to bookings', value_type: 'number', is_public: 1 },
            // Notifications
            { key: 'email_notifications', value: 'true', group: 'notifications', label: 'Email Notifications', description: 'Send email alerts for bookings and payments', value_type: 'boolean', is_public: 0 },
            { key: 'sms_notifications', value: 'true', group: 'notifications', label: 'SMS Notifications', description: 'Send SMS alerts for bookings', value_type: 'boolean', is_public: 0 },
            { key: 'push_notifications', value: 'true', group: 'notifications', label: 'Push Notifications', description: 'Send push notifications to mobile app users', value_type: 'boolean', is_public: 0 },
            { key: 'notify_admin_on_booking', value: 'true', group: 'notifications', label: 'Notify Admin on New Booking', description: 'Send an alert to admin when a new booking is made', value_type: 'boolean', is_public: 0 },
            // Security
            { key: 'require_email_verification', value: 'true', group: 'security', label: 'Require Email Verification', description: 'Users must verify email before booking', value_type: 'boolean', is_public: 0 },
            { key: 'session_timeout_hours', value: '24', group: 'security', label: 'Session Timeout (hours)', description: 'JWT token expiry in hours', value_type: 'number', is_public: 0 },
            { key: 'max_login_attempts', value: '5', group: 'security', label: 'Max Login Attempts', description: 'Number of failed logins before account lock', value_type: 'number', is_public: 0 },
            { key: 'maintenance_mode', value: 'false', group: 'security', label: 'Maintenance Mode', description: 'Put the platform into maintenance mode (disables public access)', value_type: 'boolean', is_public: 0 },
        ];

        for (const d of defaults) {
            await this.upsert(d.key, d.value, d.group, d.label, d.description, d.value_type, d.is_public);
        }
    }
};

module.exports = settingsRepository;
