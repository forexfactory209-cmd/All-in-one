import React, { useState, useEffect } from 'react';
import { X, Calendar, CreditCard, ChevronDown, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import { generateBookingPDF } from '../../../utils/bookingPdfUtils';
import './AddBookingPopup.css'; // Reuse styling

const EditBookingPopup = ({ isOpen, onClose, onSuccess, bookingData }) => {
    const [formData, setFormData] = useState({
        check_in: '',
        check_out: '',
        status: 'Confirmed',
        payment_status: 'PENDING',
        payment_method: 'ZAAD',
        total_price: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bookingData) {
            // Mapping UI format back to form format
            // dates format is "MM/DD/YYYY - MM/DD/YYYY" or "YYYY-MM-DD - YYYY-MM-DD"
            const dateParts = bookingData.dates ? bookingData.dates.split(' - ') : ['', ''];

            // Convert localized dates back to YYYY-MM-DD for input[type="date"]
            const formatDateForInput = (dateStr) => {
                if (!dateStr) return '';
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
            };

            setFormData({
                check_in: formatDateForInput(dateParts[0]),
                check_out: formatDateForInput(dateParts[1]),
                status: bookingData.status || 'Confirmed',
                payment_status: (bookingData.payment?.status || 'PENDING').toUpperCase(),
                payment_method: bookingData.payment?.method || 'ZAAD',
                total_price: bookingData.total_price || 0
            });
        }
    }, [bookingData]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDownloadPDF = () => {
        // Merge current form data with static booking info for PDF
        const fullBookingInfo = {
            ...bookingData,
            status: formData.status,
            payment: {
                ...bookingData.payment,
                status: formData.payment_status
            },
            total_price: formData.total_price
        };
        generateBookingPDF(fullBookingInfo);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await bookingService.updateBooking(bookingData.dbId, formData);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating booking:', error);
            alert('Failed to update booking.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="modal-content add-booking-modal"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <div className="title-block">
                            <h2>Edit Reservation</h2>
                            <p>Update dates, status or payment for {bookingData.id}</p>
                        </div>
                        <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
                            <button
                                className="icon-btn-header"
                                title="Download PDF"
                                onClick={handleDownloadPDF}
                                style={{ background: '#F3F4F6', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}
                            >
                                <Download size={20} color="#0288AC" />
                            </button>
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="modal-body scrollable-body">
                        {/* Guest & Entity Info (Read Only for now) */}
                        <div className="booking-info-summary">
                            <div className="info-item">
                                <span className="info-label">GUEST</span>
                                <span className="info-value">{bookingData.guest?.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">PROPERTY / ROOM</span>
                                <span className="info-value">{bookingData.property}</span>
                            </div>
                        </div>

                        {/* Booking Details Section */}
                        <section className="booking-section">
                            <div className="section-header-pill">
                                <Calendar size={14} />
                                <span>RESERVATION DATES</span>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Check-in Date</label>
                                    <input
                                        type="date"
                                        name="check_in"
                                        value={formData.check_in}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Check-out Date</label>
                                    <input
                                        type="date"
                                        name="check_out"
                                        value={formData.check_out}
                                        onChange={handleInputChange}
                                        className="premium-input"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Status Section */}
                        <section className="booking-section">
                            <div className="section-header-pill">
                                <AlertCircle size={14} />
                                <span>RESERVATION STATUS</span>
                            </div>
                            <div className="premium-select-wrapper">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="premium-select"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Completed">Completed</option>
                                </select>
                                <ChevronDown size={18} className="select-icon" />
                            </div>
                        </section>

                        {/* Payment Section */}
                        <section className="booking-section">
                            <div className="payment-status-header">
                                <div className="section-header-pill">
                                    <CreditCard size={14} />
                                    <span>PAYMENT INFO</span>
                                </div>
                                <div className="toggle-switch-pills">
                                    <button
                                        className={`toggle-pill ${formData.payment_status === 'PENDING' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, payment_status: 'PENDING' }))}
                                    >
                                        PENDING
                                    </button>
                                    <button
                                        className={`toggle-pill ${formData.payment_status === 'PAID' ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, payment_status: 'PAID' }))}
                                    >
                                        PAID
                                    </button>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginTop: '15px' }}>
                                <label>Total Amount ($)</label>
                                <input
                                    type="number"
                                    name="total_price"
                                    value={formData.total_price}
                                    onChange={handleInputChange}
                                    className="premium-input"
                                />
                            </div>
                        </section>
                    </div>

                    <div className="modal-footer">
                        <div className="footer-actions" style={{ width: '100%', justifyContent: 'flex-end' }}>
                            <button className="btn-text-cancel" onClick={onClose} disabled={loading}>Discard Changes</button>
                            <button className="confirm-booking-btn" onClick={handleSubmit} disabled={loading}>
                                <CheckCircle size={18} />
                                <span>{loading ? 'Saving...' : 'Update Reservation'}</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default EditBookingPopup;
