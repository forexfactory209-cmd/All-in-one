const reportsRepository = require('./reports.repository');
const disputesService = require('../disputes/disputes.service');

class ReportsService {
    async getOverviewStats() {
        const stats = await reportsRepository.getSystemStats();

        // Calculate growth percentage
        const current = stats.growth_revenue.current_month || 0;
        const prev = stats.growth_revenue.prev_month || 0;
        let growth = 0;
        if (prev > 0) {
            growth = ((current - prev) / prev) * 100;
        } else if (current > 0) {
            growth = 100;
        }

        return {
            revenue: {
                value: stats.total_revenue.total || 0,
                growth: growth.toFixed(1) + '%'
            },
            bookings: {
                value: stats.total_bookings.total || 0,
                pending_payments: stats.pending_payments.total || 0
            },
            properties: {
                active: stats.active_properties.total || 0
            }
        };
    }

    async getRevenueTrend(days = 30) {
        const rawData = await reportsRepository.getRevenueData(days);

        // Fill in missing days with zero revenue
        const trend = [];
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const existingEntry = rawData.find(d => {
                const dDate = new Date(d.date);
                return dDate.toISOString().split('T')[0] === dateStr;
            });

            trend.push({
                date: dateStr,
                revenue: existingEntry ? existingEntry.revenue : 0,
                booking_count: existingEntry ? existingEntry.booking_count : 0
            });
        }

        return trend;
    }

    async getHighValueBookings() {
        return await reportsRepository.getHighValueBookings();
    }

    async getLatestDisputes(limit = 5) {
        const disputes = await disputesService.getAllDisputes();
        return disputes.slice(0, limit);
    }

    // Full analytics data for analytics page
    async getAnalytics(period = 'days', value = 30) {
        const v = Number(value);

        const [bookingStats, propertyPerformance, paymentBreakdown, topGuests, comparison] = await Promise.all([
            reportsRepository.getBookingStats(period, v),
            reportsRepository.getPropertyPerformance(10),
            reportsRepository.getPaymentBreakdown(period, v),
            reportsRepository.getTopGuests(period, v, 8),
            reportsRepository.getPeriodComparison(period, v)
        ]);

        // Build revenue trend based on period
        let revenueTrend = [];
        if (period === 'months') {
            revenueTrend = await reportsRepository.getRevenueByMonth(v);
        } else if (period === 'years') {
            revenueTrend = await reportsRepository.getRevenueByYear(v);
        } else {
            revenueTrend = await reportsRepository.getRevenueData(v);
            // fill missing days
            const filled = [];
            const now = new Date();
            for (let i = v - 1; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const found = revenueTrend.find(d => {
                    const dd = new Date(d.date);
                    return dd.toISOString().split('T')[0] === dateStr;
                });
                filled.push({
                    label: dateStr,
                    period: dateStr,
                    revenue: found ? Number(found.revenue) : 0,
                    booking_count: found ? Number(found.booking_count) : 0
                });
            }
            revenueTrend = filled;
        }

        // Compute KPI growth
        const calcGrowth = (curr, prev) => {
            if (!prev || prev === 0) return curr > 0 ? 100 : 0;
            return (((curr - prev) / prev) * 100).toFixed(1);
        };

        const kpis = {
            totalRevenue: {
                value: Number(comparison.current.revenue) || 0,
                growth: calcGrowth(Number(comparison.current.revenue), Number(comparison.prev.revenue))
            },
            totalBookings: {
                value: Number(comparison.current.bookings) || 0,
                growth: calcGrowth(Number(comparison.current.bookings), Number(comparison.prev.bookings))
            },
            paymentsCollected: {
                value: Number(comparison.current.payments_collected) || 0,
                growth: calcGrowth(Number(comparison.current.payments_collected), Number(comparison.prev.payments_collected))
            }
        };

        return {
            kpis,
            revenueTrend,
            bookingStats,
            propertyPerformance,
            paymentBreakdown,
            topGuests
        };
    }
}

module.exports = new ReportsService();
