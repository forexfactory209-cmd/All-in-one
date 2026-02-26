import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    MapPin,
    Star,
    BedDouble,
    ArrowRight,
    Building2,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    Clock,
    TrendingUp,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { hotelService } from '../services/hotelService';
import AddHotelPopup from '../popups/AddHotelPopup';
import PageHeader from '../../../components/PageHeader';
import './HotelsPage.css';

const HOTELS_PER_PAGE = 6;

const HotelsList = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [activeTab, setActiveTab] = useState('Hotels');
    const [currentPage, setCurrentPage] = useState(1);
    const [editHotel, setEditHotel] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const handleEdit = (hotel) => {
        setEditHotel(hotel);
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setEditHotel(null);
    };

    useEffect(() => {
        loadHotels();
    }, []);

    const loadHotels = async () => {
        setLoading(true);
        try {
            const data = await hotelService.getHotels();
            setHotels(data);
        } catch (error) {
            console.error("Failed to load hotels", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchTab = (tab) => {
        if (tab === 'Properties') navigate('/properties');
        else setActiveTab(tab);
    };

    // Filter logic
    const filteredHotels = hotels.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || h.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredHotels.length / HOTELS_PER_PAGE);
    const startIndex = (currentPage - 1) * HOTELS_PER_PAGE;
    const endIndex = startIndex + HOTELS_PER_PAGE;
    const paginatedHotels = filteredHotels.slice(startIndex, endIndex);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const renderPageNumbers = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i <= 3 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pages.push(
                    <button
                        key={i}
                        className={`page-num-btn ${currentPage === i ? 'active' : ''}`}
                        onClick={() => goToPage(i)}
                    >
                        {i}
                    </button>
                );
            } else if (i === 4 && totalPages > 5) {
                pages.push(<span key="ellipsis" className="page-ellipsis">...</span>);
                i = totalPages - 1;
            }
        }
        return pages;
    };

    // Stats
    const totalRoomsAll = hotels.reduce((sum, h) => sum + h.totalRooms, 0);
    const avgRating = hotels.length > 0 ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1) : '0';

    const bottomStats = [
        { label: 'Active Hotels', value: String(hotels.filter(h => h.status === 'Active').length), change: `+${hotels.length} total`, icon: <CheckCircle color="#06A649" />, color: 'green' },
        { label: 'Pending Approvals', value: '3', change: 'Action required', icon: <Clock color="#FFB800" />, color: 'orange' },
        { label: 'Avg. Rating', value: avgRating, change: `${totalRoomsAll} total rooms`, icon: <TrendingUp color="#0288AC" />, color: 'blue' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hotels-hub-container"
        >
            <PageHeader
                icon={<Building2 size={22} />}
                title="Hotels"
                subtitle="Manage luxury hotel inventories and room allocations"
                stats={[
                    { value: String(hotels.length), label: 'Total' },
                    { value: String(hotels.filter(h => h.status === 'Active').length), label: 'Active' },
                    { value: String(hotels.reduce((s, h) => s + h.totalRooms, 0)), label: 'Rooms' }
                ]}
                actions={[
                    <button key="add" className="phb-action-btn" onClick={() => setShowAddPopup(true)}>
                        <Plus size={17} />
                        <span>Add Hotel</span>
                    </button>
                ]}
            />
            {/* Top Navigation Bar (Tabs) */}
            {/* <div className="listing-top-navbar">
                <div className="listing-tabs">
                    <button
                        className={`listing-tab ${activeTab === 'Properties' ? 'active' : ''}`}
                        onClick={() => handleSwitchTab('Properties')}
                    >
                        Properties
                    </button>
                    <button
                        className={`listing-tab ${activeTab === 'Hotels' ? 'active' : ''}`}
                        onClick={() => handleSwitchTab('Hotels')}
                    >
                        Luxury Hotels
                    </button>
                </div>

                <div className="listing-actions">
                    <button className="add-hotel-btn-industrial" onClick={() => setShowAddPopup(true)}>
                        <Plus size={18} />
                        <span>Register New Hotel</span>
                    </button>
                </div>
            </div> */}

            {/* Hub Controls */}
            <div className="hub-controls-bar">
                <div className="industrial-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by hotel name or location..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="control-group-btns">
                    <div className="dropdown-container">
                        <button className="tool-btn" onClick={() => setShowStatusDropdown(!showStatusDropdown)}>
                            <Filter size={18} />
                            <span>{statusFilter}</span>
                            <ChevronDown size={14} />
                        </button>
                        {showStatusDropdown && (
                            <div className="status-dropdown">
                                {['All', 'Active', 'Inactive', 'Fully Booked', 'Pending'].map(status => (
                                    <div
                                        key={status}
                                        className="status-item"
                                        onClick={() => {
                                            setStatusFilter(status);
                                            setShowStatusDropdown(false);
                                            setCurrentPage(1);
                                        }}
                                    >
                                        {status}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button className="tool-btn icon-only" onClick={loadHotels}>
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="hotels-loading">
                    <div className="industrial-spinner"></div>
                    <span>Collating hotel inventories...</span>
                </div>
            ) : filteredHotels.length === 0 ? (
                <div className="empty-state-container">
                    <Building2 size={48} color="#CED4D6" />
                    <h3>No hotels found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <>
                    <div className="hotels-grid-industrial">
                        {paginatedHotels.map((hotel) => (
                            <motion.div
                                key={hotel.id}
                                whileHover={{ y: -8 }}
                                className="hotel-big-card"
                                onClick={() => navigate(`/hotels/${hotel.id.replace('HTL-', '')}`)}
                            >
                                <div className="card-image-wrap">
                                    <img src={hotel.image} alt={hotel.name} />
                                    <div className={`status-overlay ${hotel.status.toLowerCase().replace(' ', '-')}`}>
                                        {hotel.status}
                                    </div>
                                    <div className="id-badge-industrial">{hotel.id}</div>
                                </div>

                                <div className="card-content-industrial">
                                    <div className="c-header">
                                        <h3>{hotel.name}</h3>
                                        <div className="rating-pill">
                                            <Star size={12} fill="#FFB800" color="#FFB800" />
                                            <span>{hotel.rating}</span>
                                        </div>
                                    </div>

                                    <div className="c-loc">
                                        <MapPin size={14} />
                                        <span>{hotel.location}</span>
                                    </div>

                                    <div className="c-stats">
                                        <div className="stat-item">
                                            <Building2 size={16} />
                                            <div className="vals">
                                                <span className="v-main">{hotel.totalRooms}</span>
                                                <span className="v-label">Total Rooms</span>
                                            </div>
                                        </div>
                                        <div className="stat-item">
                                            <BedDouble size={16} />
                                            <div className="vals">
                                                <span className={`v-main ${hotel.availableRooms > 0 ? 'success' : 'error'}`}>
                                                    {hotel.availableRooms}
                                                </span>
                                                <span className="v-label">Available</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="c-amenities">
                                        {hotel.amenities.slice(0, 3).map((amn, i) => (
                                            <span key={i} className="amn-tag">{amn}</span>
                                        ))}
                                        {hotel.amenities.length > 3 && <span className="amn-more">+{hotel.amenities.length - 3} more</span>}
                                    </div>

                                    <div className="card-footer-industrial">
                                        <div className="hotel-action-btns">
                                            <button
                                                className="h-action-btn edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(hotel);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="h-action-btn delete"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this hotel?')) {
                                                        try {
                                                            const cleanId = hotel.id.startsWith('HTL-') ? parseInt(hotel.id.replace('HTL-', '')) : hotel.id;
                                                            await hotelService.deleteHotel(cleanId);
                                                            loadHotels();
                                                        } catch (error) {
                                                            alert('Failed to delete hotel');
                                                        }
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="hotels-pagination-card">
                        <span className="showing-text">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredHotels.length)} of {filteredHotels.length} hotels
                        </span>
                        <div className="pagination">
                            <button className="page-nav-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                                <ChevronLeft size={16} />
                            </button>
                            {renderPageNumbers()}
                            <button className="page-nav-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Bottom Stats */}
            {!loading && (
                <div className="hotels-bottom-stats">
                    {bottomStats.map((stat, index) => (
                        <div key={index} className="bottom-stat-card">
                            <div className="stat-main">
                                <span className="stat-label">{stat.label}</span>
                                <div className="stat-value-group">
                                    <span className="stat-value">{stat.value}</span>
                                    <span className={`stat-subtext ${stat.color}`}>{stat.change}</span>
                                </div>
                            </div>
                            <div className={`stat-icon-circle ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <AddHotelPopup
                isOpen={showAddPopup}
                onClose={handleClosePopup}
                onSuccess={loadHotels}
                editData={editHotel}
            />
        </motion.div>
    );
};

export default HotelsList;
