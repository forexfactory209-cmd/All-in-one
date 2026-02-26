import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3, TrendingUp, DollarSign,
    CalendarCheck, Building2, Users, Download, RefreshCw,
    Calendar, CreditCard, Award,
    ArrowUpRight, ArrowDownRight, Filter
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import PageHeader from '../../../components/PageHeader';
import { reportService } from '../../Reports/services/reportService';
import './AnalyticsPage.css';

/* ─── Period presets ─── */
const PERIOD_GROUPS = {
    days: [7, 14, 30, 60, 90],
    months: [3, 6, 12],
    years: [2, 3, 5],
};
const PERIOD_LABELS = {
    days: { 7: 'Last 7 Days', 14: 'Last 14 Days', 30: 'Last 30 Days', 60: 'Last 60 Days', 90: 'Last 90 Days' },
    months: { 3: 'Last 3 Months', 6: 'Last 6 Months', 12: 'Last 12 Months' },
    years: { 2: 'Last 2 Years', 3: 'Last 3 Years', 5: 'Last 5 Years' },
};

/* ─── Tiny helpers ─── */
const fmt = (n) => Number(n || 0).toLocaleString();
const fmtMoney = (n) => `$${fmt(n)}`;
const fmtK = (n) => {
    const num = Number(n || 0);
    return num >= 1000 ? `$${(num / 1000).toFixed(1)}K` : `$${num}`;
};
const growthColor = (g) => {
    const v = parseFloat(g);
    if (isNaN(v) || v === 0) return 'neutral';
    return v > 0 ? 'up' : 'down';
};

/* ─── SVG Line/Area Chart ─── */
const MiniChart = ({ data, color = '#0288AC', height = 200 }) => {
    if (!data || data.length < 2) return null;
    const W = 800, H = height;
    const vals = data.map(d => Number(d.revenue) || 0);
    const maxV = Math.max(...vals, 1);

    const pts = vals.map((v, i) => {
        const x = (i / (vals.length - 1)) * W;
        const y = H - (v / maxV) * (H - 20) - 10;
        return [x, y];
    });

    const line = `M ${pts.map(p => p.join(',')).join(' L ')}`;
    const area = `M 0,${H} L ${pts.map(p => p.join(',')).join(' L ')} L ${W},${H} Z`;

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="analytics-svg" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.18" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((t, i) => (
                <line key={i} x1="0" x2={W} y1={H * t} y2={H * t}
                    stroke="#EEF2F5" strokeWidth="1" />
            ))}
            <path d={area} fill={`url(#grad-${color.replace('#', '')})`} />
            <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {pts.map((p, i) => (
                <circle key={i} cx={p[0]} cy={p[1]} r="4" fill={color} fillOpacity="0.6" />
            ))}
        </svg>
    );
};

