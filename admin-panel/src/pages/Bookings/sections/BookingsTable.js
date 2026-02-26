import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';
import './BookingsTable.css';

const BookingsTable = ({ bookings, loading, onDelete, onEdit }) => {
    const navigate = useNavigate();

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this booking?')) {
            onDelete(id);
        }
    };

    const handleEdit = (e, booking) => {
        e.stopPropagation();
        onEdit(booking);
    };

    if (loading) {
        return (
            <div className="bookings-table-loading">
                <div className="loading-spinner"></div>
                <span>Syncing reservations...</span>
            </div>
        );
    }

    return (
        <div className="bookings-table-wrapper">
            <table className="bookings-table">
                <thead>
                    <tr>
                        <th>BOOKING ID</th>
                        <th>GUEST</th>
                        <th>PROPERTY</th>
                        <th>CITY</th>
                        <th>DATES</th>
                        <th>PAYMENT</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr
                            key={booking.id}
                            onClick={() => navigate(`/bookings/${booking.id.replace('#BK-', '')}`)}
                            className="clickable-row"
                        >
                            <td className="booking-id-col">{booking.id}</td>
                            <td>
                                <div className="guest-detail">
                                    <span className="guest-name-main">{booking.guest.name}</span>
                                    <span className="guest-phone-sub">{booking.guest.phone}</span>
                                </div>
                            </td>
                            <td className="prop-name-col">{booking.property}</td>
                            <td>
                                <span className="city-label-pill">{booking.city}</span>
                            </td>
                            <td className="dates-col">{booking.dates}</td>
                            <td>
                                <div className="payment-stack">
                                    <span className="pay-method-name">{booking.payment.method}</span>
                                    <span className={`pay-status-mini ${booking.payment.status.toLowerCase()}`}>
                                        {booking.payment.status}
                                    </span>
                                </div>
                            </td>
                            <td>
                                <span className={`booking-status-badge ${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </span>
                            </td>
                            <td>
                                <div className="actions-cell">
                                    <button
                                        className="action-edit-btn"
                                        onClick={(e) => handleEdit(e, booking)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="action-delete-btn"
                                        onClick={(e) => handleDelete(e, booking.dbId || booking.id.replace('#BK-', ''))}
                                    >
                                        <Trash2 size={16} />
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

export default BookingsTable;
