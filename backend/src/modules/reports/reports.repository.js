const pool = require('../../config/database');

class ReportsRepository {
    async getRevenueData(days = 30) {
        const [rows] = await pool.query(`
            SELECT 
                DATE(created_at) as date,
                SUM(amount) as revenue,
                COUNT(id) as booking_count
            FROM payments
            WHERE status = 'Success' 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `, [Number(days)]);
        return rows;
    }

    async getRevenueByMonth(months = 12) {
        const [rows] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m') as period,
                DATE_FORMAT(created_at, '%b %Y') as label,
                SUM(amount) as revenue,
                COUNT(id) as booking_count
            FROM payments
            WHERE status = 'Success' 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
            ORDER BY period ASC
        `, [Number(months)]);
        return rows;
    }

    async getRevenueByYear(years = 3) {
        const [rows] = await pool.query(`
            SELECT 
                YEAR(created_at) as period,
                YEAR(created_at) as label,
                SUM(amount) as revenue,
                COUNT(id) as booking_count
            FROM payments
            WHERE status = 'Success' 
            AND created_at >= DATE_SUB(NOW(), INTERVAL ? YEAR)
            GROUP BY YEAR(created_at)
            ORDER BY period ASC
        `, [Number(years)]);
        return rows;
    }

    async getSystemStats() {
        const queries = {
            total_revenue: "SELECT SUM(amount) as total FROM payments WHERE status = 'Success'",
            total_bookings: "SELECT COUNT(*) as total FROM bookings",
            active_properties: "SELECT COUNT(*) as total FROM properties WHERE status = 'available' OR status = 'Active'",
            pending_payments: "SELECT COUNT(*) as total FROM payments WHERE status = 'Pending'",
            growth_revenue: `
                SELECT 
                    (SELECT SUM(amount) FROM payments WHERE status = 'Success' AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)) as current_month,
                    (SELECT SUM(amount) FROM payments WHERE status = 'Success' AND created_at BETWEEN DATE_SUB(NOW(), INTERVAL 60 DAY) AND DATE_SUB(NOW(), INTERVAL 30 DAY)) as prev_month
            `
        };

        const results = {};
        for (const [key, sql] of Object.entries(queries)) {
            const [rows] = await pool.query(sql);
            results[key] = rows[0];
        }

        return results;
    }

    async getHighValueBookings(limit = 5) {
        const [rows] = await pool.query(`
            SELECT 
                b.*, u.full_name as guest_name,
                COALESCE(p.name, CONCAT('Room ', b.entity_id)) as property_title,
                COALESCE(p.location, 'N/A') as property_city
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            LEFT JOIN properties p ON b.entity_id = p.id AND b.entity_type = 'Property'
            ORDER BY b.total_price DESC
            LIMIT ?
        `, [Number(limit)]);
        return rows;
    }

    // Analytics: get booking stats by period
    async getBookingStats(period = 'days', value = 30) {
        let groupBy, labelFormat, interval;

        if (period === 'months') {
            groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
            labelFormat = "DATE_FORMAT(created_at, '%b %Y')";
            interval = `INTERVAL ${Number(value)} MONTH`;
        } else if (period === 'years') {
            groupBy = "YEAR(created_at)";
            labelFormat = "YEAR(created_at)";
            interval = `INTERVAL ${Number(value)} YEAR`;
        } else {
            groupBy = "DATE(created_at)";
            labelFormat = "DATE(created_at)";
            interval = `INTERVAL ${Number(value)} DAY`;
        }

        const [rows] = await pool.query(`
            SELECT 
                ${groupBy} as period,
                ${labelFormat} as label,
                COUNT(*) as total,
                SUM(CASE WHEN status = 'confirmed' THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = 'canceled' THEN 1 ELSE 0 END) as canceled,
                SUM(total_price) as revenue
            FROM bookings
            WHERE created_at >= DATE_SUB(NOW(), ${interval})
            GROUP BY ${groupBy}, ${labelFormat}
            ORDER BY period ASC
        `);
        return rows;
    }

    // Analytics: property performance
    async getPropertyPerformance(limit = 10) {
        const [rows] = await pool.query(`
            SELECT 
                p.id,
                p.name as property_name,
                p.location as city,
                p.type,
                COUNT(b.id) as total_bookings,
                COALESCE(SUM(b.total_price), 0) as total_revenue,
                COALESCE(AVG(b.total_price), 0) as avg_booking_value,
                SUM(CASE WHEN b.status = 'confirmed' THEN 1 ELSE 0 END) as confirmed_bookings,
                SUM(CASE WHEN b.status = 'canceled' THEN 1 ELSE 0 END) as canceled_bookings
            FROM properties p
            LEFT JOIN bookings b ON b.entity_id = p.id AND b.entity_type = 'Property'
            GROUP BY p.id, p.name, p.location, p.type
            ORDER BY total_revenue DESC
            LIMIT ?
        `, [Number(limit)]);
        return rows;
    }

    // Analytics: payment breakdown
    async getPaymentBreakdown(period = 'days', value = 30) {
        let interval;
        if (period === 'months') interval = `INTERVAL ${Number(value)} MONTH`;
        else if (period === 'years') interval = `INTERVAL ${Number(value)} YEAR`;
        else interval = `INTERVAL ${Number(value)} DAY`;

        const [rows] = await pool.query(`
            SELECT 
                status,
                COUNT(*) as count,
                SUM(amount) as total_amount,
                AVG(amount) as avg_amount
            FROM payments
            WHERE created_at >= DATE_SUB(NOW(), ${interval})
            GROUP BY status
        `);
        return rows;
    }

    // Analytics: top guests
    async getTopGuests(period = 'days', value = 30, limit = 10) {
        let interval;
        if (period === 'months') interval = `INTERVAL ${Number(value)} MONTH`;
        else if (period === 'years') interval = `INTERVAL ${Number(value)} YEAR`;
        else interval = `INTERVAL ${Number(value)} DAY`;

        const [rows] = await pool.query(`
            SELECT 
                u.id,
                u.full_name,
                u.email,
                COUNT(b.id) as booking_count,
                SUM(b.total_price) as total_spent,
                MAX(b.created_at) as last_booking
            FROM users u
            JOIN bookings b ON b.user_id = u.id
            WHERE b.created_at >= DATE_SUB(NOW(), ${interval})
            GROUP BY u.id, u.full_name, u.email
            ORDER BY total_spent DESC
            LIMIT ?
        `, [Number(limit)]);
        return rows;
    }

    // Analytics: summary KPIs for a given period vs previous period
    async getPeriodComparison(period = 'days', value = 30) {
        let intervalSql, prevIntervalSql;
        const v = Number(value);
        if (period === 'months') {
            intervalSql = `DATE_SUB(NOW(), INTERVAL ${v} MONTH)`;
            prevIntervalSql = `DATE_SUB(NOW(), INTERVAL ${v * 2} MONTH) AND DATE_SUB(NOW(), INTERVAL ${v} MONTH)`;
        } else if (period === 'years') {
            intervalSql = `DATE_SUB(NOW(), INTERVAL ${v} YEAR)`;
            prevIntervalSql = `DATE_SUB(NOW(), INTERVAL ${v * 2} YEAR) AND DATE_SUB(NOW(), INTERVAL ${v} YEAR)`;
        } else {
            intervalSql = `DATE_SUB(NOW(), INTERVAL ${v} DAY)`;
            prevIntervalSql = `DATE_SUB(NOW(), INTERVAL ${v * 2} DAY) AND DATE_SUB(NOW(), INTERVAL ${v} DAY)`;
        }

        const currentQ = `
            SELECT 
                COUNT(b.id) as bookings,
                COALESCE(SUM(b.total_price), 0) as revenue,
                COALESCE(SUM(p.amount), 0) as payments_collected
            FROM bookings b
            LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'Success'
            WHERE b.created_at >= ${intervalSql}
        `;
        const prevQ = `
            SELECT 
                COUNT(b.id) as bookings,
                COALESCE(SUM(b.total_price), 0) as revenue,
                COALESCE(SUM(p.amount), 0) as payments_collected
            FROM bookings b
            LEFT JOIN payments p ON p.booking_id = b.id AND p.status = 'Success'
            WHERE b.created_at BETWEEN ${prevIntervalSql}
        `;

        const [[current]] = await pool.query(currentQ);
        let prev = { bookings: 0, revenue: 0, payments_collected: 0 };
        try {
            const [rows] = await pool.query(prevQ);
            if (rows && rows.length > 0) prev = rows[0];
        } catch (e) {
            console.error("Error in prev comparison query:", e);
        }

        return { current, prev };
    }
}

module.exports = new ReportsRepository();
