const reportsService = require('./reports.service');
const { sendResponse, sendError } = require('../../utils/response');

class ReportsController {
    async getDashboardOverview(req, res) {
        try {
            const stats = await reportsService.getOverviewStats();
            const revenueTrend = await reportsService.getRevenueTrend();
            const highValueBookings = await reportsService.getHighValueBookings();
            const latestDisputes = await reportsService.getLatestDisputes();

            return sendResponse(res, 200, true, 'Dashboard data retrieved successfully', {
                stats,
                revenueTrend,
                highValueBookings,
                latestDisputes
            });
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async getRevenueTrend(req, res) {
        try {
            const data = await reportsService.getRevenueTrend(req.query.days);
            return sendResponse(res, 200, true, 'Revenue trend retrieved successfully', data);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async getAnalytics(req, res) {
        try {
            const { period = 'days', value = '30' } = req.query;
            const data = await reportsService.getAnalytics(period, Number(value));
            return sendResponse(res, 200, true, 'Analytics data retrieved successfully', data);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }
}

module.exports = new ReportsController();
