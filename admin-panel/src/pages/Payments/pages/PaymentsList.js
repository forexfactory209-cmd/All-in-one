import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight, TrendingUp, CreditCard, AlertCircle, Download, Banknote, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import PaymentsTable from '../sections/PaymentsTable';
import PaymentDetailsPopup from '../popups/PaymentDetailsPopup';
import PageHeader from '../../../components/PageHeader';
import { paymentService } from '../services/paymentService';
import { exportToCSV } from '../../../utils/exportUtils';
import './PaymentsPage.css';

const PAYMENTS_PER_PAGE = 8;

const PaymentsList = () => {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [activeMethod, setActiveMethod] = useState('All');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const paymentMethods = ['All', 'ZAAD', 'eDahab', 'Mastercard', 'Bank Transfer', 'Visa'];

    const handleExportCSV = () => {
        const exportData = payments.map(p => ({
            'Transaction ID': p.id,
            'Guest Name': p.guest,
            'Amount': p.amount,
            'Method': p.method.name,
            'Provider': p.method.provider,
            'Type': p.method.type,
            'Date': p.date,
            'Status': p.status,
            'Asset': p.entity
        }));
        exportToCSV(exportData, 'SomStay_Payments_Report');
    };

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await paymentService.getTransactions();
            const mappedData = data.map(p => ({
                id: `TXN-${String(p.id).padStart(4, '0')}`,
                dbId: p.id,
                guest: p.guest_name || 'Anonymous',
                amount: `$${parseFloat(p.amount).toLocaleString()}`,
                rawAmount: parseFloat(p.amount),
                method: {
                    name: p.method_name,
                    provider: p.provider || 'Gateway',
                    type: p.method_type
                },
                date: new Date(p.created_at).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                status: p.status,
                entity: p.entity_name
            }));
            setPayments(mappedData);
        } catch (error) {
            console.error('Failed to load payments:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handlePaymentClick = (payment) => {
        setSelectedPayment(payment);
        setShowDetails(true);
    };

    const handleApprovePayment = async (id) => {
        try {
            // verified_by should be current user ID, using 1 for now if no auth context
            await paymentService.verifyPayment(id, 'Success', 1);
            fetchPayments();
            setShowDetails(false);
        } catch (error) {
            console.error('Error approving payment:', error);
            alert('Failed to approve payment');
        }
    };

    const totalVolume = payments.reduce((acc, p) => acc + p.rawAmount, 0);
    const successRate = payments.length > 0 ? (payments.filter(p => p.status === 'Success').length / payments.length * 100).toFixed(1) : 0;
    const pendingCount = payments.filter(p => p.status === 'Pending').length;

    const filteredPayments = payments.filter(p => {
        const matchesMethod = activeMethod === 'All' || p.method.name === activeMethod;

        const matchesSearch = !searchQuery ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.guest.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.method.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesMethod && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredPayments.length / PAYMENTS_PER_PAGE);
    const startIndex = (currentPage - 1) * PAYMENTS_PER_PAGE;
    const paginatedPayments = filteredPayments.slice(startIndex, startIndex + PAYMENTS_PER_PAGE);

    const paymentMetrics = [
        { label: 'Total Volume', value: `$${totalVolume.toLocaleString()}`, change: '+12.5%', color: 'success', icon: <TrendingUp size={20} /> },
        { label: 'Active Methods', value: String(new Set(payments.map(p => p.method.name)).size), change: 'Stable', color: 'info', icon: <CreditCard size={20} /> },
        { label: 'Pending Payouts', value: String(pendingCount), change: '-2', color: 'warning', icon: <AlertCircle size={20} /> }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="payments-container"
        >
            <PageHeader
                icon={<Banknote size={22} />}
                title="Payment Ledger"
                subtitle="Real-time transaction tracking and financial oversight"
                stats={[
                    { value: `$${(totalVolume / 1000).toFixed(1)}K`, label: 'Volume' },
                    { value: `${successRate}%`, label: 'Success' },
                    { value: String(pendingCount), label: 'Pending' }
                ]}
                actions={[
                    <button key="export" className="phb-action-btn secondary" onClick={handleExportCSV}>
                        <Download size={17} />
                        <span>Export CSV</span>
                    </button>,
                    <button key="refresh" className="phb-action-btn secondary" onClick={fetchPayments}>
                        <RefreshCw size={17} className={loading ? 'spin' : ''} />
                        <span>Refresh</span>
                    </button>
                ]}
            />

            <div className="payments-method-nav">
                {paymentMethods.map(method => (
                    <button
                        key={method}
                        className={`method-tab ${activeMethod === method ? 'active' : ''}`}
                        onClick={() => {
                            setActiveMethod(method);
                            setCurrentPage(1);
                        }}
                    >
                        {method}
                        {method === 'Bank Transfer' && <span className="tab-pill">NEW</span>}
                    </button>
                ))}
            </div>

            <div className="payments-metrics-grid">
                {paymentMetrics.map((metric, index) => (
                    <div key={index} className="metric-card-simple">
                        <div className="metric-info">
                            <span className="metric-label">{metric.label}</span>
                            <div className="metric-val-group">
                                <span className="metric-value">{metric.value}</span>
                                <span className={`metric-change ${metric.color}`}>{metric.change}</span>
                            </div>
                        </div>
                        <div className={`metric-icon-box ${metric.color}`}>
                            {metric.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="payments-filters-header">
                <div className="search-box-standard">
                    <Search className="search-icon-muted" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Transaction ID, Guest or Method..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                <div className="filters-group-actions">
                    <div className="calendar-pill-standard">
                        <Calendar size={16} />
                        <span>Filter by Date</span>
                    </div>
                    <button className="icon-action-btn">
                        <Filter size={18} />
                    </button>
                    <button className="icon-action-btn">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            <div className="payments-table-card">
                <div className="card-top-info">
                    <h3>Transaction History</h3>
                    <p>Real-time stream of all financial activity</p>
                </div>

                <PaymentsTable
                    payments={paginatedPayments}
                    loading={loading}
                    onRowClick={handlePaymentClick}
                />

                <div className="table-pagination-footer">
                    <span className="pagination-info">
                        Showing <strong>{startIndex + 1} to {Math.min(startIndex + PAYMENTS_PER_PAGE, filteredPayments.length)}</strong> of <strong>{filteredPayments.length}</strong> transactions
                    </span>
                    <div className="pagination-btns">
                        <button
                            className="page-nav"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`page-digit ${currentPage === i + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="page-nav"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            <PaymentDetailsPopup
                isOpen={showDetails}
                onClose={() => setShowDetails(false)}
                payment={selectedPayment}
                onApprove={handleApprovePayment}
            />
        </motion.div>
    );
};

export default PaymentsList;
