import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit } from 'lucide-react';
import './UsersTable.css';

const UsersTable = ({ users, loading, onDelete, onEdit }) => {
    const navigate = useNavigate();

    const handleDelete = (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this guest?')) {
            onDelete(id);
        }
    };

    const handleEdit = (e, user) => {
        e.stopPropagation();
        onEdit(user);
    };

    if (loading) {
        return (
            <div className="users-table-loading">
                <div className="loader-spinner"></div>
                <span>Cataloging guests...</span>
            </div>
        );
    }

    return (
        <div className="users-table-wrapper">
            <table className="users-table">
                <thead>
                    <tr>
                        <th className="th-guest">GUEST</th>
                        <th>CONTACT INFO</th>
                        <th>CITY</th>
                        <th className="text-center">BOOKINGS</th>
                        <th>LAST ACTIVITY</th>
                        <th>ACCOUNT</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} onClick={() => navigate(`/users/${user.id.replace('GS-', '')}`)} className="clickable-row">
                            <td>
                                <div className="guest-profile-cell">
                                    {user.avatar ? (
                                        <div className="guest-avatar-wrapper">
                                            <img src={user.avatar} alt={user.name} />
                                        </div>
                                    ) : (
                                        <div className="guest-id-initials">
                                            ID
                                        </div>
                                    )}
                                    <span className="guest-name-text">{user.name}</span>
                                </div>
                            </td>
                            <td className="contact-col">{user.phone}</td>
                            <td className="city-col">{user.city}</td>
                            <td className="text-center">
                                <span className={`bookings-count-pill ${user.bookings > 0 ? 'has-bookings' : ''}`}>
                                    {user.bookings}
                                </span>
                            </td>
                            <td className="activity-col">
                                <span className={user.lastActivity === 'No bookings' ? 'text-muted' : ''}>
                                    {user.lastActivity}
                                </span>
                            </td>
                            <td>
                                <span className={`status-badge-compact ${user.status.toLowerCase()}`}>
                                    {user.status}
                                </span>
                            </td>
                            <td>
                                <div className="actions-cell">
                                    <button
                                        className="action-edit-btn"
                                        onClick={(e) => handleEdit(e, user)}
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        className="action-delete-btn"
                                        onClick={(e) => handleDelete(e, user.dbId || user.id.replace('GS-', ''))}
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

export default UsersTable;
