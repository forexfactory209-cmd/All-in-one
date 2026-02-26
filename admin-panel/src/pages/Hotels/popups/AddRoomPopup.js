import React, { useState, useEffect } from 'react';
import { X, Save, RefreshCw, BedDouble, Hash, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { roomService } from '../services/roomService';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import './AddRoomPopup.css';

const AddRoomPopup = ({ isOpen, onClose, onSuccess, hotelId, room }) => {
    const [formData, setFormData] = useState({
        roomNumber: room?.room_number || '',
        type: room?.type || 'Standard Double',
        price: room?.price || '',
        beds: room?.beds || '1',
        maxGuests: room?.max_guests || '2',
        status: room?.status || 'Available',
        description: room?.description || ''
    });
    const [images, setImages] = useState(room?.images || (room?.image_url ? [room.image_url] : []));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (room) {
            setFormData({
                roomNumber: room.room_number,
                type: room.type,
                price: room.price,
                beds: room.beds,
                maxGuests: room.max_guests,
                status: room.status,
                description: room.description || ''
            });
            setImages(room.images || (room.image_url ? [room.image_url] : []));
        } else {
            setFormData({
                roomNumber: '',
                type: 'Standard Double',
                price: '',
                beds: '1',
                maxGuests: '2',
                status: 'Available',
                description: ''
            });
            setImages([]);
        }
    }, [room, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const roomData = {
                ...formData,
                hotelId: hotelId,
                price: parseFloat(formData.price),
                beds: parseInt(formData.beds),
                maxGuests: parseInt(formData.maxGuests),
                imageUrl: images[0] || '',
                images: images
            };

            if (room) {
                await roomService.updateRoom(room.id, roomData);
            } else {
                await roomService.addRoom(roomData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save room", error);
            alert("Failed to save room.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="popup-overlay">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="room-registration-modal"
                    >
                        <header className="room-header-industrial">
                            <h2>{room ? 'Edit Room' : 'Add Room to Inventory'}</h2>
                            <button className="close-x" onClick={onClose}><X size={20} /></button>
                        </header>

                        <form onSubmit={handleSubmit}>
                            <div className="room-form-grid">
                                <div className="room-input-group">
                                    <label>Room Number</label>
                                    <div className="room-input-with-icon">
                                        <Hash size={16} />
                                        <input
                                            type="text"
                                            placeholder="e.g. 101"
                                            value={formData.roomNumber}
                                            onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="room-input-group">
                                    <label>Room Type</label>
                                    <div className="room-input-with-icon">
                                        <BedDouble size={16} />
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option>Standard Double</option>
                                            <option>Deluxe Suite</option>
                                            <option>Executive Suite</option>
                                            <option>Presidential Suite</option>
                                            <option>Single Room</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="room-input-group">
                                    <label>Price per Night</label>
                                    <div className="room-input-with-icon">
                                        <span className="prefix">$</span>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="room-input-group">
                                    <label>Beds</label>
                                    <div className="room-input-with-icon">
                                        <BedDouble size={16} />
                                        <input
                                            type="number"
                                            value={formData.beds}
                                            onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="room-input-group">
                                    <label>Max Guests</label>
                                    <div className="room-input-with-icon">
                                        <Users size={16} />
                                        <input
                                            type="number"
                                            value={formData.maxGuests}
                                            onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="room-input-group">
                                    <label>Status</label>
                                    <div className="room-input-with-icon">
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option>Available</option>
                                            <option>Booked</option>
                                            <option>Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="room-input-group full-width">
                                    <label>Room Description</label>
                                    <textarea
                                        placeholder="Describe the room amenities, view, and unique features..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="room-textarea"
                                    />
                                </div>

                                <div className="room-input-group full-width">
                                    <ImageUploader
                                        value={images}
                                        onChange={setImages}
                                        multiple={true}
                                        label="Room Images Gallery"
                                    />
                                </div>
                            </div>

                            <footer className="room-registration-footer">
                                <button type="button" className="cancel-room-btn" onClick={onClose}>Cancel</button>
                                <button type="submit" className="submit-room-btn" disabled={loading}>
                                    {loading ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                                    <span>{room ? 'Update Room' : 'Add Room'}</span>
                                </button>
                            </footer>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddRoomPopup;
