import React, { useState, useEffect } from 'react';
import { X, User, Calendar, CreditCard, ChevronDown, Plus, Minus, Smartphone, DollarSign, CreditCard as CardIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import { userService } from '../../Users/services/userService';
import { propertyService } from '../../Properties/services/propertyService';
import { hotelService } from '../../Hotels/services/hotelService';
import { roomService } from '../../Hotels/services/roomService';
import './AddBookingPopup.css';

const AddBookingPopup = ({ isOpen, onClose, onSuccess }) => {
    const [guests, setGuests] = useState([]);
    const [entities, setEntities] = useState([]); // Combined list of properties and rooms
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        user_id: '',
        entity_key: '', // Format: "Type:ID:Price"
        check_in: '',
        check_out: '',
        guests_count: 1,
        payment_method: 'ZAAD',
        payment_status: 'PENDING'
    });

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const fetchData = async () => {
        try {
            const [usersData, propsData, hotelsData] = await Promise.all([
                userService.getAllUsers(),
                propertyService.getProperties(),
                hotelService.getHotels()
            ]);

            setGuests(usersData.filter(u => u.role === 'Guest' || u.role === 'User'));

            const entityList = [];
            // Add Properties
            propsData.forEach(p => {
                entityList.push({
                    key: `Property:${p.dbId}:${p.priceRaw}`,
                    label: `[Property] ${p.name}`,
                    price: p.priceRaw
                });
            });
            // Add Hotels & Rooms (This might need a bit more work if we want to show all rooms)
            // For now, let's just add the first few rooms of each hotel or handles it simply
            for (const h of hotelsData) {
                try {
                    const rooms = await roomService.getRoomsByHotelId(h.dbId);
                    rooms.forEach(r => {
                        entityList.push({
                            key: `Room:${r.id}:${r.price}`,
                            label: `[Room] ${h.name} - ${r.room_number} (${r.type})`,
                            price: r.price
                        });
                    });
                } catch (e) {
                    console.error(`Error fetching rooms for hotel ${h.dbId}`, e);
                }
            }
            setEntities(entityList);
        } catch (error) {
            console.error('Error fetching booking dependencies:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const calculateNights = () => {
        if (!formData.check_in || !formData.check_out) return 0;
        const start = new Date(formData.check_in);
        const end = new Date(formData.check_out);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const getPricePerNight = () => {
        if (!formData.entity_key) return 0;
        const parts = formData.entity_key.split(':');
        return parseFloat(parts[2]) || 0;
    };

    const nights = calculateNights();
    const pricePerNight = getPricePerNight();
    const totalAmount = nights * pricePerNight;

    const handleSubmit = async () => {
        if (!formData.user_id || !formData.entity_key || !formData.check_in || !formData.check_out) {
            alert('Please fill in all required fields');
            return;
        }

        const [entity_type, entity_id] = formData.entity_key.split(':');

        setLoading(true);
        try {
            await bookingService.addBooking({
                user_id: formData.user_id,
                entity_type,
                entity_id,
                check_in: formData.check_in,
                check_out: formData.check_out,
                total_price: totalAmount,
                status: 'Confirmed',
                payment_status: formData.payment_status,
                payment_method: formData.payment_method
            });
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

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
                            <h2>New Manual Booking</h2>
                            <p>Create a new reservation for walk-in or phone guests</p>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="modal-body scrollable-body">
                        {/* Guest Selection Section */}
                        <section className="booking-section">
                            <div className="section-header-pill">
                                <User size={14} />
                                <span>SELECT GUEST</span>
                            </div>
                            <div className="form-group">
                                <label>Registered Guest</label>
                                <div className="premium-select-wrapper">
                                    <select
                                        name="user_id"
                                        value={formData.user_id}
                                        onChange={handleInputChange}
                                        className="premium-select"
                                    >
                                        <option value="">Select a guest...</option>
                                        {guests.map(g => (
                                            <option key={g.id} value={g.id}>{g.full_name} ({g.phone || g.email})</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} className="select-icon" />
                                </div>
                            </div>
                        </section>

                        {/* Booking Details Section */}
                        <section className="booking-section">
                            <div className="section-header-pill">
                                <Calendar size={14} />
                                <span>BOOKING DETAILS</span>
                            </div>
                            <div className="form-group">
                                <label>Property / Room</label>
                                <div className="premium-select-wrapper">
                                    <select
                                        name="entity_key"
                                        value={formData.entity_key}
                                        onChange={handleInputChange}
                                        className="premium-select"
                                    >
                                        <option value="">Select property or room...</option>
                                        {entities.map(e => (
                                            <option key={e.key} value={e.key}>{e.label} - ${e.price}/night</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={18} className="select-icon" />
                                </div>
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

                        {/* Payment & Status Section */}
                        <section className="booking-section">
                            <div className="payment-status-header">
                                <div className="section-header-pill">
                                    <CreditCard size={14} />
                                    <span>PAYMENT & STATUS</span>
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

                            <div className="payment-methods-grid">
                                {[
                                    { id: 'ZAAD', icon: <Smartphone size={18} />, label: 'ZAAD' },
                                    { id: 'EDAHAB', icon: <Smartphone size={18} />, label: 'EDAHAB' },
                                    { id: 'CASH', icon: <DollarSign size={18} />, label: 'CASH' }
                                ].map(method => (
                                    <div
                                        key={method.id}
                                        className={`payment-method-card ${formData.payment_method === method.id ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, payment_method: method.id }))}
                                    >
                                        <div className="method-icon">{method.icon}</div>
                                        <span className="method-label">{method.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="modal-footer">
                        <div className="price-summary">
                            <div className="price-detail">
                                <span className="label">NIGHTS</span>
                                <span className="value bold">{nights} Nights</span>
                            </div>
                            <div className="divider"></div>
                            <div className="price-detail">
                                <span className="label">RATE / NIGHT</span>
                                <span className="value bold">${pricePerNight.toFixed(2)}</span>
                            </div>
                            <div className="divider"></div>
                            <div className="total-block">
                                <span className="label total">TOTAL AMOUNT</span>
                                <span className="value total-price">${totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="footer-actions">
                            <button className="btn-text-cancel" onClick={onClose} disabled={loading}>Cancel</button>
                            <button className="confirm-booking-btn" onClick={handleSubmit} disabled={loading}>
                                {loading ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddBookingPopup;
