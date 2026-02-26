import React, { useState } from 'react';
import { X, Info, MapPin, DollarSign, Home, CheckCircle, Image as ImageIcon, Plus, RefreshCw, User, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { propertyService } from '../services/propertyService';
import ImageUploader from '../../../components/ImageUploader/ImageUploader';
import './AddPropertyPopup.css';

const AddPropertyPopup = ({ isOpen, onClose, onSuccess, editData }) => {
    const [formData, setFormData] = useState({
        name: '', type: 'Home', description: '', city: 'Hargeisa', address: '', price: '',
        bedrooms: 1, bathrooms: 1, maxGuests: 2, ownerName: '', ownerPhone: '', ownerEmail: ''
    });
    const [loading, setLoading] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [amenities, setAmenities] = useState([]);
    const [newAmenity, setNewAmenity] = useState('');
    const [images, setImages] = useState([]);

    // Populate data when opening for edit or new
    React.useEffect(() => {
        if (isOpen) {
            const initialData = {
                name: editData?.name || '',
                type: editData?.type || 'Home',
                description: editData?.description || '',
                city: editData?.location?.split(',')[0] || 'Hargeisa',
                address: editData?.address || '',
                price: editData?.priceRaw || editData?.price_per_night || '',
                bedrooms: editData?.bedrooms || 1,
                bathrooms: editData?.bathrooms || 1,
                maxGuests: editData?.maxGuests || editData?.max_guests || 2,
                ownerName: editData?.ownerName || editData?.owner_name || '',
                ownerPhone: editData?.ownerPhone || editData?.owner_phone || '',
                ownerEmail: editData?.ownerEmail || editData?.owner_email || '',
            };
            setFormData(initialData);
            setIsActive(editData?.status !== 'Inactive');

            // Handle amenities
            const baseAmenities = [
                { id: 'wifi', label: 'WiFi', checked: false },
                { id: 'ac', label: 'Air Conditioning', checked: false },
                { id: 'parking', label: 'Free Parking', checked: false },
                { id: 'generator', label: 'Generator Backup', checked: false },
                { id: 'kitchen', label: 'Modern Kitchen', checked: false },
                { id: 'security', label: '24/7 Security', checked: false }
            ];

            const editAmens = editData?.amenities || [];
            const normalizeAmenity = (a) => typeof a === 'string' ? a : (a?.name || a?.label || '');

            if (editData) {
                const updatedAmenities = baseAmenities.map(amn => ({
                    ...amn,
                    checked: editAmens.some(a => normalizeAmenity(a).toLowerCase().trim() === amn.label.toLowerCase().trim())
                }));
                // Also add any custom amenities from editData that aren't in base
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
                setAmenities(baseAmenities.map(amn => (
                    ['WiFi', 'Air Conditioning', 'Free Parking'].includes(amn.label) ? { ...amn, checked: true } : amn
                )));
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

    if (!isOpen) return null;

    const toggleAmenity = (id) => {
        setAmenities(amenities.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleAddAmenity = (e) => {
        e.preventDefault();
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
            const propertyData = {
                ...formData,
                status: isActive ? 'Active' : 'Inactive',
                location: `${formData.city}, Somaliland`,
                amenities: selectedAmenities,
                price: parseFloat(formData.price),
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
                await propertyService.updateProperty(editData.dbId, propertyData);
            } else {
                await propertyService.addProperty(propertyData);
            }

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to save property', error);
            alert('Failed to save property. Check console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="modal-content add-property-modal"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="modal-header">
                        <div className="title-block">
                            <h2>{editData ? 'Edit Property' : 'Add New Property'}</h2>
                            <p>SOMALILAND Rental Portal</p>
                        </div>
                        <button className="close-btn" onClick={onClose}>
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="modal-body scrollable-body">
                        {/* Basic Information */}
                        <section className="property-section">
                            <div className="section-header-pill">
                                <Info size={14} />
                                <span>Basic Information</span>
                            </div>
                            <div className="form-group">
                                <label>Property Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Hargeisa Luxury Heights"
                                    className="premium-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row align-center">
                                <div className="form-group flex-1">
                                    <label>Property Type</label>
                                    <select
                                        className="premium-select"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Home">Home</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Cabin">Cabin</option>
                                        <option value="Loft">Loft</option>
                                    </select>
                                </div>
                                <div className="status-toggle-group">
                                    <label>Active Status</label>
                                    <div
                                        className={`premium-toggle ${isActive ? 'active' : ''}`}
                                        onClick={() => setIsActive(!isActive)}
                                    >
                                        <div className="toggle-handle"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="Enter a detailed description of the property features..."
                                    className="premium-textarea"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                        </section>

                        {/* Owner Information */}
                        <section className="property-section">
                            <div className="section-header-pill">
                                <User size={14} />
                                <span>Owner Information</span>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Owner Name</label>
                                    <div className="input-with-icon">
                                        <User size={14} className="input-inner-icon" />
                                        <input
                                            type="text"
                                            placeholder="Full name of the owner"
                                            className="premium-input icon-indent"
                                            value={formData.ownerName}
                                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="form-group flex-1">
                                    <label>Phone Number</label>
                                    <div className="input-with-icon">
                                        <Phone size={14} className="input-inner-icon" />
                                        <input
                                            type="tel"
                                            placeholder="+252 63 000 0000"
                                            className="premium-input icon-indent"
                                            value={formData.ownerPhone}
                                            onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email Address</label>
                                <div className="input-with-icon">
                                    <Mail size={14} className="input-inner-icon" />
                                    <input
                                        type="email"
                                        placeholder="owner@example.com"
                                        className="premium-input icon-indent"
                                        value={formData.ownerEmail}
                                        onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Location Details */}
                        <section className="property-section">
                            <div className="section-header-pill">
                                <MapPin size={14} />
                                <span>Location Details</span>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>City (Somaliland)</label>
                                    <select
                                        className="premium-select"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option>Hargeisa</option>
                                        <option>Berbera</option>
                                        <option>Borama</option>
                                        <option>Burao</option>
                                        <option>Erigavo</option>
                                        <option>Gabiley</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Full Address</label>
                                <input
                                    type="text"
                                    placeholder="Street, District, Near landmarks..."
                                    className="premium-input"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </section>

                        {/* Pricing */}
                        <section className="property-section">
                            <div className="section-header-pill">
                                <DollarSign size={14} />
                                <span>Pricing</span>
                            </div>
                            <div className="form-group half-width">
                                <label>Price per Night (USD)</label>
                                <div className="input-with-icon">
                                    <span className="price-prefix">$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        className="premium-input price-indent"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Property Details & Dynamic Amenities */}
                        <section className="property-section">
                            <div className="section-header-pill">
                                <Home size={14} />
                                <span>Property Details & Amenities</span>
                            </div>
                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label>Bedrooms</label>
                                    <input
                                        type="number"
                                        className="premium-input"
                                        min={1}
                                        value={formData.bedrooms}
                                        onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Bathrooms</label>
                                    <input
                                        type="number"
                                        className="premium-input"
                                        min={1}
                                        value={formData.bathrooms}
                                        onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="form-group flex-1">
                                    <label>Max Guests</label>
                                    <input
                                        type="number"
                                        className="premium-input"
                                        min={1}
                                        value={formData.maxGuests}
                                        onChange={(e) => setFormData({ ...formData, maxGuests: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="amenities-container">
                                <div className="amenities-header">
                                    <label className="sub-label">Select Amenities</label>
                                    <div className="add-amenity-input-group">
                                        <input
                                            type="text"
                                            placeholder="Add custom amenity..."
                                            value={newAmenity}
                                            onChange={(e) => setNewAmenity(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddAmenity(e)}
                                        />
                                        <button type="button" onClick={handleAddAmenity} className="add-amenity-btn">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="amenities-grid">
                                    {amenities.map((item) => (
                                        <div key={item.id} className="amenity-item" onClick={() => toggleAmenity(item.id)}>
                                            <div className={`checkbox-circle ${item.checked ? 'checked' : ''}`}>
                                                {item.checked && <CheckCircle size={14} />}
                                            </div>
                                            <span>{item.label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Property Image Upload */}
                        <section className="property-section">
                            <div className="section-header-pill">
                                <ImageIcon size={14} />
                                <span>Property Image Gallery</span>
                            </div>
                            <ImageUploader
                                value={images}
                                onChange={setImages}
                                multiple={true}
                                label="Upload multiple images — first image becomes the cover"
                            />
                        </section>

                        <div className="modal-footer simple-footer">
                            <button type="button" className="btn-text-cancel" onClick={onClose}>Cancel</button>
                            <button type="submit" className="save-property-btn" disabled={loading}>
                                {loading ? <RefreshCw className="spin" size={18} /> : <CheckCircle size={18} />}
                                <span>{loading ? 'Saving...' : (editData ? 'Update Property' : 'Save Property')}</span>
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddPropertyPopup;
