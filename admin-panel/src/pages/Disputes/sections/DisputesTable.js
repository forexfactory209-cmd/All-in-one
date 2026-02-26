import React from 'react';
import { AlertCircle, Clock, CheckCircle2, MoreHorizontal, ExternalLink, User, Hash } from 'lucide-react';
import './DisputesTable.css';

const DisputesTable = ({ disputes, loading, onUpdateStatus, onRowClick }) => {
    if (loading) {
        return (
            <div className="disputes-loading">
                <div className="industrial-spinner"></div>
                <span>Retrieving dispute registry...</span>
            </div>
        );
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'OPEN': return <AlertCircle size={14} />;
            case 'IN_PROGRESS': return <Clock size={14} />;
            case 'RESOLVED': return <CheckCircle2 size={14} />;
            default: return null;
        }
    };

    return (
        <div className="disputes-table-wrapper">
            <table className="disputes-industrial-table">
                <thead>
                    <tr>
                        <th>CASE ID</th>
                        <th>BOOKING ID</th>
                        <th>GUEST</th>
                        <th>SUBJECT</th>
                        <th>PRIORITY</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {disputes.map((dispute) => (
                        <tr
                            key={dispute.id}
                            className="dispute-row clickable-row"
                            onClick={() => onRowClick && onRowClick(dispute)}
                        >
                            <td>
                                <span className="case-id-badge">{dispute.id}</span>
                            </td>
                            <td>
                                <div className="id-link-cell">
                                    <Hash size={14} />
                                    <span>{dispute.bookingId}</span>
                                </div>
                            </td>
                            <td>
                                <div className="user-info-cell">
                                    <div className="avatar-placeholder">
                                        <User size={14} />
                                    </div>
                                    <span>{dispute.guest}</span>
                                </div>
                            </td>
                            <td>
                                <div className="subject-cell">
                                    <span className="subject-text">{dispute.subject}</span>
                                    <span className="timestamp-hint">{dispute.timestamp}</span>
                                </div>
                            </td>
                            <td>
                                <span className={`priority-indicator ${dispute.priority.toLowerCase()}`}>
                                    {dispute.priority}
                                </span>
                            </td>
                            <td>
                                <div className={`status-pill ${dispute.status.toLowerCase()}`}>
                                    {getStatusIcon(dispute.status)}
                                    <span>{dispute.status.replace('_', ' ')}</span>
                                </div>
                            </td>
                            <td>
                                <div className="action-btns">
                                    <button className="icon-btn-ghost" title="View Details">
                                        <ExternalLink size={16} />
                                    </button>
                                    <button className="icon-btn-ghost" title="More Options">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DisputesTable;
