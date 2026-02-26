import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Hash, MessageSquare, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { disputeService } from '../services/disputeService';
import './DisputeDetailsPopup.css';

const DisputeDetailsPopup = ({ isOpen, onClose, dispute, onUpdateStatus }) => {
    const [resolving, setResolving] = React.useState(false);
    if (!dispute) return null;

    const isResolved = dispute.status === 'RESOLVED';

    const handleResolve = async () => {
        setResolving(true);
        try {
            const success = await disputeService.updateDisputeStatus(dispute.dbId || dispute.id, 'RESOLVED');
            if (success) {
                onUpdateStatus(dispute.dbId || dispute.id, 'RESOLVED');
                onClose();
            }
        } catch (error) {
            alert("Failed to resolve dispute. Please check connectivity.");
        } finally {
            setResolving(false);
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
                        className="dispute-modal"
                    >
                        <header className="dispute-modal-header">
                            <div className="header-badge">
                                <ShieldAlert size={18} />
                                <span>Case Details</span>
                            </div>
                            <button className="close-btn" onClick={onClose}>
                                <X size={20} />
                            </button>
                        </header>

                        <div className="dispute-modal-body">
                            <div className="case-id-hero">
                                <div className="id-label">CASE REFERENCE</div>
                                <div className="id-value">{dispute.id}</div>
                                <div className={`priority-tag ${dispute.priority.toLowerCase()}`}>
                                    {dispute.priority} PRIORITY
                                </div>
                            </div>

                            <div className="grid-details">
                                <div className="detail-card">
                                    <Hash size={16} />
                                    <div className="info">
                                        <label>Booking ID</label>
                                        <span>{dispute.bookingId}</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <User size={16} />
                                    <div className="info">
                                        <label>Guest</label>
                                        <span>{dispute.guest}</span>
                                    </div>
                                </div>
                                <div className="detail-card">
                                    <Calendar size={16} />
                                    <div className="info">
                                        <label>Logged</label>
                                        <span>{dispute.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="message-section">
                                <div className="section-title">
                                    <MessageSquare size={16} />
                                    <span>Subject: {dispute.subject}</span>
                                </div>
                                <div className="message-bubble">
                                    {dispute.message}
                                </div>
                            </div>

                            <div className="resolution-path">
                                <div className="section-title">RESOLUTION LOG</div>
                                <div className="timeline">
                                    <div className="timeline-item active">
                                        <div className="dot"></div>
                                        <div className="content">
                                            <div className="title">Case Opened</div>
                                            <div className="desc">System registered dispute via mobile app.</div>
                                        </div>
                                    </div>
                                    {dispute.status !== 'OPEN' && (
                                        <div className="timeline-item active">
                                            <div className="dot"></div>
                                            <div className="content">
                                                <div className="title">Under Review</div>
                                                <div className="desc">Administrator is investigating the claim.</div>
                                            </div>
                                        </div>
                                    )}
                                    {isResolved && (
                                        <div className="timeline-item active success">
                                            <div className="dot"></div>
                                            <div className="content">
                                                <div className="title">Resolved</div>
                                                <div className="desc">Case concluded and closed by Support Team.</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isResolved && (
                            <footer className="dispute-modal-footer">
                                <div className="warning-note">
                                    <AlertTriangle size={14} />
                                    <span>Closing this case is permanent. Ensure guest is satisfied.</span>
                                </div>
                                <div className="footer-btns">
                                    <button
                                        className="resolve-btn"
                                        onClick={handleResolve}
                                        disabled={resolving}
                                    >
                                        {resolving ? (
                                            <div className="tiny-spinner"></div>
                                        ) : (
                                            <CheckCircle size={18} />
                                        )}
                                        <span>{resolving ? 'Resolving...' : 'Mark as Resolved'}</span>
                                    </button>
                                </div>
                            </footer>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DisputeDetailsPopup;
