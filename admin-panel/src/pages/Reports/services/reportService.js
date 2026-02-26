import api from '../../../services/api';

class ReportService {
    async getDashboardStats() {
        try {
            const response = await api.get('/v1/reports/dashboard');
            return response.data;
        } catch (error) {
            console.error("Error fetching dashboard analytics:", error);
            throw error;
        }
    }

    async getRevenueTrend(days = 30) {
        try {
            const response = await api.get(`/v1/reports/revenue-trend?days=${days}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching revenue trend:", error);
            throw error;
        }
    }

    async getAnalytics(period = 'days', value = 30) {
        try {
            const response = await api.get(`/v1/reports/analytics?period=${period}&value=${value}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching analytics data:", error);
            throw error;
        }
    }
}

export const reportService = new ReportService();
