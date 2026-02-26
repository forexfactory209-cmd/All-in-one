import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Home,
    CalendarCheck,
    DollarSign,
    Clock,
    ChevronRight,
    Calendar,
    LayoutDashboard,
    RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/PageHeader';
import { reportService } from '../../Reports/services/reportService';
import './DashboardPage.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await reportService.getDashboardStats();
            setDashboardData(data);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading || !dashboardData) {
        return (
            <div className="reports-loading-state">
                <RefreshCw className="spin" size={48} color="#0288AC" />
                <p>Loading real-time platform metrics...</p>
            </div>
        );
    }

    const { stats: dbStats, revenueTrend, highValueBookings } = dashboardData;

    const stats = [
        {
            label: 'Total Properties',
            value: String(dbStats.properties.active),
            change: 'Active',
            icon: <Home size={20} />,
            color: 'blue'
        },
        {
            label: 'Total Bookings',
            value: String(dbStats.bookings.value),
            icon: <CalendarCheck size={20} />,
            color: 'green',
            hasAction: true
        },
        {
            label: 'Total Revenue',
            value: `$${(dbStats.revenue.value).toLocaleString()}`,
            change: dbStats.revenue.growth,
            icon: <DollarSign size={20} />,
            color: 'cyan'
        },
        {
            label: 'Pending Payments',
            value: String(dbStats.bookings.pending_payments),
            icon: <Clock size={20} />,
            color: 'orange',
            iconBadge: dbStats.bookings.pending_payments > 0
        },
    ];

    // Simple SVG Path generator for the revenue trend
    const chartWidth = 800;
    const chartHeight = 200;
    const maxRevenue = Math.max(...revenueTrend.map(d => Number(d.revenue)), 100);

    const points = revenueTrend.map((d, i) => {
        const x = (i / (revenueTrend.length - 1 || 1)) * chartWidth;
        const y = chartHeight - (Number(d.revenue) / maxRevenue) * chartHeight;
        return `${x},${y}`;
    });

    const areaPath = `M 0,${chartHeight} L ${points.join(' L ')} L ${chartWidth},${chartHeight} Z`;
    const linePath = `M ${points.join(' L ')}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="dashboard-container"
        >
            <PageHeader
                icon={<LayoutDashboard size={22} />}
                title="Dashboard"
                subtitle="Platform overview & real-time performance metrics"
                stats={[
                    { value: String(dbStats.properties.active), label: 'Properties' },
                    { value: String(dbStats.bookings.value), label: 'Bookings' },
                    { value: `$${(dbStats.revenue.value / 1000).toFixed(1)}K`, label: 'Revenue' }
                ]}
            />
            {/* Stats Row */}
            <div className="stats-row">
                {stats.map((stat, index) => (
                    <div key={index} className={`stat-box ${stat.color}`}>
                        <div className="stat-header">
                            <span className="stat-label">{stat.label}</span>
                        </div>
                        <div className="stat-body">
                            <span className="stat-value">{stat.value}</span>
                            {stat.change && <span className="stat-change">{stat.change}</span>}
                            {stat.hasAction && <Calendar size={18} className="stat-action-icon" />}
                            {stat.iconBadge && <div className="stat-badge-icon"><Clock size={14} /></div>}
                        </div>
                        <div className="stat-indicator" />
                    </div>
                ))}
            </div>

            {/* Revenue Overview */}
            <div className="chart-section">
                <div className="chart-card">
                    <div className="chart-header">
                        <div>
                            <h3>Revenue Overview</h3>
                            <p className="text-caption">30-day revenue trend for the platform</p>
                        </div>
                        <button className="filter-btn" onClick={() => navigate('/analytics')}>Full Report <ChevronRight size={16} /></button>
                    </div>

                    <div className="chart-content">
                        <svg className="revenue-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
                            <defs>
                                <linearGradient id="dashboardGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0288AC" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#0288AC" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path d={linePath} fill="none" stroke="#0288AC" strokeWidth="3" />
                            <path d={areaPath} fill="url(#dashboardGradient)" />
                        </svg>
                        <div className="chart-labels">
                            {revenueTrend.filter((_, i) => i % 5 === 0).map((d, i) => (
                                <span key={i}>{new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="bottom-grid">
                {/* Recent Bookings */}
                <div className="recent-bookings-card">
                    <div className="card-header">
                        <h3>Recent High-Value Bookings</h3>
                        <button className="text-btn" onClick={() => navigate('/bookings')}>View All</button>
                    </div>
                    <div className="table-responsive">
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>GUEST</th>
                                    <th>PROPERTY</th>
                                    <th>CHECK-IN</th>
                                    <th>STATUS</th>
                                    <th>PAYMENT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {highValueBookings.map((booking) => (
                                    <tr
                                        key={booking.id}
                                        onClick={() => navigate(`/bookings/${booking.id}`)}
                                        className="clickable-row"
                                    >
                                        <td className="booking-id">#BK-{String(booking.id).padStart(4, '0')}</td>
                                        <td>
                                            <div className="guest-info">
                                                <div className="avatar-sm">{booking.guest_name.charAt(0)}</div>
                                                <span>{booking.guest_name}</span>
                                            </div>
                                        </td>
                                        <td className="property-name">{booking.property_title}</td>
                                        <td className="check-in-date">{new Date(booking.check_in).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`status-pill ${booking.status.toLowerCase()}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="amount-cell">${Number(booking.total_price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Dispute Summary */}
                <div className="recent-payments-card">
                    <div className="card-header">
                        <h3>Critical Disputes</h3>
                        <button className="text-btn" onClick={() => navigate('/disputes')}>Manage</button>
                    </div>
                    <div className="payments-list">
                        {dashboardData.latestDisputes && dashboardData.latestDisputes.length > 0 ? (
                            dashboardData.latestDisputes.map(dispute => (
                                <div
                                    key={dispute.id}
                                    className="payment-item clickable"
                                    onClick={() => navigate(`/disputes/${dispute.id}`)}
                                >
                                    <div className="payment-info">
                                        <div className="p-main-info">
                                            <span className="p-customer">{dispute.subject}</span>
                                            <span className={`p-status-mini ${dispute.priority.toLowerCase()}`}>
                                                {dispute.priority}
                                            </span>
                                        </div>
                                        <div className="p-sub-info">
                                            <span>Guest: {dispute.guest_name}</span>
                                            <span className="bullet">•</span>
                                            <span>{new Date(dispute.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} color="#94A3B8" />
                                </div>
                            ))
                        ) : (
                            <div className="placeholder-msg" style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>
                                <Clock size={32} style={{ marginBottom: '10px' }} />
                                <p>No critical disputes found.</p>
                                <p style={{ fontSize: '12px' }}>Real-time monitoring is active.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Dashboard;
