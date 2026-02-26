import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    CheckCircle,
    TrendingUp,
    ChevronLeft,
    ChevronRight,
    Plus,
    RefreshCw,
    MapPin,
    Star,
    Bed,
    Bath,
    Users,
    ArrowRight,
    Home
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { propertyService } from '../services/propertyService';
import AddPropertyPopup from '../popups/AddPropertyPopup';
import PageHeader from '../../../components/PageHeader';
import './PropertiesPage.css';

const PROPERTIES_PER_PAGE = 7;

const PropertiesList = () => {
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [editProperty, setEditProperty] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const data = await propertyService.getProperties();
            setProperties(data);
        } catch (error) {
            console.error("Failed to load properties", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (property) => {
        setEditProperty(property);
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowAddPopup(false);
        setEditProperty(null);
    };

    const handleDelete = async (e, property) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this property?')) {
            try {
                await propertyService.deleteProperty(property.dbId);
                loadProperties();
            } catch (error) {
                alert('Failed to delete property');
            }
        }
    };

    // Filter logic
    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE);
    const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
    const endIndex = startIndex + PROPERTIES_PER_PAGE;
    const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

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
                i = totalPages - 1; // Skip ahead
            }
        }
        return pages;
    };

    const bottomStats = [
        { label: 'Active Listings', value: String(properties.filter(p => p.status === 'Active').length), change: `+${properties.length} total`, icon: <CheckCircle color="#06A649" />, color: 'green' },
        { label: 'Avg. Rating', value: properties.length > 0 ? (properties.reduce((sum, p) => sum + (p.rating || 0), 0) / properties.length).toFixed(1) : '0.0', change: 'Market average', icon: <Star color="#FFB800" />, color: 'orange' },
        { label: 'Avg. Rate', value: `$${properties.length > 0 ? Math.round(properties.reduce((sum, p) => sum + (p.priceRaw || 0), 0) / properties.length) : 0}`, change: '+4.2%', icon: <TrendingUp color="#0288AC" />, color: 'blue' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="properties-hub-container"
        >
            <PageHeader
                icon={<Home size={22} />}
                title="Properties"
                subtitle="Browse, manage and track all rental property listings"
                stats={[
                    { value: String(properties.length), label: 'Total' },
                    { value: String(properties.filter(p => p.status === 'Active').length), label: 'Active' }
                ]}
                actions={[
                    <button key="add" className="phb-action-btn" onClick={() => setShowAddPopup(true)}>
                        <Plus size={17} />
                        <span>Add Property</span>
                    </button>
                ]}
            />
            {/* Hub Controls */}
            <div className="hub-controls-bar">
                <div className="premium-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by property name or location..."
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
                    <button className="tool-btn icon-only" onClick={loadProperties} title="Refresh Data">
                        <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    </button>
                    {/* <button className="add-property-btn-premium compact" onClick={() => setShowAddPopup(true)}>
                        <Plus size={18} />
                        <span>Add Property</span>
                    </button> */}
                </div>
            </div>

            {loading ? (
                <div className="properties-loading">
                    <div className="premium-spinner"></div>
                    <span>Aggregating property data...</span>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="empty-state-container">
                    <Home size={48} color="#CED4D6" />
                    <h3>No properties found</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <>
                    <div className="properties-grid-premium">
                        {paginatedProperties.map((property) => (
                            <motion.div
                                key={property.id}
                                whileHover={{ y: -8 }}
                                className="property-premium-card"
                                onClick={() => navigate(`/properties/${property.dbId}`)}
                            >
                                <div className="card-image-wrap">
                                    <img src={property.image} alt={property.name} />
                                    <div className={`status-overlay ${property.status.toLowerCase().replace(' ', '-')}`}>
                                        {property.status}
                                    </div>
                                    <div className="id-badge-premium">{property.id}</div>
                                </div>

                                <div className="card-content-premium">
                                    <div className="c-header">
                                        <h3>{property.name}</h3>
                                        <div className="rating-pill">
                                            <Star size={12} fill="#FFB800" color="#FFB800" />
                                            <span>{property.rating || '0.0'}</span>
                                        </div>
                                    </div>

                                    <div className="c-loc">
                                        <MapPin size={14} />
                                        <span>{property.location}</span>
                                    </div>

                                    <div className="c-type-price">
                                        <span className="p-type">{property.type}</span>
                                        <div className="p-price">
                                            <span className="val">{property.price}</span>
                                            <span className="unit">/ night</span>
                                        </div>
                                    </div>

                                    <div className="c-specs">
                                        <div className="spec-item">
                                            <Bed size={14} />
                                            <span>{property.bedrooms || 1} Beds</span>
                                        </div>
                                        <div className="spec-item">
                                            <Bath size={14} />
                                            <span>{property.bathrooms || 1} Baths</span>
                                        </div>
                                        <div className="spec-item">
                                            <Users size={14} />
                                            <span>{property.maxGuests || 2} Guests</span>
                                        </div>
                                    </div>

                                    <div className="card-footer-premium">
                                        <div className="property-action-buttons">
                                            <button
                                                className="p-action-btn edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(property);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="p-action-btn delete"
                                                onClick={(e) => handleDelete(e, property)}
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
                    <div className="properties-pagination-card">
                        <span className="showing-text">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredProperties.length)} of {filteredProperties.length} properties
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
                <div className="properties-bottom-stats-premium">
                    {bottomStats.map((stat, index) => (
                        <div key={index} className="bottom-stat-card-premium">
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

            <AddPropertyPopup
                isOpen={showAddPopup}
                onClose={handleClosePopup}
                onSuccess={loadProperties}
                editData={editProperty}
            />
        </motion.div>
    );
};

export default PropertiesList;
