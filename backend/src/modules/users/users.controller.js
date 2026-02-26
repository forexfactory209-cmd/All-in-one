const usersService = require('./users.service');
const { sendResponse, sendError } = require('../../utils/response');

class UsersController {
    async getAll(req, res) {
        try {
            const users = await usersService.getAllUsers();
            return sendResponse(res, 200, true, 'Users retrieved successfully', users);
        } catch (error) {
            console.error('Error fetching users:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getProfile(req, res) {
        try {
            // In a real app, the user ID would come from the JWT token (req.user.id)
            const id = req.params.id;
            const user = await usersService.getUserById(id);
            if (!user) {
                return sendError(res, 404, 'User profile not found');
            }
            return sendResponse(res, 200, true, 'Profile retrieved successfully', user);
        } catch (error) {
            console.error('Error fetching profile:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateProfile(req, res) {
        try {
            const id = req.params.id;
            const updated = await usersService.updateUser(id, req.body);
            if (!updated) {
                return sendError(res, 404, 'User not found or no changes made');
            }
            return sendResponse(res, 200, true, 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async create(req, res) {
        try {
            console.log('Incoming user creation payload:', req.body);
            const userId = await usersService.createUser(req.body);
            return sendResponse(res, 201, true, 'User created successfully', { id: userId });
        } catch (error) {
            console.error('CRITICAL: Error creating user:', error);
            return sendError(res, 500, error.message || 'Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deleted = await usersService.deleteUser(id);
            if (!deleted) {
                return sendError(res, 404, 'User not found');
            }
            return sendResponse(res, 200, true, 'User deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new UsersController();
