import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../../Bookings/services/bookingService';
import { disputeService } from '../services/disputeService';
import './AddDisputePopup.css';

const AddDisputePopup = ({ isOpen, onClose, onSuccess }) => {
    const [bookings, setBookings] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        booking_id: '',
        user_id: '',
        subject: '',
        description: '',
        priority: 'MEDIUM'
    });

    useEffect(() => {
        if (isOpen) {
            loadRecentBookings();
        }
    }, [isOpen]);

    const loadRecentBookings = async () => {
        setLoadingBookings(true);
        try {
            const data = await bookingService.getAllBookings();
            setBookings(data || []);
        } catch (error) {
            console.error("Failed to load bookings", error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleBookingSelect = (bookingId) => {
        const selected = bookings.find(b => b.id === parseInt(bookingId));
        if (selected) {
            setFormData(prev => ({
                ...prev,
                booking_id: selected.id,
                user_id: selected.user_id
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.booking_id || !formData.subject || !formData.description) {
            alert("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const success = await disputeService.createDispute(formData);
            if (success) {
                onSuccess();
                onClose();
                setFormData({
                    booking_id: '',
                    user_id: '',
                    subject: '',
                    description: '',
                    priority: 'MEDIUM'
                });
            }
        } catch (error) {
            alert("Failed to lodge dispute. Ensure all IDs are valid.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="dispute-overlay">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="add-dispute-modal"
                    >
                        <header className="modal-header">
                            <div className="header-title">
                                <ShieldAlert size={20} className="primary-icon" />
                                <h3>Lodge New Dispute</h3>
                            </div>
                            <button className="close-btn" onClick={onClose} disabled={submitting}>
                                <X size={20} />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="dispute-form">
                            <div className="form-section">
                                <label>Target Booking & Guest</label>
                                <div className="booking-selector">
                                    <select
                                        value={formData.booking_id}
                                        onChange={(e) => handleBookingSelect(e.target.value)}
                                        disabled={loadingBookings || submitting}
                                        required
                                    >
                                        <option value="">Select a recent booking...</option>
                                        {bookings.map(b => (
                                            <option key={b.id} value={b.id}>
                                                BK-{String(b.id).padStart(4, '0')} — {b.guest_name || `User ${b.user_id}`}
                                            </option>
                                        ))}
                                    </select>
                                    {loadingBookings && <div className="mini-loader"></div>}
                                </div>
                                <p className="input-hint">Select the reservation associated with the grievance</p>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Case Subject</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Property Condition, Refund Request"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        disabled={submitting}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initial Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        disabled={submitting}
                                    >
                                        <option value="LOW">Low - General Feedback</option>
                                        <option value="MEDIUM">Medium - Service Issue</option>
                                        <option value="HIGH">High - Urgent Conflict</option>
                                        <option value="CRITICAL">Critical - Immediate Action</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Dispute Description</label>
                                <textarea
                                    placeholder="Provide detailed information about the guest's complaint or the conflict at hand..."
                                    rows="4"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    disabled={submitting}
                                    required
                                ></textarea>
                            </div>

                            <div className="dispute-warning">
                                <Info size={16} />
                                <span>Logging a dispute will notify relevant administrators and potentially freeze payouts.</span>
                            </div>

                            <footer className="modal-footer">
                                <button type="button" className="cancel-btn" onClick={onClose} disabled={submitting}>
                                    Discard
                                </button>
                                <button type="submit" className="submit-btn" disabled={submitting}>
                                    {submitting ? (
                                        <>
                                            <RefreshCw className="spin" size={16} />
                                            <span>Lodging Case...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} />
                                            <span>Lodge Dispute</span>
                                        </>
                                    )}
                                </button>
                            </footer>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddDisputePopup;
