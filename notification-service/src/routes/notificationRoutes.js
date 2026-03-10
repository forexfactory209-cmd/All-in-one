const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Get all notifications for the current user (e.g., query ?user_id=1)
router.get('/', notificationController.getUserNotifications);

// Get unread notification count
router.get('/unread-count', notificationController.getUnreadCount);

// Mark a specific notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all as read
router.put('/read-all', notificationController.markAllAsRead);

// Notification Settings
router.get('/settings', notificationController.getSettings);
router.put('/settings', notificationController.updateSettings);

module.exports = router;
