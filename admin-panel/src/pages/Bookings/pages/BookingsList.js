import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Plus, BookCheck, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { bookingService } from '../services/bookingService';
import BookingsTable from '../sections/BookingsTable';
import AddBookingPopup from '../popups/AddBookingPopup';
import EditBookingPopup from '../popups/EditBookingPopup';
import PageHeader from '../../../components/PageHeader';
import { exportToCSV } from '../../../utils/exportUtils';
import './BookingsPage.css';

const BookingsList = () => {
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('All Bookings');
    const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [assetFilter, setAssetFilter] = useState('All Assets');

    const handleExportCSV = () => {
        const exportData = bookings.map(b => ({
            'Booking ID': b.id,
            'Guest Name': b.guest.name,
            'Guest Phone': b.guest.phone,
            'Property': b.property,
            'City': b.city,
            'Dates': b.dates,
            'Payment Status': b.payment.status,
            'Booking Status': b.status,
            'Total Price': `$${b.total_price}`
        }));
        exportToCSV(exportData, 'SomStay_Bookings_Report');
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingService.getAllBookings();
            const mappedData = data.map(bk => ({
                id: `#BK-${String(bk.id).padStart(4, '0')}`,
                dbId: bk.id,
                guest: {
                    name: bk.guest_name || 'Anonymous',
                    phone: bk.guest_phone || 'N/A'
                },
                property: bk.title || 'Unknown Entity',
                city: bk.location ? bk.location.split(',')[0] : 'Unknown',
                dates: `${new Date(bk.check_in).toLocaleDateString()} - ${new Date(bk.check_out).toLocaleDateString()}`,
                payment: {
                    method: bk.actual_payment_method || 'Unspecified',
                    status: bk.payment_status.toUpperCase()
                },
                status: bk.status,
                total_price: bk.total_price
            }));
            setBookings(mappedData);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDeleteBooking = async (id) => {
        try {
            await bookingService.deleteBooking(id);
            fetchBookings();
        } catch (error) {
            console.error('Error deleting booking:', error);
            alert('Failed to delete booking');
        }
    };

    const handleEditBooking = (booking) => {
        setSelectedBooking(booking);
        setIsEditPopupOpen(true);
    };

    const tabs = [
        { name: 'All Bookings', count: bookings.length },
        { name: 'Confirmed', count: bookings.filter(b => b.status === 'Confirmed').length },
        { name: 'Pending', count: bookings.filter(b => b.status === 'Pending').length },
        { name: 'Cancelled', count: bookings.filter(b => b.status === 'Cancelled').length }
    ];

    const filteredBookings = bookings.filter(b => {
        const matchesTab =
            activeTab === 'All Bookings' ||
            b.status === activeTab;
        const matchesSearch =
            !searchQuery ||
            b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.property.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bookings-container"
        >
            <PageHeader
                icon={<BookCheck size={22} />}
                title="Reservation Engine"
                subtitle="Live overview of all property & hotel reservations"
                stats={[
                    { value: String(bookings.filter(b => b.status === 'Confirmed').length), label: 'Confirmed' },
                    { value: String(bookings.filter(b => b.status === 'Pending').length), label: 'Pending' }
                ]}
                actions={[
                    <button key="export" className="phb-action-btn secondary" onClick={handleExportCSV}>
                        <Download size={17} />
                        <span>Export CSV</span>
                    </button>,
                    <button key="add" className="phb-action-btn" onClick={() => setIsAddPopupOpen(true)}>
                        <Plus size={17} />
                        <span>New Booking</span>
                    </button>
                ]}
            />

            {/* Tabs + Search Bar Row */}
            <div className="bk-toolbar">
                <div className="bk-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.name}
                            className={`bk-tab ${activeTab === tab.name ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            {tab.name}
                            <span className={`bk-tab-badge ${tab.name === 'Confirmed' ? 'badge-confirmed' : tab.name === 'Pending' ? 'badge-pending' : tab.name === 'Cancelled' ? 'badge-cancelled' : ''}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="bk-search-filters">
                    <div className="bk-search-input">
                        <Search size={16} className="bk-search-icon" />
                        <input
                            type="text"
                            placeholder="Search by ID, guest or property..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="bk-select-wrap">
                        <select
                            value={assetFilter}
                            onChange={e => setAssetFilter(e.target.value)}
                        >
                            <option>All Assets</option>
                            <option>Properties</option>
                            <option>Hotel Rooms</option>
                        </select>
                        <ChevronDown size={14} className="bk-select-arrow" />
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bk-table-card">
                <BookingsTable
                    bookings={filteredBookings}
                    loading={loading}
                    onDelete={handleDeleteBooking}
                    onEdit={handleEditBooking}
                />
                <div className="bk-table-footer">
                    <span className="bk-showing-info">
                        Showing <strong>{filteredBookings.length}</strong> of <strong>{bookings.length}</strong> reservations
                    </span>
                </div>
            </div>

            <AddBookingPopup
                isOpen={isAddPopupOpen}
                onClose={() => setIsAddPopupOpen(false)}
                onSuccess={fetchBookings}
            />

            <EditBookingPopup
                isOpen={isEditPopupOpen}
                onClose={() => {
                    setIsEditPopupOpen(false);
                    setSelectedBooking(null);
                }}
                onSuccess={fetchBookings}
                bookingData={selectedBooking}
            />
        </motion.div>
    );
};

export default BookingsList;
