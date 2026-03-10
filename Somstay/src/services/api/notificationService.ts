import axios from 'axios';
import { NOTIFICATION_BASE_URL, API_TIMEOUT } from './endpoints';

const notificationClient = axios.create({
    baseURL: NOTIFICATION_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const notificationService = {
    getNotifications: async (userId: string = '1') => {
        const response = await notificationClient.get(`/notifications?user_id=${userId}`);
        return response.data;
    },

    markAsRead: async (notificationId: string, userId: string = '1') => {
        const response = await notificationClient.put(`/notifications/${notificationId}/read`, { user_id: userId });
        return response.data;
    },

    markAllAsRead: async (userId: string = '1') => {
        const response = await notificationClient.put(`/notifications/read-all`, { user_id: userId });
        return response.data;
    },

    getUnreadCount: async (userId: string = '1') => {
        const response = await notificationClient.get(`/notifications/unread-count?user_id=${userId}`);
        return response.data;
    },

    getSettings: async (userId: string = '1') => {
        const response = await notificationClient.get(`/notifications/settings?user_id=${userId}`);
        return response.data;
    },

    updateSettings: async (userId: string = '1', settings: any) => {
        const response = await notificationClient.put(`/notifications/settings`, { user_id: userId, ...settings });
        return response.data;
    }
};
