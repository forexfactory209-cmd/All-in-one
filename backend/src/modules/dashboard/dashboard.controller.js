const dashboardService = require('./dashboard.service');
const { sendResponse, sendError } = require('../../utils/response');

class DashboardController {
    /**
     * GET /api/v1/dashboard
     * Aggregated endpoint to fetch everything in one go.
     */
    async getDashboard(req, res) {
        try {
            // In a real app, userId would come from JWT (req.user.id)
            const userId = req.query.user_id || 1;

            const data = await dashboardService.getDashboardData(userId);

            return sendResponse(res, 200, true, 'Dashboard data fetched successfully! 🚀', data);
        } catch (error) {
            console.error('DashboardController Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }
}

module.exports = new DashboardController();
