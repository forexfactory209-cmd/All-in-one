import React from 'react';
import { Bell, Check, Trash2, ExternalLink, Calendar, MessageSquare, CreditCard, AlertTriangle, Home } from 'lucide-react';
import './NotificationsTable.css';

const NotificationsTable = ({ notifications, loading, onMarkRead, onDelete }) => {
    if (loading) {
        return (
            <div className="notifications-loading">
                <div className="industrial-spinner"></div>
                <span>Syncing notification stream...</span>
            </div>
        );
    }

    const getIcon = (type) => {
        switch (type) {
            case 'BOOKING_REQUEST': return <Calendar size={18} className="icon-booking" />;
            case 'PAYMENT_SUCCESS': return <CreditCard size={18} className="icon-payment" />;
            case 'PROPERTY_VERIFICATION': return <Home size={18} className="icon-property" />;
            case 'NEW_REVIEW': return <MessageSquare size={18} className="icon-review" />;
            case 'DISPUTE_OPENED': return <AlertTriangle size={18} className="icon-dispute" />;
            default: return <Bell size={18} />;
        }
    };

    return (
        <div className="notifications-list-industrial">
            {notifications.map((notif) => (
                <div key={notif.id} className={`notification-item ${notif.status.toLowerCase()} ${notif.priority.toLowerCase()}`}>
                    <div className="item-icon-wrapper">
                        {getIcon(notif.type)}
                        {notif.status === 'UNREAD' && <span className="unread-dot-badge"></span>}
                    </div>

                    <div className="item-content">
                        <div className="content-header">
                            <span className="priority-tag">{notif.priority} PRIORITY</span>
                            <span className="timestamp">{notif.time}</span>
                        </div>
                        <h3 className="notif-title">{notif.title}</h3>
                        <p className="notif-message">{notif.message}</p>

                        <div className="item-actions">
                            <a href={notif.link} className="action-link">
                                <ExternalLink size={14} />
                                <span>View Details</span>
                            </a>
                            <div className="control-btns">
                                {notif.status === 'UNREAD' && (
                                    <button className="control-btn check" onClick={() => onMarkRead(notif.id)} title="Mark as read">
                                        <Check size={16} />
                                    </button>
                                )}
                                <button className="control-btn trash" onClick={() => onDelete(notif.id)} title="Delete">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NotificationsTable;
