import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronRight,
    ChevronLeft,
    Edit3,
    Calendar,
    User,
    MapPin,
    Clock,
    AlertCircle,
    UserX,
    UserCheck,
    Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '../services/userService';
import { bookingService } from '../../Bookings/services/bookingService';
import PageHeader from '../../../components/PageHeader';
import AddGuestPopup from '../popups/AddGuestPopup';
import { exportToCSV } from '../../../utils/exportUtils';
import './GuestProfilePage.css';

const GuestProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [guest, setGuest] = useState(null);
    const [rawUserData, setRawUserData] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);

    const handleExportActivity = () => {
        if (!guest) return;
        const exportData = guest.bookingHistory.map(bk => ({
            'Guest': guest.name,
            'Booking ID': bk.id,
            'Property': bk.property,
            'Dates': bk.dates,
            'Payment': bk.payment,
            'Status': bk.status
        }));
        exportToCSV(exportData, `SomStay_Activity_${guest.name.replace(/\s+/g, '_')}`);
    };

    const fetchGuestData = useCallback(async () => {
        setLoading(true);
        try {
            const userData = await userService.getUserById(id);
            const userBookings = await bookingService.getBookingsByUserId(id);

            if (userData) {
                setRawUserData(userData);

                // Calculate profile completeness
                const requiredFields = ['full_name', 'phone', 'email', 'gender', 'dob', 'city', 'district', 'address', 'national_id'];
                const filledFields = requiredFields.filter(f => userData[f] && userData[f] !== 'Not provided' && userData[f] !== 'Not specified');
                const isComplete = filledFields.length === requiredFields.length;

                setGuest({
                    id: `#G-${String(userData.id).padStart(5, '0')}`,
                    dbId: userData.id,
                    name: userData.full_name,
                    avatar: userData.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
                    lastActive: 'Active recently',
                    registrationDate: new Date(userData.created_at).toLocaleDateString(),
                    profileStatus: isComplete ? 'Complete' : 'Incomplete',
                    accountStatus: userData.status || 'Active',
                    basicInfo: {
                        fullName: userData.full_name,
                        phone: userData.phone || 'Not provided',
                        email: userData.email || 'Not provided',
                        gender: userData.gender || 'Not specified',
                        dob: userData.dob ? new Date(userData.dob).toLocaleDateString() : 'Not provided'
                    },
                    regionalDetails: {
                        city: userData.city || 'Not provided',
                        district: userData.district || 'Not provided',
                        fullAddress: userData.address || 'Not provided',
                        nationalId: userData.national_id || 'Not provided'
                    },
                    bookingHistory: userBookings.map(bk => ({
                        id: `#BK-${String(bk.id).padStart(5, '0')}`,
                        dbId: bk.id,
                        property: bk.title || 'Unknown Entity',
                        unit: bk.entity_type,
                        dates: `${new Date(bk.check_in).toLocaleDateString()} - ${new Date(bk.check_out).toLocaleDateString()}`,
                        payment: bk.payment_status.toUpperCase(),
                        status: bk.status.toUpperCase()
                    }))
                });
            }
        } catch (error) {
            console.error('Failed to load guest profile dossier:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchGuestData();
    }, [fetchGuestData]);

    const handleDeactivate = async () => {
        const isDeactivating = guest.accountStatus === 'Active';
        const confirmMsg = isDeactivating
            ? "Are you sure you want to deactivate this guest? They will no longer be able to log in."
            : "Reacting this guest will restore their access. Continue?";

        if (window.confirm(confirmMsg)) {
            try {
                await userService.updateUser(guest.dbId, { status: isDeactivating ? 'Inactive' : 'Active' });
                fetchGuestData();
            } catch (error) {
                alert("Failed to update account status.");
            }
        }
    };

    if (loading || !guest) return (
        <div className="profile-loading">
            <div className="industrial-spinner"></div>
            <span>Loading Guest Profile...</span>
        </div>
    );

    const isDeactivated = guest.accountStatus !== 'Active';

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="guest-profile-container"
        >
            <PageHeader
                backAction={() => navigate('/users')}
                icon={<User size={22} />}
                title={guest.name}
                subtitle={`Guest ID: ${guest.id} • Last active: ${guest.lastActive}`}
                stats={[
                    { value: String(guest.bookingHistory.length), label: 'Rentals' },
                    { value: guest.registrationDate, label: 'Joined' }
                ]}
                actions={[
                    <button key="export" className="phb-action-btn secondary" onClick={handleExportActivity}>
                        <Download size={17} />
                        <span>Export Activity</span>
                    </button>,
                    <button key="edit" className="phb-action-btn" onClick={() => setShowEditPopup(true)}>
                        <Edit3 size={17} />
                        <span>Edit Profile</span>
                    </button>,
                    <button
                        key="deactivate"
                        className={`phb-action-btn ${isDeactivated ? 'success' : 'danger'}`}
                        style={{ background: isDeactivated ? '#10b981' : '#ef4444', color: '#fff' }}
                        onClick={handleDeactivate}
                    >
                        {isDeactivated ? <UserCheck size={16} /> : <UserX size={16} />}
                        <span>{isDeactivated ? 'Reactivate' : 'Deactivate'}</span>
                    </button>
                ]}
            />

            {/* Quick Stats Grid */}
            <div className="quick-stats-row">
                <div className="status-card">
                    <span className="card-label">Registration Date</span>
                    <div className="card-val-group">
                        <Calendar size={18} color="#0288AC" />
                        <span className="card-value">{guest.registrationDate}</span>
                    </div>
                </div>
                <div className="status-card">
                    <span className="card-label">Profile Status</span>
                    <div className="card-val-group">
                        <span className={`status-dot ${guest.profileStatus === 'Complete' ? 'active' : 'warning'}`}></span>
                        <span className="card-value">{guest.profileStatus}</span>
                    </div>
                </div>
                <div className="status-card">
                    <span className="card-label">Account Status</span>
                    <div className="card-val-group">
                        <span className={`status-dot ${guest.accountStatus === 'Active' ? 'active' : 'danger'}`}></span>
                        <span className="card-value">{guest.accountStatus}</span>
                    </div>
                </div>
            </div>

            {/* Details Split View */}
            <div className="details-split-grid">
                <div className="details-info-card">
                    <div className="card-header-icon">
                        <User size={18} />
                        <h3>Basic Information</h3>
                    </div>
                    <div className="info-grid-content">
                        <div className="info-item">
                            <span className="label">FULL NAME</span>
                            <span className="value">{guest.basicInfo.fullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">PHONE NUMBER</span>
                            <span className="value">{guest.basicInfo.phone}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">EMAIL ADDRESS</span>
                            <span className="value">{guest.basicInfo.email}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">GENDER</span>
                            <span className="value">{guest.basicInfo.gender}</span>
                        </div>
                        <div className="info-item-wide">
                            <span className="label">DATE OF BIRTH</span>
                            <span className="value">{guest.basicInfo.dob}</span>
                        </div>
                    </div>
                </div>

                <div className="details-info-card">
                    <div className="card-header-icon">
                        <MapPin size={18} />
                        <h3>Regional Details (Somaliland)</h3>
                    </div>
                    <div className="info-grid-content">
                        <div className="info-item">
                            <span className="label">CITY</span>
                            <span className="value">{guest.regionalDetails.city}</span>
                        </div>
                        <div className="info-item">
                            <span className="label">DISTRICT</span>
                            <span className="value">{guest.regionalDetails.district}</span>
                        </div>
                        <div className="info-item-wide">
                            <span className="label">FULL ADDRESS</span>
                            <span className="value">{guest.regionalDetails.fullAddress}</span>
                        </div>
                        <div className="info-item-wide">
                            <span className="label">NATIONAL ID</span>
                            <div className="id-provided-group">
                                <AlertCircle size={14} color="#CED4D6" />
                                <span className={`value ${guest.regionalDetails.nationalId === 'Not provided' ? 'muted' : ''}`}>
                                    {guest.regionalDetails.nationalId}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking History Table */}
            <div className="booking-history-card">
                <div className="history-header">
                    <div className="header-title-group">
                        <Clock size={18} />
                        <h3>Booking History</h3>
                    </div>
                    <button className="download-report-btn">Download Report</button>
                </div>
                <div className="table-overflow-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>BOOKING ID</th>
                                <th>PROPERTY</th>
                                <th>DATES</th>
                                <th>PAYMENT STATUS</th>
                                <th>BOOKING STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guest.bookingHistory.length > 0 ? (
                                guest.bookingHistory.map((bk) => (
                                    <tr key={bk.id} onClick={() => navigate(`/bookings/${bk.dbId}`)} className="clickable-row">
                                        <td className="bk-id">{bk.id}</td>
                                        <td>
                                            <div className="bk-property-cell">
                                                <span className="p-name">{bk.property}</span>
                                                <span className="p-sub">{bk.unit}</span>
                                            </div>
                                        </td>
                                        <td className="bk-dates">{bk.dates}</td>
                                        <td>
                                            <span className={`payment-pill ${bk.payment.toLowerCase()}`}>{bk.payment}</span>
                                        </td>
                                        <td>
                                            <span className={`bk-status-pill ${bk.status.toLowerCase()}`}>{bk.status}</span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-table-msg">No booking history found for this guest.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="card-footer-simple">
                    Showing {guest.bookingHistory.length} results
                    <div className="footer-nav-simple">
                        <ChevronLeft size={16} />
                        <ChevronRight size={16} />
                    </div>
                </div>
            </div>

            <AddGuestPopup
                isOpen={showEditPopup}
                onClose={() => setShowEditPopup(false)}
                onSuccess={fetchGuestData}
                editData={rawUserData}
            />
        </motion.div>
    );
};

export default GuestProfilePage;
