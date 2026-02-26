import React, { useState } from 'react';
import { X, Building2, MapPin, Hash, Star, Save, RefreshCw, Plus, CheckCircle, User, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hotelService } from '../services/hotelService';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import './AddHotelPopup.css';

const AddHotelPopup = ({ isOpen, onClose, onSuccess, editData }) => {
    const [formData, setFormData] = useState({
        name: '', location: '', totalRooms: '', basePrice: '', rating: '4.5',
        description: '', ownerName: '', ownerPhone: '', ownerEmail: ''
    });
    const [loading, setLoading] = useState(false);
    const [amenities, setAmenities] = useState([]);
    const [newAmenity, setNewAmenity] = useState('');
    const [images, setImages] = useState([]);

    // Sync state with editData
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                name: editData?.name || '',
                location: editData?.location || '',
                totalRooms: editData?.totalRooms || editData?.total_rooms || '',
                basePrice: editData?.basePrice || editData?.base_price || '',
                rating: editData?.rating || '4.5',
                description: editData?.description || '',
                ownerName: editData?.ownerName || editData?.owner_name || '',
                ownerPhone: editData?.ownerPhone || editData?.owner_phone || '',
                ownerEmail: editData?.ownerEmail || editData?.owner_email || '',
            });

            // Handle amenities
            const baseAmenities = [
                { id: 'wifi', label: 'WiFi', checked: false },
                { id: 'pool', label: 'Pool', checked: false },
                { id: 'spa', label: 'Spa & Wellness', checked: false },
                { id: 'gym', label: 'Gym', checked: false },
                { id: 'restaurant', label: 'Restaurant', checked: false },
                { id: 'room-service', label: 'Room Service', checked: false }
            ];

            const editAmens = editData?.amenities || [];
            const normalizeAmenity = (a) => typeof a === 'string' ? a : (a?.name || a?.label || '');

            if (editData) {
                const updatedAmenities = baseAmenities.map(amn => ({
                    ...amn,
                    checked: editAmens.some(a => normalizeAmenity(a).toLowerCase().trim() === amn.label.toLowerCase().trim())
                }));
                const customAmenities = editAmens
                    .filter(a => {
                        const label = normalizeAmenity(a).toLowerCase().trim();
                        return !baseAmenities.find(b => b.label.toLowerCase().trim() === label);
                    })
                    .map(a => {
                        const label = normalizeAmenity(a);
                        return { id: label.toLowerCase().replace(/\s+/g, '-'), label, checked: true };
                    });
                setAmenities([...updatedAmenities, ...customAmenities]);
            } else {
                setAmenities(baseAmenities.map(amn =>
                    ['WiFi', 'Restaurant', 'Room Service'].includes(amn.label) ? { ...amn, checked: true } : amn
                ));
            }

            // Handle images
            let initialImages = [];
            if (editData) {
                if (editData.images && Array.isArray(editData.images) && editData.images.length > 0) {
                    initialImages = [...editData.images];
                } else if (editData.image || editData.main_image) {
                    initialImages = [editData.image || editData.main_image];
                }
            }
            setImages(initialImages);
        }
    }, [isOpen, editData]);

    const toggleAmenity = (id) => {
        setAmenities(amenities.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleAddAmenity = (e) => {
        if (e) e.preventDefault();
        if (!newAmenity.trim()) return;
        const id = newAmenity.toLowerCase().replace(/\s+/g, '-');
        if (amenities.find(a => a.id === id)) return;
        setAmenities([...amenities, { id, label: newAmenity, checked: true }]);
        setNewAmenity('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const selectedAmenities = amenities.filter(a => a.checked).map(a => a.label);

            const hotelData = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                amenities: selectedAmenities,
                image: images[0] || null,
                images: images,
                ownerName: formData.ownerName,
                ownerPhone: formData.ownerPhone,
                ownerEmail: formData.ownerEmail,
                owner_name: formData.ownerName,
                owner_phone: formData.ownerPhone,
                owner_email: formData.ownerEmail
            };

            if (editData) {
                await hotelService.updateHotel(editData.dbId, hotelData);
            } else {
                await hotelService.addHotel(hotelData);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save hotel', error);
            alert('Failed to save hotel listing.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="popup-overlay" onClick={onClose}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="hotel-registration-modal"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="modal-header-industrial">
                            <div className="h-left">
                                <Building2 size={24} color="var(--color-primary)" />
                                <div className="h-info">
                                    <h2>{editData ? 'Edit Hotel Listing' : 'Register Luxury Hotel'}</h2>
                                    <p>{editData ? 'Modify the property details and key highlights.' : 'Establish a new hotel inventory in the Somstay ecosystem.'}</p>
                                </div>
                            </div>
                            <button className="close-x" onClick={onClose}><X size={20} /></button>
                        </header>

                        <div className="modal-content-scrollable">
                            <form onSubmit={handleSubmit} className="registration-form">
                                <div className="form-grid-industrial">

                                    {/* Hotel Identification */}
                                    <div className="dual-column-grid">
                                        <div className="form-section">
                                            <label>Basic Identification</label>
                                            <div className="input-group-industrial">
                                                <Building2 size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Hotel Brand Name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="input-group-industrial">
                                                <MapPin size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Detailed Location / City"
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <label>Operational Metrics</label>
                                            <div className="dual-inputs">
                                                <div className="input-group-industrial">
                                                    <Hash size={18} />
                                                    <input
                                                        type="number"
                                                        placeholder="Total Rooms"
                                                        value={formData.totalRooms}
                                                        onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="input-group-industrial">
                                                    <span className="price-prefix-hotel">$</span>
                                                    <input
                                                        type="number"
                                                        placeholder="Base Price"
                                                        value={formData.basePrice}
                                                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div className="input-group-industrial">
                                                <Star size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Service Rating (e.g. 4.8)"
                                                    value={formData.rating}
                                                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner Information */}
                                    <div className="form-section full-width">
                                        <label>Owner / Contact Information</label>
                                        <div className="owner-grid-hotel">
                                            <div className="input-group-industrial">
                                                <User size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Owner Full Name"
                                                    value={formData.ownerName}
                                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group-industrial">
                                                <Phone size={18} />
                                                <input
                                                    type="tel"
                                                    placeholder="Phone Number (+252...)"
                                                    value={formData.ownerPhone}
                                                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                                                />
                                            </div>
                                            <div className="input-group-industrial">
                                                <Mail size={18} />
                                                <input
                                                    type="email"
                                                    placeholder="Email Address"
                                                    value={formData.ownerEmail}
                                                    onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-section full-width">
                                        <label>Inventory Meta & Description</label>
                                        <textarea
                                            placeholder="Detailed description of the property, market positioning, and service value..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>

                                    <div className="form-section full-width">
                                        <ImageUploader
                                            value={images}
                                            onChange={setImages}
                                            multiple={true}
                                            label="Hotel Image Gallery — upload multiple, first becomes cover"
                                        />
                                    </div>

                                    <div className="form-section full-width">
                                        <div className="amenities-container-hotel">
                                            <div className="amenities-header-hotel">
                                                <label>Hotel Key Highlights</label>
                                                <div className="add-amenity-input-hotel">
                                                    <input
                                                        type="text"
                                                        placeholder="Add custom..."
                                                        value={newAmenity}
                                                        onChange={(e) => setNewAmenity(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity(e)}
                                                    />
                                                    <button type="button" onClick={handleAddAmenity}>
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="amenities-grid-hotel">
                                                {amenities.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className={`amenity-pill ${item.checked ? 'active' : ''}`}
                                                        onClick={() => toggleAmenity(item.id)}
                                                    >
                                                        <div className="check-box">
                                                            {item.checked && <CheckCircle size={12} />}
                                                        </div>
                                                        <span>{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <footer className="registration-footer">
                                    <button type="button" className="cancel-reg-btn" onClick={onClose}>Discard</button>
                                    <button type="submit" className="submit-reg-btn" disabled={loading}>
                                        {loading ? <RefreshCw className="spin" size={18} /> : <Save size={18} />}
                                        <span>{editData ? 'Update Listing' : 'Establish Listing'}</span>
                                    </button>
                                </footer>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddHotelPopup;