/* ─── Bar Chart ─── */
const BarChart = ({ data, color = '#0288AC', labelKey = 'label', valueKey = 'revenue' }) => {
    const [hovered, setHovered] = useState(null);
    if (!data || data.length === 0) return <div className="no-data-msg">No data available</div>;
    const vals = data.map(d => Number(d[valueKey]) || 0);
    const maxV = Math.max(...vals, 1);
    const barW = Math.floor(800 / data.length) - 4;

    return (
        <div className="bar-chart-container">
            <svg viewBox={`0 0 800 220`} className="analytics-svg">
                <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.5" />
                    </linearGradient>
                </defs>
                {data.map((d, i) => {
                    const h = Math.max((Number(d[valueKey]) / maxV) * 170, 4);
                    const x = (i / data.length) * 800;
                    const y = 185 - h;
                    const isH = hovered === i;
                    return (
                        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                            <rect
                                x={x + 2} y={y}
                                width={barW} height={h}
                                rx="4"
                                fill={isH ? color : 'url(#barGrad)'}
                                opacity={isH ? 1 : 0.85}
                            />
                            {isH && (
                                <text x={x + barW / 2} y={y - 6} textAnchor="middle" fontSize="10" fill={color} fontWeight="700">
                                    {valueKey === 'revenue' ? fmtK(d[valueKey]) : fmt(d[valueKey])}
                                </text>
                            )}
                        </g>
                    );
                })}
                {/* X-axis labels (every n-th label) */}
                {data.filter((_, i) => data.length <= 12 || i % Math.ceil(data.length / 12) === 0).map((d, i) => {
                    const origIdx = data.indexOf(d);
                    const x = (origIdx / data.length) * 800 + barW / 2;
                    const lbl = String(d[labelKey] || '').slice(0, 8);
                    return (
                        <text key={i} x={x} y={210} textAnchor="middle" fontSize="9" fill="#9BA3A3" fontWeight="600">
                            {lbl}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

/* ─── Main Analytics Page ─── */
const AnalyticsPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    // Filter state
    const [periodType, setPeriodType] = useState('days');   // 'days' | 'months' | 'years'
    const [periodValue, setPeriodValue] = useState(30);

    // Active chart tab
    const [chartTab, setChartTab] = useState('revenue');     // 'revenue' | 'bookings'

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await reportService.getAnalytics(periodType, periodValue);
            setData(result);
        } catch (err) {
            setError('Failed to load analytics. Check backend connectivity.');
        } finally {
            setLoading(false);
        }
    }, [periodType, periodValue]);

    useEffect(() => { loadData(); }, [loadData]);

    const handleExport = async () => {
        const el = document.querySelector('.analytics-page');
        if (!el) return;
        try {
            const canvas = await html2canvas(el, { scale: 2, useCORS: true, logging: false });
            const img = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pw = pdf.internal.pageSize.getWidth();
            const ph = (canvas.height * pw) / canvas.width;
            pdf.addImage(img, 'PNG', 0, 0, pw, ph);
            pdf.save(`Analytics_${periodType}_${periodValue}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (e) {
            console.error('Export failed:', e);
        }
    };

    const changePeriodType = (type) => {
        setPeriodType(type);
        setPeriodValue(PERIOD_GROUPS[type][1]); // pick middle preset
    };

    /* ─── Loading & Error states ─── */
    if (loading) return (
        <div className="analytics-loading">
            <RefreshCw className="spin" size={48} color="#0288AC" />
            <p>Loading analytics data…</p>
        </div>
    );
    if (error || !data) return (
        <div className="analytics-error">
            <BarChart3 size={48} color="#FE3335" />
            <p>{error || 'No data available'}</p>
            <button className="analytics-retry-btn" onClick={loadData}>
                <RefreshCw size={16} /> Retry
            </button>
        </div>
    );

    const { kpis, revenueTrend, bookingStats, propertyPerformance, paymentBreakdown, topGuests } = data;

    /* ─── Build KPI cards ─── */
    const kpiCards = [
        {
            label: 'Total Revenue',
            value: fmtMoney(kpis.totalRevenue.value),
            growth: kpis.totalRevenue.growth,
            icon: <DollarSign size={20} />,
            color: '#0288AC'
        },
        {
            label: 'Total Bookings',
            value: fmt(kpis.totalBookings.value),
            growth: kpis.totalBookings.growth,
            icon: <CalendarCheck size={20} />,
            color: '#06A649'
        },
        {
            label: 'Payments Collected',
            value: fmtMoney(kpis.paymentsCollected.value),
            growth: kpis.paymentsCollected.growth,
            icon: <CreditCard size={20} />,
            color: '#7C3AED'
        },
        {
            label: 'Active Properties',
            value: fmt(propertyPerformance.filter(p => p.total_bookings > 0).length),
            growth: null,
            icon: <Building2 size={20} />,
            color: '#F59E0B'
        },
    ];

    /* ─── Payment breakdown donut values ─── */
    const payTotal = paymentBreakdown.reduce((s, p) => s + Number(p.count), 0) || 1;
    const payColors = { Success: '#06A649', Pending: '#F59E0B', Failed: '#FE3335', Refunded: '#6B7280' };

    /* ─── Top property bar data ─── */
    const topProps = propertyPerformance.slice(0, 8).map(p => ({
        label: (p.property_name || 'Unknown').slice(0, 12),
        revenue: Number(p.total_revenue) || 0,
        bookings: Number(p.total_bookings) || 0,
    }));

    /* ─── Booking status donut ─── */
    const bkTotal = bookingStats.reduce((s, b) => s + Number(b.total), 0) || 1;
    const bkSum = {
        confirmed: bookingStats.reduce((s, b) => s + Number(b.confirmed), 0),
        pending: bookingStats.reduce((s, b) => s + Number(b.pending), 0),
        canceled: bookingStats.reduce((s, b) => s + Number(b.canceled), 0),
    };

    const currentLabel = PERIOD_LABELS[periodType][periodValue] || `${periodValue} ${periodType}`;

    return (
        <motion.div
            className="analytics-page"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* ── Header ── */}
            <PageHeader
                icon={<BarChart3 size={22} />}
                title="Analytics"
                subtitle={`Full platform insights · ${currentLabel}`}
                backAction={() => navigate('/')}
                stats={[
                    { value: fmtK(kpis.totalRevenue.value), label: 'Revenue' },
                    { value: fmt(kpis.totalBookings.value), label: 'Bookings' },
                    { value: fmt(propertyPerformance.length), label: 'Properties' },
                ]}
                actions={[
                    <button key="refresh" className="phb-action-btn secondary" onClick={loadData}>
                        <RefreshCw size={16} /><span>Refresh</span>
                    </button>,
                    <button key="export" className="phb-action-btn" onClick={handleExport}>
                        <Download size={16} /><span>Export PDF</span>
                    </button>
                ]}
            />

            {/* ── Filter Bar ── */}
            <div className="analytics-filter-bar">
                <div className="filter-label"><Filter size={15} /> Filter Period</div>

                {/* Period type tabs */}
                <div className="period-type-tabs">
                    {['days', 'months', 'years'].map(type => (
                        <button
                            key={type}
                            className={`period-tab ${periodType === type ? 'active' : ''}`}
                            onClick={() => changePeriodType(type)}
                        >
                            <Calendar size={14} />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Value presets */}
                <div className="period-value-pills">
                    {PERIOD_GROUPS[periodType].map(v => (
                        <button
                            key={v}
                            className={`period-pill ${periodValue === v ? 'active' : ''}`}
                            onClick={() => setPeriodValue(v)}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                <div className="filter-active-badge">
                    <Calendar size={13} />
                    {currentLabel}
                </div>
            </div>

            {/* ── KPI Cards ── */}
            <div className="analytics-kpi-grid">
                {kpiCards.map((card, i) => {
                    const gc = growthColor(card.growth);
                    return (
                        <motion.div
                            key={i}
                            className="analytics-kpi-card"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            style={{ '--accent': card.color }}
                        >
                            <div className="kpi-top">
                                <div className="kpi-icon-wrap" style={{ background: `${card.color}18` }}>
                                    <span style={{ color: card.color }}>{card.icon}</span>
                                </div>
                                {card.growth !== null && (
                                    <span className={`kpi-growth ${gc}`}>
                                        {gc === 'up' ? <ArrowUpRight size={13} /> : gc === 'down' ? <ArrowDownRight size={13} /> : null}
                                        {card.growth}%
                                    </span>
                                )}
                            </div>
                            <div className="kpi-value">{card.value}</div>
                            <div className="kpi-label">{card.label}</div>
                            <div className="kpi-bar" style={{ background: `${card.color}22` }}>
                                <div className="kpi-bar-fill" style={{ background: card.color, width: '60%' }} />
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── Main Chart Section ── */}
            <div className="analytics-chart-card">
                <div className="card-top-row">
                    <div>
                        <h3 className="card-title">
                            {chartTab === 'revenue' ? 'Revenue Trend' : 'Booking Volume'}
                        </h3>
                        <p className="card-subtitle">
                            {chartTab === 'revenue'
                                ? `Revenue over ${currentLabel}`
                                : `Booking count over ${currentLabel}`}
                        </p>
                    </div>
                    <div className="chart-tab-group">
                        <button className={`chart-tab ${chartTab === 'revenue' ? 'active' : ''}`} onClick={() => setChartTab('revenue')}>
                            <TrendingUp size={15} /> Revenue
                        </button>
                        <button className={`chart-tab ${chartTab === 'bookings' ? 'active' : ''}`} onClick={() => setChartTab('bookings')}>
                            <CalendarCheck size={15} /> Bookings
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={chartTab}
                        className="chart-area"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                    >
                        {chartTab === 'revenue' ? (
                            revenueTrend.length > 0
                                ? <MiniChart data={revenueTrend} color="#0288AC" height={220} />
                                : <div className="no-data-msg">No revenue data for this period</div>
                        ) : (
                            bookingStats.length > 0
                                ? <BarChart data={bookingStats} color="#06A649" labelKey="label" valueKey="total" />
                                : <div className="no-data-msg">No booking data for this period</div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* X labels for line chart */}
                {chartTab === 'revenue' && revenueTrend.length > 0 && (
                    <div className="chart-x-labels">
                        {revenueTrend
                            .filter((_, i) => i % Math.max(1, Math.floor(revenueTrend.length / 8)) === 0)
                            .map((d, i) => (
                                <span key={i}>{String(d.label || d.date || '').slice(0, 10)}</span>
                            ))}
                    </div>
                )}
            </div>

            {/* ── Middle Row: Payment Breakdown + Booking Status ── */}
            <div className="analytics-two-col">
                {/* Payment Breakdown */}
                <div className="analytics-card">
                    <div className="card-top-row">
                        <div>
                            <h3 className="card-title">Payment Breakdown</h3>
                            <p className="card-subtitle">By payment status</p>
                        </div>
                        <CreditCard size={20} color="#0288AC" />
                    </div>
                    <div className="donut-section">
                        <svg viewBox="0 0 100 100" className="donut-svg">
                            {(() => {
                                let offset = 0;
                                return paymentBreakdown.map((p, i) => {
                                    const pct = (Number(p.count) / payTotal) * 100;
                                    const color = payColors[p.status] || '#9BA3A3';
                                    const el = (
                                        <circle
                                            key={i}
                                            cx="50" cy="50" r="35"
                                            fill="none"
                                            stroke={color}
                                            strokeWidth="18"
                                            strokeDasharray={`${pct * 2.199} ${220 - pct * 2.199}`}
                                            strokeDashoffset={-offset * 2.199}
                                            transform="rotate(-90 50 50)"
                                        />
                                    );
                                    offset += pct;
                                    return el;
                                });
                            })()}
                            <text x="50" y="46" textAnchor="middle" fontSize="11" fontWeight="800" fill="#04252E">{payTotal}</text>
                            <text x="50" y="57" textAnchor="middle" fontSize="6" fill="#9BA3A3">TOTAL</text>
                        </svg>
                        <div className="donut-legend">
                            {paymentBreakdown.map((p, i) => (
                                <div key={i} className="legend-item">
                                    <span className="legend-dot" style={{ background: payColors[p.status] || '#9BA3A3' }} />
                                    <span className="legend-label">{p.status}</span>
                                    <span className="legend-val">{fmt(p.count)}</span>
                                    <span className="legend-amt">{fmtMoney(p.total_amount)}</span>
                                </div>
                            ))}
                            {paymentBreakdown.length === 0 && <p className="no-data-msg">No payments found</p>}
                        </div>
                    </div>
                </div>

                {/* Booking Status */}
                <div className="analytics-card">
                    <div className="card-top-row">
                        <div>
                            <h3 className="card-title">Booking Status</h3>
                            <p className="card-subtitle">Confirmed vs Pending vs Canceled</p>
                        </div>
                        <CalendarCheck size={20} color="#06A649" />
                    </div>
                    <div className="status-bars-list">
                        {[
                            { label: 'Confirmed', count: bkSum.confirmed, color: '#06A649' },
                            { label: 'Pending', count: bkSum.pending, color: '#F59E0B' },
                            { label: 'Canceled', count: bkSum.canceled, color: '#FE3335' },
                        ].map((s, i) => {
                            const pct = bkTotal > 0 ? (s.count / bkTotal) * 100 : 0;
                            return (
                                <div key={i} className="status-bar-row">
                                    <div className="status-bar-labels">
                                        <span>{s.label}</span>
                                        <span>{fmt(s.count)} <em>({pct.toFixed(1)}%)</em></span>
                                    </div>
                                    <div className="status-bar-track">
                                        <motion.div
                                            className="status-bar-fill"
                                            style={{ background: s.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.15 }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="booking-status-total">
                        <span>Total bookings in period:</span>
                        <strong>{fmt(bkTotal)}</strong>
                    </div>
                </div>
            </div>

            {/* ── Property Performance ── */}
            <div className="analytics-card full-width">
                <div className="card-top-row">
                    <div>
                        <h3 className="card-title">Top Property Performance</h3>
                        <p className="card-subtitle">Revenue and bookings by property</p>
                    </div>
                    <Building2 size={20} color="#F59E0B" />
                </div>
                {topProps.length > 0
                    ? <BarChart data={topProps} color="#F59E0B" labelKey="label" valueKey="revenue" />
                    : <div className="no-data-msg">No property data available</div>}
                <div className="property-table-wrapper">
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Property</th>
                                <th>City</th>
                                <th>Bookings</th>
                                <th>Confirmed</th>
                                <th>Canceled</th>
                                <th>Avg. Value</th>
                                <th className="text-right">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {propertyPerformance.map((p, i) => (
                                <tr key={p.id}>
                                    <td className="rank-cell">
                                        {i === 0 ? <Award size={16} color="#F59E0B" /> : i + 1}
                                    </td>
                                    <td className="prop-name-cell">{p.property_name || '—'}</td>
                                    <td className="city-cell">{p.city || '—'}</td>
                                    <td>{fmt(p.total_bookings)}</td>
                                    <td><span className="pill confirmed">{fmt(p.confirmed_bookings)}</span></td>
                                    <td><span className="pill canceled">{fmt(p.canceled_bookings)}</span></td>
                                    <td className="money-cell">{fmtMoney(p.avg_booking_value)}</td>
                                    <td className="money-cell text-right">{fmtMoney(p.total_revenue)}</td>
                                </tr>
                            ))}
                            {propertyPerformance.length === 0 && (
                                <tr><td colSpan="8" className="empty-row">No properties found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Top Guests ── */}
            <div className="analytics-card full-width">
                <div className="card-top-row">
                    <div>
                        <h3 className="card-title">Top Guests</h3>
                        <p className="card-subtitle">Highest spending guests in period</p>
                    </div>
                    <Users size={20} color="#7C3AED" />
                </div>
                <div className="property-table-wrapper">
                    <table className="analytics-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Guest</th>
                                <th>Email</th>
                                <th>Bookings</th>
                                <th>Last Booking</th>
                                <th className="text-right">Total Spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topGuests.map((g, i) => (
                                <tr key={g.id} onClick={() => navigate(`/users/${g.id}`)} className="clickable-row">
                                    <td className="rank-cell">{i + 1}</td>
                                    <td>
                                        <div className="guest-cell">
                                            <div className="guest-avatar-letter">{(g.full_name || '?').charAt(0).toUpperCase()}</div>
                                            <span>{g.full_name}</span>
                                        </div>
                                    </td>
                                    <td className="email-cell">{g.email}</td>
                                    <td>{fmt(g.booking_count)}</td>
                                    <td className="date-cell">{g.last_booking ? new Date(g.last_booking).toLocaleDateString() : '—'}</td>
                                    <td className="money-cell text-right">{fmtMoney(g.total_spent)}</td>
                                </tr>
                            ))}
                            {topGuests.length === 0 && (
                                <tr><td colSpan="6" className="empty-row">No guest data found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </motion.div>
    );
};

export default AnalyticsPage;
