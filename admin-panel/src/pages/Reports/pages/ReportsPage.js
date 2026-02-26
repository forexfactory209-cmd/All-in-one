import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MoreHorizontal, BarChart3, Download, RefreshCw } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PageHeader from '../../../components/PageHeader';
import { reportService } from '../services/reportService';
import './ReportsPage.css';

const ReportsPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Overview');
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await reportService.getDashboardStats();
            setDashboardData(data);
        } catch (error) {
            console.error("Failed to load analytics", error);
            setError("The analytic synchronization failed. Check backend connectivity.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleExport = async () => {
        const element = document.querySelector('.reports-container');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Analytics_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("Export failed:", error);
        }
    };

    const sections = [
        'Overview',
        'Revenue',
        'Bookings',
        'Property Performance',
        'Guest Satisfaction',
        'Payout History'
    ];

    if (loading) {
        return (
            <div className="reports-loading-state">
                <RefreshCw className="spin" size={48} color="#0288AC" />
                <p>Synthesizing real-time analytics...</p>
            </div>
        );
    }

    if (error || !dashboardData) {
        return (
            <div className="reports-error-state">
                <BarChart3 size={48} color="#EF4444" />
                <p>{error || "No dashboard data available."}</p>
                <button className="phb-action-btn" onClick={loadData}>Retry Sync</button>
            </div>
        );
    }

    const { stats: dbStats, revenueTrend = [], highValueBookings = [] } = dashboardData;

    const summaryStats = [
        { label: 'Total Revenue', value: `$${Number(dbStats?.revenue?.value || 0).toLocaleString()}`, change: dbStats?.revenue?.growth || '0%', color: (dbStats?.revenue?.growth || '').startsWith('-') ? 'red' : 'green' },
        { label: 'Total Bookings', value: String(dbStats?.bookings?.value || 0), change: '+0%', color: 'neutral' },
        { label: 'Active Properties', value: String(dbStats?.properties?.active || 0), change: '0%', color: 'neutral' },
        { label: 'Pending Payments', value: String(dbStats?.bookings?.pending_payments || 0), change: '', color: 'red' }
    ];

    const bookings = highValueBookings.map(bk => ({
        id: bk.id,
        guest: bk.guest_name,
        property: `${bk.property_title}, ${bk.property_city}`,
        dates: `${new Date(bk.check_in).toLocaleDateString()} - ${new Date(bk.check_out).toLocaleDateString()}`,
        status: bk.status,
        amount: `$${Number(bk.total_price).toLocaleString()}`,
        avatar: bk.guest_avatar || 'https://i.pravatar.cc/150?u=default'
    }));

    // Simple SVG Path generator for the revenue trend
    const chartWidth = 800;
    const chartHeight = 200;
    const trendData = (revenueTrend && revenueTrend.length > 0) ? revenueTrend : [{ date: new Date(), revenue: 0 }];
    const maxRevenue = Math.max(...trendData.map(d => Number(d.revenue)), 100);

    const points = trendData.map((d, i) => {
        const x = (i / (trendData.length - 1 || 1)) * chartWidth;
        const y = chartHeight - (Number(d.revenue) / maxRevenue) * chartHeight;
        return `${x},${y}`;
    });

    const areaPath = trendData.length > 1 ? `M 0,${chartHeight} L ${points.join(' L ')} L ${chartWidth},${chartHeight} Z` : `M 0,${chartHeight} L ${chartWidth},${chartHeight} Z`;
    const linePath = trendData.length > 1 ? `M ${points.join(' L ')}` : `M 0,${chartHeight} L ${chartWidth},${chartHeight}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="reports-container"
        >
            <PageHeader
                icon={<BarChart3 size={22} />}
                title="Analytics & Reports"
                subtitle="Performance insights across all properties and bookings"
                stats={[
                    { value: `$${(dbStats.revenue.value / 1000).toFixed(1)}K`, label: 'Revenue' },
                    { value: String(dbStats.bookings.value), label: 'Bookings' },
                    { value: dbStats.revenue.growth, label: 'Growth' }
                ]}
                actions={[
                    <button key="refresh" className="phb-action-btn secondary" onClick={loadData}>
                        <RefreshCw size={16} />
                        <span>Refresh Data</span>
                    </button>,
                    <button key="export" className="phb-action-btn" onClick={handleExport}>
                        <Download size={16} />
                        <span>Export PDF</span>
                    </button>
                ]}
            />
            {/* Top Navigation */}
            <div className="reports-top-nav">
                {sections.map(section => (
                    <button
                        key={section}
                        className={`nav-tab ${activeTab === section ? 'active' : ''}`}
                        onClick={() => setActiveTab(section)}
                    >
                        {section}
                    </button>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="reports-stats-grid">
                {summaryStats.map((stat, idx) => (
                    <div key={idx} className="stat-card">
                        <div className="stat-header">
                            <span className="stat-label">{stat.label}</span>
                            <span className={`stat-change ${stat.color}`}>
                                {stat.change}
                            </span>
                        </div>
                        <h2 className="stat-value">{stat.value}</h2>
                    </div>
                ))}
            </div>

            {/* Revenue Trend Chart Section */}
            <div className="chart-card">
                <div className="chart-header">
                    <div>
                        <h3 className="section-title">Revenue Trend (Last 30 Days)</h3>
                        <p className="section-subtitle">Daily earnings tracking across all managed properties</p>
                    </div>
                    <button className="icon-btn-simple">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
                <div className="chart-wrapper">
                    <svg viewBox={`0 0 ${chartWidth} 240`} className="revenue-svg">
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="rgba(2, 136, 172, 0.15)" />
                                <stop offset="100%" stopColor="rgba(2, 136, 172, 0.0)" />
                            </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="50" x2={chartWidth} y2="50" stroke="#F4F7F8" />
                        <line x1="0" y1="100" x2={chartWidth} y2="100" stroke="#F4F7F8" />
                        <line x1="0" y1="150" x2={chartWidth} y2="150" stroke="#F4F7F8" />

                        {/* Area */}
                        <path
                            d={areaPath}
                            fill="url(#gradient)"
                        />
                        {/* Line */}
                        <path
                            d={linePath}
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="3"
                        />

                        {/* X-Axis Labels (Sampled) */}
                        {revenueTrend.filter((_, i) => i % 5 === 0).map((d, i) => {
                            const x = (i * 5 / (revenueTrend.length - 1 || 1)) * chartWidth;
                            return (
                                <text key={i} x={x} y="230" className="chart-label">
                                    {new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </text>
                            );
                        })}
                    </svg>
                </div>
            </div>

            {/* High-Value Bookings Table */}
            <div className="table-card-simple">
                <div className="table-header-row">
                    <h3 className="section-title">Recent High-Value Bookings</h3>
                    <button className="view-link-btn" onClick={() => navigate('/bookings')}>View all bookings</button>
                </div>
                <div className="recent-bookings-table-wrapper">
                    <table className="recent-bookings-table">
                        <thead>
                            <tr>
                                <th>GUEST</th>
                                <th>PROPERTY</th>
                                <th>DATES</th>
                                <th>STATUS</th>
                                <th className="text-right">TOTAL AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id} onClick={() => navigate(`/bookings/${booking.id}`)} className="clickable-row">
                                    <td>
                                        <div className="guest-info">
                                            <img src={booking.avatar} alt={booking.guest} className="guest-avatar-mini" />
                                            <span className="guest-name-small">{booking.guest}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="property-info-small">
                                            <span className="p-title">{booking.property.split(',')[0]}</span>
                                            <span className="p-loc">{booking.property.split(',')[1]}</span>
                                        </div>
                                    </td>
                                    <td className="dates-val">{booking.dates}</td>
                                    <td>
                                        <span className={`status-pill-small ${booking.status.toLowerCase()}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="text-right amount-val">{booking.amount}</td>
                                </tr>
                            ))}
                            {bookings.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center" style={{ padding: '40px', color: '#94A3B8' }}>
                                        No high-value bookings recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportsPage;
