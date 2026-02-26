import React, { useRef, useState } from 'react';
import { X, Receipt, User, CreditCard, Calendar, CheckCircle, AlertCircle, Shield, Download, Printer, Building, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './PaymentDetailsPopup.css';

const PaymentDetailsPopup = ({ isOpen, onClose, payment, onApprove }) => {
    const receiptRef = useRef();
    const [showReceipt, setShowReceipt] = useState(false);
    const [downloading, setDownloading] = useState(false);

    if (!isOpen || !payment) return null;

    const isActionable = payment.status === 'Pending' || payment.status === 'Failed';

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!receiptRef.current) return;
        setDownloading(true);
        try {
            // If we're not currently showing receipt, we need to handle that. 
            // For now, assume user is viewing receipt.
            const canvas = await html2canvas(receiptRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`SomStay_Receipt_${payment.id}.pdf`);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF. Please try printing to PDF instead.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className={`modal-content payment-details-modal ${showReceipt ? 'receipt-mode' : ''}`}
                    onClick={e => e.stopPropagation()}
                >
                    {!showReceipt ? (
                        <>
                            <div className="modal-header">
                                <div className="title-block">
                                    <div className="status-indicator-pill">
                                        <span className={`status-dot ${payment.status.toLowerCase()}`}></span>
                                        <span>{payment.status.toUpperCase()}</span>
                                    </div>
                                    <h2>Transaction Details</h2>
                                    <p>Ref ID: {payment.id}</p>
                                </div>
                                <div className="header-actions">
                                    <button className="icon-btn-header" title="Print Receipt" onClick={() => setShowReceipt(true)}>
                                        <Printer size={18} />
                                    </button>
                                    <button
                                        className="icon-btn-header"
                                        title="Download PDF"
                                        onClick={handleDownloadPDF}
                                        disabled={downloading}
                                    >
                                        {downloading ? (
                                            <div className="tiny-spinner"></div>
                                        ) : (
                                            <Download size={18} />
                                        )}
                                    </button>
                                    <button className="close-btn" onClick={onClose}>
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="modal-body scrollable-body">
                                {/* Summary Card */}
                                <div className="txn-summary-card">
                                    <div className="summary-main">
                                        <span className="label">TOTAL AMOUNT</span>
                                        <h1 className="amount-display">{payment.amount}</h1>
                                    </div>
                                    <div className="summary-date">
                                        <Calendar size={14} />
                                        <span>{payment.date}</span>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="details-grid">
                                    <section className="detail-section">
                                        <div className="section-label-group">
                                            <User size={14} />
                                            <span>Guest Information</span>
                                        </div>
                                        <div className="info-box-premium">
                                            <h3>{payment.guest}</h3>
                                            <p>Verified Platform Member</p>
                                        </div>
                                    </section>

                                    <section className="detail-section">
                                        <div className="section-label-group">
                                            <CreditCard size={14} />
                                            <span>Payment Method</span>
                                        </div>
                                        <div className="info-box-premium">
                                            <div className="method-detail-row">
                                                <span className="method-badge">{payment.method.name}</span>
                                                <span className="type-label">{payment.method.type}</span>
                                            </div>
                                            <p>{payment.method.provider} Settlement</p>
                                        </div>
                                    </section>
                                </div>

                                {/* Asset Info */}
                                <div className="detail-section">
                                    <div className="section-label-group">
                                        <Building size={14} />
                                        <span>Related Asset</span>
                                    </div>
                                    <div className="asset-card-mini">
                                        <div className="asset-icon"><Building size={20} /></div>
                                        <div className="asset-details">
                                            <h4>{payment.entity || 'Reservation Asset'}</h4>
                                            <p>Platform Inventory</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Verification Section */}
                                <section className="verification-log detail-section">
                                    <div className="section-label-group">
                                        <Shield size={14} />
                                        <span>Verification Trace</span>
                                    </div>
                                    <div className="log-timeline">
                                        <div className="log-entry">
                                            <div className="log-dot"></div>
                                            <div className="log-content">
                                                <span className="log-time">Transaction Initiated</span>
                                                <p>Via {payment.method.name}</p>
                                            </div>
                                        </div>
                                        <div className="log-entry active">
                                            <div className="log-dot"></div>
                                            <div className="log-content">
                                                <span className="log-time">Latest Update</span>
                                                <p>Gateway Result: {payment.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {isActionable && (
                                    <div className="warning-notice-industrial">
                                        <AlertCircle size={16} />
                                        <div className="notice-text">
                                            <h4>Manual Override Required</h4>
                                            <p>This transaction is currently in {payment.status} state. Verify funds in the portal before manual approval.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer-dual">
                                <button className="btn-secondary-flat" onClick={onClose}>Close</button>
                                {isActionable && (
                                    <button
                                        className="approve-manual-btn"
                                        onClick={() => onApprove(payment.dbId)}
                                    >
                                        <CheckCircle size={18} />
                                        <span>Approve Transaction</span>
                                    </button>
                                )}
                                {!isActionable && (
                                    <button className="receipt-view-btn" onClick={() => setShowReceipt(true)}>
                                        <Receipt size={18} />
                                        <span>View Full Receipt</span>
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="full-receipt-container">
                            <div className="receipt-viewer-header">
                                <button className="back-to-details" onClick={() => setShowReceipt(false)}>
                                    <ChevronLeft size={16} />
                                    <span>Back to Details</span>
                                </button>
                                <div className="viewer-actions">
                                    <button className="receipt-action-btn" onClick={handleDownloadPDF} disabled={downloading}>
                                        {downloading ? <div className="tiny-spinner" style={{ borderColor: 'white', borderTopColor: 'transparent' }}></div> : <Download size={16} />}
                                        <span>Download PDF</span>
                                    </button>
                                    <button className="receipt-action-btn" onClick={handlePrint}>
                                        <Printer size={16} />
                                        <span>Print Receipt</span>
                                    </button>
                                    <button className="receipt-action-btn close" onClick={onClose} style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="receipt-paper" ref={receiptRef}>
                                <div className="receipt-top-branding">
                                    <div className="receipt-logo">
                                        <Building size={48} color="#0288AC" strokeWidth={2.5} />
                                        <div className="logo-text">
                                            <span className="main">SOM STAY</span>
                                            <span className="sub">OFFICIAL FINANCIAL DOCUMENT</span>
                                        </div>
                                    </div>
                                    <div className="receipt-meta">
                                        <div className="meta-row">
                                            <span className="label">Serial No:</span>
                                            <span className="value">{payment.id.replace('TXN', 'RCP')}</span>
                                        </div>
                                        <div className="meta-row">
                                            <span className="label">Date Issued:</span>
                                            <span className="value">{payment.date}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="receipt-billing-grid">
                                    <div className="billing-col">
                                        <span className="col-label">RECEIVED FROM</span>
                                        <h3 className="billing-name">{payment.guest}</h3>
                                        <p className="billing-sub">Verified Platform Member</p>
                                    </div>
                                    <div className="billing-col">
                                        <span className="col-label">PAYMENT CHANNEL</span>
                                        <div className="method-receipt-val">
                                            <CreditCard size={18} color="#0288AC" />
                                            <span style={{ fontSize: '18px', fontWeight: '800' }}>{payment.method.name}</span>
                                        </div>
                                        <p className="billing-sub">Electronic Settlement ({payment.method.provider})</p>
                                    </div>
                                </div>

                                <div className="receipt-table-wrapper">
                                    <table className="receipt-table">
                                        <thead>
                                            <tr>
                                                <th>SERVICES / DESCRIPTION</th>
                                                <th className="text-right">TOTAL AMOUNT</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div className="item-desc">
                                                        <span className="item-title">Reservation Settlement</span>
                                                        <span className="item-subtitle">Asset Group: {payment.entity || 'Assigned Platform Unit'}</span>
                                                        <span className="item-subtitle" style={{ display: 'block', marginTop: '4px' }}>Ref: {payment.id}</span>
                                                    </div>
                                                </td>
                                                <td className="text-right" style={{ fontSize: '18px', fontWeight: '800' }}>{payment.amount}</td>
                                            </tr>
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <td className="text-right">Platform Subtotal</td>
                                                <td className="text-right">{payment.amount}</td>
                                            </tr>
                                            <tr>
                                                <td className="text-right">Service Fees & Tax</td>
                                                <td className="text-right">$0.00</td>
                                            </tr>
                                            <tr className="total-row">
                                                <td className="text-right td-label">GRAND TOTAL</td>
                                                <td className="text-right td-value">{payment.amount}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>

                                <div className="receipt-status-footer">
                                    <div className={`status-stamp ${payment.status.toLowerCase()}`}>
                                        {payment.status === 'Success' ? 'PAID' : payment.status.toUpperCase()}
                                    </div>
                                    <div className="receipt-footer-notes">
                                        <p>This is a strictly confidential financial document.</p>
                                        <p>Issued by SomStay Operations Control (SOC).</p>
                                        <p className="txn-ref">Audit Reference: {payment.id}-SOC-2026</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentDetailsPopup;
