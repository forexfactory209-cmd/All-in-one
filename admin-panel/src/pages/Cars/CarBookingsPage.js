import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Search, Car, Eye, User, CreditCard } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import './CarBookingsPage.css';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:9050/api'}/v1/car-bookings`;

const CarBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewData, setViewData] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get(API_URL);
            setBookings(response.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch car bookings', error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, status, payment_status) => {
        try {
            await axios.put(`${API_URL}/${id}/status`, { status, payment_status });
            fetchBookings();
        } catch (error) {
            alert('Error updating status');
        }
    };

    const filteredBookings = bookings.filter(b => 
        (b.driver_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (b.make || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toString().includes(searchQuery)
    );

    return (
        <div className="car-bookings-container">
            <PageHeader
                icon={<Calendar size={22} />}
                title="Car Reservations"
                subtitle="Manage and track all vehicle rental bookings"
            />

            <div className="search-bar-container">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search by ID, Driver or Car..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="loading-state">Loading reservations...</div>
            ) : (
                <table className="cars-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Vehicle</th>
                            <th>Driver</th>
                            <th>Dates</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map(booking => (
                            <tr key={booking.id}>
                                <td>#{booking.id}</td>
                                <td>
                                    <div className="vehicle-cell">
                                        <img src={booking.main_image || '/placeholder-car.png'} alt="Car" className="table-thumbnail" />
                                        <div>
                                            <p className="bold-text">{booking.make} {booking.model}</p>
                                            <p className="sub-text">{booking.year}</p>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="driver-cell">
                                        <p className="bold-text">{booking.full_name || 'N/A'}</p>
                                        <p className="sub-text">{booking.phone_number}</p>
                                    </div>
                                </td>
                                <td>
                                    <p className="sub-text">{new Date(booking.pickup_date).toLocaleDateString()} - {new Date(booking.return_date).toLocaleDateString()}</p>
                                </td>
                                <td>
                                    <select 
                                        className={`status-select ${booking.status}`}
                                        value={booking.status}
                                        onChange={(e) => handleStatusChange(booking.id, e.target.value, booking.payment_status)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="active">Active (Picked Up)</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <select 
                                        className={`payment-status-select ${booking.payment_status}`}
                                        value={booking.payment_status}
                                        onChange={(e) => handleStatusChange(booking.id, booking.status, e.target.value)}
                                    >
                                        <option value="unpaid">Unpaid</option>
                                        <option value="paid">Paid</option>
                                        <option value="refunded">Refunded</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => setViewData(booking)} className="view-btn">
                                        <Eye size={16} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {viewData && (
                <div className="booking-modal-overlay" onClick={() => setViewData(null)}>
                    <div className="booking-modal-content premium-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3>Booking Details #{viewData.id}</h3>
                                <p className="modal-subtitle">Reserved on {new Date(viewData.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`status-badge-large ${viewData.status}`}>{viewData.status.toUpperCase()}</span>
                        </div>

                        <div className="booking-details-grid">
                            <div className="detail-section full-width">
                                <h4><Car size={18}/> Vehicle Information</h4>
                                <div className="vehicle-info-horizontal">
                                    <img src={viewData.main_image || '/placeholder-car.png'} alt="Car" className="modal-car-image" />
                                    <div className="vehicle-texts">
                                        <h5>{viewData.make} {viewData.model}</h5>
                                        <p>{viewData.year} • {viewData.transmission} • {viewData.location}</p>
                                        <div className="vehicle-stats">
                                            <span><strong>Seats:</strong> {viewData.seats}</span>
                                            <span><strong>Doors:</strong> {viewData.doors}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-card premium-card">
                                <h4><User size={16}/> Driver Details</h4>
                                <div className="detail-row"><span>Name:</span> <strong>{viewData.full_name}</strong></div>
                                <div className="detail-row"><span>Phone:</span> <strong>{viewData.phone_number}</strong></div>
                                <div className="detail-row"><span>Email:</span> <strong>{viewData.email || 'N/A'}</strong></div>
                                <div className="detail-row"><span>Nationality:</span> <strong>{viewData.nationality || 'Somalia'}</strong></div>
                            </div>

                            <div className="detail-card premium-card">
                                <h4><Calendar size={16}/> Rental Logistics</h4>
                                <div className="detail-row"><span>Pickup:</span> <strong>{new Date(viewData.pickup_date).toLocaleDateString()}</strong></div>
                                <div className="detail-row"><span>Return:</span> <strong>{new Date(viewData.return_date).toLocaleDateString()}</strong></div>
                                <div className="detail-row"><span>Location:</span> <strong>{viewData.pickup_location}</strong></div>
                                <div className="detail-row"><span>Delivery:</span> <strong>{viewData.delivery_type === 'hotel' ? `Hotel (${viewData.hotel_room})` : 'Standard'}</strong></div>
                            </div>

                            <div className="detail-card premium-card full-width payment-summary-card">
                                <h4><CreditCard size={16}/> Payment Summary</h4>
                                <div className="payment-grid">
                                    <div className="payment-item">
                                        <label>Rental Total</label>
                                        <span className="price">${viewData.total_price}</span>
                                    </div>
                                    <div className="payment-item">
                                        <label>Security Deposit</label>
                                        <span className="price">${viewData.deposit}</span>
                                    </div>
                                    <div className="payment-item">
                                        <label>Payment Status</label>
                                        <span className={`payment-pill ${viewData.payment_status}`}>{viewData.payment_status.toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="close-modal-btn" onClick={() => setViewData(null)}>Close Details</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarBookingsPage;
