import React, { useState, useEffect } from 'react';
import { X, UserPlus, ChevronDown, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userService } from '../services/userService';
import './AddGuestPopup.css';

const AddGuestPopup = ({ isOpen, onClose, onSuccess, editData = null }) => {
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        email: '',
        gender: '',
        dob: '',
        city: '',
        district: '',
        address: '',
        national_id: '',
        role: 'Guest',
        status: 'Active'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                full_name: editData.full_name || editData.name || '',
                phone: editData.phone || (editData.basicInfo && editData.basicInfo.phone) || '',
                email: editData.email || (editData.basicInfo && editData.basicInfo.email) || '',
                gender: editData.gender || (editData.basicInfo && editData.basicInfo.gender) || '',
                dob: editData.dob || (editData.basicInfo && editData.basicInfo.dob) || '',
                city: editData.city || (editData.regionalDetails && editData.regionalDetails.city) || '',
                district: editData.district || (editData.regionalDetails && editData.regionalDetails.district) || '',
                address: editData.address || (editData.regionalDetails && editData.regionalDetails.fullAddress) || '',
                national_id: editData.national_id || (editData.regionalDetails && editData.regionalDetails.nationalId) || '',
                role: editData.role || 'Guest',
                status: editData.status || (editData.accountStatus === 'Active' ? 'Active' : 'Inactive') || 'Active'
            });
        } else {
            setFormData({
                full_name: '',
                phone: '',
                email: '',
                gender: '',
                dob: '',
                city: '',
                district: '',
                address: '',
                national_id: '',
                role: 'Guest',
                status: 'Active'
            });
        }
    }, [editData, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked ? 'Active' : 'Inactive' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const isEdit = !!editData;

    const handleSubmit = async () => {
        if (!formData.full_name || !formData.phone) {
            alert('Full Name and Phone Number are required');
            return;
        }

        setLoading(true);
        try {
            const userId = editData?.dbId || editData?.id;
            console.log('Saving Guest. isEdit:', isEdit, 'userId:', userId);

            if (isEdit && userId) {
                await userService.updateUser(userId, formData);
            } else {
                await userService.addUser(formData);
            }
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Error saving guest:', error);
            alert('Failed to save guest. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="modal-content-large"
                >
                    <div className="modal-header">
                        <div>
                            <h2>{isEdit ? 'Update Guest Profile' : 'Add New Guest'}</h2>
                            <p className="modal-subtitle">{isEdit ? `Modifying details for ${formData.full_name}` : 'Register a new guest to the management system.'}</p>
                        </div>
                        <button className="close-btn" onClick={onClose}><X size={20} /></button>
                    </div>

                    <div className="modal-body">
                        <div className="form-grid">
                            <div className="form-group-half">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Abdullahi Mohamed"
                                />
                            </div>
                            <div className="form-group-half">
                                <label>Phone Number</label>
                                <div className="phone-input-group">
                                    <span className="country-code">+252</span>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="61XXXXXXX"
                                    />
                                </div>
                            </div>

                            <div className="form-group-half">
                                <label>Gender</label>
                                <div className="custom-select-wrapper">
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <ChevronDown size={18} className="select-icon" />
                                </div>
                            </div>

                            <div className="form-group-half">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formData.dob ? (formData.dob.includes('T') ? formData.dob.split('T')[0] : formData.dob) : ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group-half">
                                <label>City</label>
                                <div className="custom-select-wrapper">
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select City</option>
                                        <option value="Hargeisa">Hargeisa</option>
                                        <option value="Berbera">Berbera</option>
                                        <option value="Borama">Borama</option>
                                        <option value="Mogadishu">Mogadishu</option>
                                        <option value="Garowe">Garowe</option>
                                        <option value="Kismayo">Kismayo</option>
                                    </select>
                                    <ChevronDown size={18} className="select-icon" />
                                </div>
                            </div>

                            <div className="form-group-half">
                                <label>District</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 26 June"
                                />
                            </div>

                            <div className="form-group-half">
                                <label>National ID</label>
                                <input
                                    type="text"
                                    name="national_id"
                                    value={formData.national_id}
                                    onChange={handleInputChange}
                                    placeholder="ID Number"
                                />
                            </div>

                            <div className="form-group-half">
                                <label>Account Status</label>
                                <div className="toggle-group">
                                    <span className={`toggle-label ${formData.status !== 'Active' ? 'active' : 'muted'}`}>Inactive</span>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            name="status"
                                            checked={formData.status === 'Active'}
                                            onChange={handleInputChange}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                    <span className={`toggle-label ${formData.status === 'Active' ? 'active' : 'muted'}`}>Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter complete residential address"
                                rows="3"
                            ></textarea>
                        </div>

                        <div className="optional-section">
                            <h3 className="section-title-small">CONTACT & SECURITY</h3>
                            <div className="form-grid">
                                <div className="form-group-half">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="example@domain.com"
                                    />
                                </div>
                                <div className="form-group-half">
                                    <label>Role</label>
                                    <div className="custom-select-wrapper">
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                        >
                                            <option value="Guest">Guest</option>
                                            <option value="Owner">Owner</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                        <ChevronDown size={18} className="select-icon" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="cancel-footer-btn" onClick={onClose} disabled={loading}>Cancel</button>
                        <button className="submit-footer-btn" onClick={handleSubmit} disabled={loading}>
                            {isEdit ? <Save size={18} /> : <UserPlus size={18} />}
                            <span>{loading ? 'Saving...' : (isEdit ? 'Update Details' : 'Create Guest')}</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddGuestPopup;
