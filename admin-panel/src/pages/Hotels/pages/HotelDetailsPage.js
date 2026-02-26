import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    Star,
    Building2,
    BedDouble,
    Wifi,
    UtensilsCrossed,
    Dumbbell,
    CarFront,
    ArrowRight,
    Users,
    CheckCircle,
    XCircle,
    Plus,
    Trash2,
    Edit2,
    User,
    Phone,
    Mail,
    Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { hotelService } from '../services/hotelService';
import { roomService } from '../services/roomService';
import AddRoomPopup from '../popups/AddRoomPopup';
import AddHotelPopup from '../popups/AddHotelPopup';
import PageHeader from '../../../components/PageHeader';
import './HotelDetailsPage.css';

const HotelDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hotel, setHotel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [showAddRoom, setShowAddRoom] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomToEdit, setRoomToEdit] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [showEditHotel, setShowEditHotel] = useState(false);

    const getHighlightIcon = (label = '') => {
        const l = label.toLowerCase();
        if (l.includes('wifi') || l.includes('internet')) return <Wifi size={18} />;
        if (l.includes('restaurant') || l.includes('food') || l.includes('dining')) return <UtensilsCrossed size={18} />;
        if (l.includes('gym') || l.includes('fitness') || l.includes('workout')) return <Dumbbell size={18} />;
        if (l.includes('car') || l.includes('parking') || l.includes('valet')) return <CarFront size={18} />;
        if (l.includes('pool') || l.includes('swim')) return <Star size={18} />;
        if (l.includes('bed') || l.includes('room')) return <BedDouble size={18} />;
        if (l.includes('user') || l.includes('staff')) return <Users size={18} />;
        return <CheckCircle size={18} />;
    };

    const loadHotelData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await hotelService.getHotelById(id);
            if (data) {
                setHotel({
                    id: `HTL-${String(data.id).padStart(4, '0')}`,
                    dbId: data.id,
                    name: data.name,
                    location: data.location,
                    rating: parseFloat(data.rating || 0),
                    reviews: 312,
                    totalRooms: data.total_rooms,
                    availableRooms: data.available_rooms,
                    bookedRooms: data.total_rooms - data.available_rooms,
                    description: data.description,
                    owner: {
                        name: data.owner_name || 'Not specified',
                        phone: data.owner_phone || 'Not specified',
                        email: data.owner_email || 'Not specified'
                    },
                    images: (data.images && data.images.length > 0)
                        ? data.images
                        : [data.main_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'],
                    highlights: (data.amenities && data.amenities.length > 0)
                        ? data.amenities.map(a => ({
                            icon: getHighlightIcon(a.name || a),
                            label: a.name || a
                        }))
                        : [
                            { icon: <Wifi size={18} />, label: 'Free High-Speed WiFi' },
                            { icon: <UtensilsCrossed size={18} />, label: '3 Signature Restaurants' },
                            { icon: <Dumbbell size={18} />, label: 'Fitness & Spa Center' },
                            { icon: <CarFront size={18} />, label: 'Valet Parking' }
                        ],
                    rawAmenities: data.amenities || []
                });

                const roomsData = await roomService.getRoomsByHotelId(id);
                setRooms(roomsData);
            }
        } catch (error) {
            console.error("Failed to load hotel dossier", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadHotelData();
    }, [loadHotelData]);

    const handleDeleteRoom = async (e, roomId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to remove this room from inventory?")) {
            try {
                await roomService.deleteRoom(roomId);
                loadHotelData();
            } catch (error) {
                alert("Failed to delete room.");
            }
        }
    };

    const handleEditRoom = (e, room) => {
        e.stopPropagation();
        setRoomToEdit(room);
        setShowAddRoom(true);
    };

    const handleAddRoomSuccess = () => {
        loadHotelData();
        setRoomToEdit(null);
    };

    const handleCloseAddRoom = () => {
        setShowAddRoom(false);
        setRoomToEdit(null);
    };

    if (loading) return (
        <div className="hotel-details-loading">
            <div className="industrial-spinner"></div>
            <span>Loading hotel dossier...</span>
        </div>
    );

    if (!hotel) return <div className="error-state">Hotel not found.</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="hotel-details-container"
        >
            <PageHeader
                backAction={() => navigate('/hotels')}
                icon={<Building2 size={22} />}
                title={hotel.name}
                subtitle={`${hotel.id} • ${hotel.location}`}
                stats={[
                    { value: String(hotel.totalRooms), label: 'Capacity' },
                    { value: String(hotel.availableRooms), label: 'Available' },
                    { value: String(hotel.rating), label: 'Rating' }
                ]}
                actions={[
                    <button key="edit" className="phb-action-btn" onClick={() => setShowEditHotel(true)}>
                        <Edit2 size={16} />
                        <span>Edit Hotel</span>
                    </button>
                ]}
            />

            {/* Hero Section - Professional Gallery */}
            <div className="hotel-hero-section">
                <div className="hero-gallery-professional">
                    <div className="gallery-main" onClick={() => setPreviewImage(hotel.images[activeImage])}>
                        <img src={hotel.images[activeImage]} alt={hotel.name} />
                        <div className="gallery-overlay-hint">
                            <Maximize2 size={24} />
                            <span>Click to enlarge</span>
                        </div>
                    </div>
                    <div className="gallery-grid-side">
                        {hotel.images.slice(0, 4).map((img, idx) => (
                            <div
                                key={idx}
                                className={`gallery-thumb-item ${activeImage === idx ? 'active' : ''}`}
                                onClick={() => setActiveImage(idx)}
                            >
                                <img src={img} alt={`Gallery ${idx}`} />
                                {idx === 3 && hotel.images.length > 4 && (
                                    <div className="more-overlay">+{hotel.images.length - 4}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Band */}
            <div className="hotel-stats-band">
                <div className="stat-chip">
                    <Building2 size={20} />
                    <div className="chip-info">
                        <span className="chip-val">{hotel.totalRooms}</span>
                        <span className="chip-label">Total Capacity</span>
                    </div>
                </div>
                <div className="stat-chip success">
                    <CheckCircle size={20} />
                    <div className="chip-info">
                        <span className="chip-val">{hotel.availableRooms}</span>
                        <span className="chip-label">Available Now</span>
                    </div>
                </div>
                <div className="stat-chip warning">
                    <XCircle size={20} />
                    <div className="chip-info">
                        <span className="chip-val">{hotel.bookedRooms}</span>
                        <span className="chip-label">Currently Booked</span>
                    </div>
                </div>
            </div>

            {/* Description & Owner & Highlights */}
            <div className="hotel-info-triple-grid">
                <div className="about-card">
                    <h3>About this Hotel</h3>
                    <p>{hotel.description || "No description provided for this luxury establishment."}</p>
                </div>

                <div className="owner-card-industrial">
                    <h3>Owner Information</h3>
                    <div className="owner-details">
                        <div className="o-item">
                            <User size={18} />
                            <div className="o-val">
                                <label>Full Name</label>
                                <span>{hotel.owner.name}</span>
                            </div>
                        </div>
                        <div className="o-item">
                            <Phone size={18} />
                            <div className="o-val">
                                <label>Phone</label>
                                <span>{hotel.owner.phone}</span>
                            </div>
                        </div>
                        <div className="o-item">
                            <Mail size={18} />
                            <div className="o-val">
                                <label>Email</label>
                                <span>{hotel.owner.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="highlights-card">
                    <h3>Key Highlights</h3>
                    <div className="highlights-list">
                        {hotel.highlights.map((h, idx) => (
                            <div key={idx} className="highlight-item">
                                {h.icon}
                                <span>{h.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Room Inventory */}
            <div className="room-inventory-section">
                <div className="section-header">
                    <div className="head-text">
                        <h2>Room Inventory</h2>
                        <span className="count-badge">{rooms.length} Room Types</span>
                    </div>
                    <button className="add-room-btn-main" onClick={() => setShowAddRoom(true)}>
                        <Plus size={18} />
                        <span>Add Room Type</span>
                    </button>
                </div>

                {rooms.length === 0 ? (
                    <div className="no-rooms-state">
                        <BedDouble size={48} color="#CBD5E1" />
                        <p>No room inventory established for this hotel yet.</p>
                        <button className="add-room-btn-main" onClick={() => setShowAddRoom(true)}>Initialize Inventory</button>
                    </div>
                ) : (
                    <div className="rooms-grid">
                        {rooms.map((room) => (
                            <motion.div
                                key={room.id}
                                whileHover={{ y: -4 }}
                                onClick={() => setSelectedRoom(room)}
                                className={`room-card cursor-pointer ${room.status !== 'Available' ? 'booked' : ''}`}
                            >
                                <div className="room-card-img">
                                    <img src={room.image_url || 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=300&q=80'} alt={room.type} />
                                    <span className={`avail-badge ${room.status === 'Available' ? 'open' : 'closed'}`}>
                                        {room.status}
                                    </span>
                                    <div className="room-actions-overlay">
                                        <button
                                            className="action-btn-overlay edit"
                                            onClick={(e) => handleEditRoom(e, room)}
                                            title="Edit Room"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            className="action-btn-overlay delete"
                                            onClick={(e) => handleDeleteRoom(e, room.id)}
                                            title="Delete Room"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div className="room-card-body">
                                    <div className="room-card-header">
                                        <span className="room-id-tag">RM-{String(room.room_number).padStart(3, '0')}</span>
                                        <h4>{room.type}</h4>
                                    </div>
                                    <div className="room-card-meta">
                                        <div className="m-item">
                                            <BedDouble size={14} />
                                            <span>{room.beds} Bed{room.beds > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="m-item">
                                            <Users size={14} />
                                            <span>Max {room.max_guests} Guests</span>
                                        </div>
                                    </div>
                                    <div className="room-card-footer">
                                        <span className="room-price">${room.price}<small>/night</small></span>
                                        <ArrowRight size={16} className="arr" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AddRoomPopup
                isOpen={showAddRoom}
                onClose={handleCloseAddRoom}
                onSuccess={handleAddRoomSuccess}
                hotelId={id}
                room={roomToEdit}
            />

            <AddHotelPopup
                isOpen={showEditHotel}
                onClose={() => setShowEditHotel(false)}
                onSuccess={loadHotelData}
                editData={{
                    ...hotel,
                    dbId: id,
                    amenities: hotel.rawAmenities
                }}
            />

            {/* Room Detail Modal */}
            <AnimatePresence>
                {selectedRoom && (
                    <div className="popup-overlay" onClick={() => setSelectedRoom(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="room-detail-modal"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="room-detail-header">
                                <div className="r-title">
                                    <h3>{selectedRoom.type}</h3>
                                    <span>Room #{selectedRoom.room_number}</span>
                                </div>
                                <button className="close-btn" onClick={() => setSelectedRoom(null)}><XCircle size={24} /></button>
                            </div>

                            <div className="room-detail-content">
                                <div className="room-gallery-view">
                                    <div className="room-main-view" onClick={() => setPreviewImage(selectedRoom.image_url)}>
                                        <img src={selectedRoom.image_url || 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=600&q=80'} alt="Room" />
                                        <div className="gallery-overlay-hint">
                                            <Maximize2 size={24} />
                                        </div>
                                    </div>
                                    <div className="room-thumbs-view">
                                        {(selectedRoom.images || [selectedRoom.image_url]).map((img, idx) => (
                                            <div key={idx} className="room-thumb" onClick={() => setPreviewImage(img)}>
                                                <img src={img} alt={`Thumb ${idx}`} />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="room-info-view">
                                    <div className="room-price-band">
                                        <span className="price">${selectedRoom.price}<small>/night</small></span>
                                        <span className={`status-pill ${selectedRoom.status.toLowerCase()}`}>{selectedRoom.status}</span>
                                    </div>

                                    <div className="room-specs-list">
                                        <div className="spec-row">
                                            <BedDouble size={18} />
                                            <span>{selectedRoom.beds} Double Beds</span>
                                        </div>
                                        <div className="spec-row">
                                            <Users size={18} />
                                            <span>Max Guests: {selectedRoom.max_guests} People</span>
                                        </div>
                                        <div className="spec-row">
                                            <CheckCircle size={18} color="#059669" />
                                            <span>Modern Amenities included</span>
                                        </div>
                                    </div>

                                    <div className="room-description-view">
                                        <label>Description</label>
                                        <p>{selectedRoom.description || `This premium ${selectedRoom.type} offers a spacious layout with modern minimalist design. Experience breathtaking views and top-tier hospitality including ${selectedRoom.beds > 1 ? 'large comfortable beds' : 'a luxury king-size bed'} and high-end amenities.`}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Image Preview / Lightbox */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        className="lightbox-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewImage(null)}
                    >
                        <button className="lightbox-close"><XCircle size={32} /></button>
                        <motion.img
                            src={previewImage}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            onClick={e => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HotelDetailsPage;
