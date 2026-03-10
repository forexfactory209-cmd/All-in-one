const pool = require('../config/database');

class NotificationController {
    // Basic standard response structure matching the backend
    sendResponse(res, statusCode, success, message, data = null) {
        return res.status(statusCode).json({ success, message, data });
    }

    sendError(res, statusCode, message, errors = null) {
        return res.status(statusCode).json({ success: false, message, errors });
    }

    async getUserNotifications(req, res) {
        try {
            const user_id = req.query.user_id || 1; // Assuming demo auth where user=1
            const [rows] = await pool.execute(`
                SELECT * FROM notifications 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT 50
            `, [user_id]);

            return this.sendResponse(res, 200, true, 'Notifications retrieved', rows);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    }

    async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.body.user_id || 1;

            const [result] = await pool.execute(`
                UPDATE notifications 
                SET read_at = CURRENT_TIMESTAMP 
                WHERE id = ? AND user_id = ?
            `, [id, user_id]);

            if (result.affectedRows === 0) {
                return this.sendError(res, 404, 'Notification not found or access denied');
            }

            return this.sendResponse(res, 200, true, 'Notification marked as read');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    }

    async markAllAsRead(req, res) {
        try {
            const user_id = req.body.user_id || 1;

            await pool.execute(`
                UPDATE notifications 
                SET read_at = CURRENT_TIMESTAMP 
                WHERE user_id = ? AND read_at IS NULL
            `, [user_id]);

            return this.sendResponse(res, 200, true, 'All notifications marked as read');
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    }
    async getUnreadCount(req, res) {
        try {
            const user_id = req.query.user_id || 1;

            const [rows] = await pool.execute(`
                SELECT COUNT(*) as unreadCount FROM notifications 
                WHERE user_id = ? AND read_at IS NULL
            `, [user_id]);

            const cnt = rows[0]?.unreadCount || 0;
            return this.sendResponse(res, 200, true, 'Unread count retrieved', { unreadCount: cnt });
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    }

    async getSettings(req, res) {
        try {
            const user_id = req.query.user_id || 1;

            const [rows] = await pool.execute(`
                SELECT * FROM notification_settings WHERE user_id = ?
            `, [user_id]);

            let settings = rows[0];

            if (!settings) {
                // Return default settings if no record
                settings = {
                    user_id,
                    push_enabled: 1,
                    sms_enabled: 0,
                    email_enabled: 1,
                    promotions_enabled: 0
                };
            }

            return this.sendResponse(res, 200, true, 'Settings retrieved', settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateSettings(req, res) {
        try {
            const user_id = req.body.user_id || 1;
            const { push_enabled, sms_enabled, email_enabled, promotions_enabled } = req.body;

            // Upsert the record
            await pool.execute(`
                INSERT INTO notification_settings (user_id, push_enabled, sms_enabled, email_enabled, promotions_enabled)
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    push_enabled = VALUES(push_enabled),
                    sms_enabled = VALUES(sms_enabled),
                    email_enabled = VALUES(email_enabled),
                    promotions_enabled = VALUES(promotions_enabled)
            `, [
                user_id,
                push_enabled !== undefined ? push_enabled : 1,
                sms_enabled !== undefined ? sms_enabled : 0,
                email_enabled !== undefined ? email_enabled : 1,
                promotions_enabled !== undefined ? promotions_enabled : 0
            ]);

            return this.sendResponse(res, 200, true, 'Settings updated');
        } catch (error) {
            console.error('Error updating settings:', error);
            return this.sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new NotificationController();
