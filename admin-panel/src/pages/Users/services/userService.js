import api from '../../../services/api';

/**
 * User Service - Pure API Bridge
 * Manages Guest and Host accounts.
 */
export const userService = {
    // Fetch all users
    getAllUsers: async () => {
        const response = await api.get('/v1/users');
        return response.data;
    },

    // Fetch user details
    getUserById: async (id) => {
        const response = await api.get(`/v1/users/${id}`);
        return response.data;
    },

    // Add new user
    addUser: async (userData) => {
        return await api.post('/v1/users', userData);
    },

    // Update user profile
    updateUser: async (id, userData) => {
        return await api.put(`/v1/users/${id}`, userData);
    },

    // Delete user
    deleteUser: async (id) => {
        return await api.delete(`/v1/users/${id}`);
    }
};
