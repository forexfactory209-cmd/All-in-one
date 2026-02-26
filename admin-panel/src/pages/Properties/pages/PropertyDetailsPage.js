import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    Star,
    Home,
    BedDouble,
    Bath,
    Maximize,
    Calendar,
    User,
    Phone,
    Mail,
    CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { propertyService } from '../services/propertyService';
import PageHeader from '../../../components/PageHeader';
import './PropertyDetailsPage.css';

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [property, setProperty] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            setLoading(true);
            try {
                const data = await propertyService.getPropertyById(id);
                if (data) {
                    setProperty({
                        id: `#VR-${String(data.id).padStart(4, '0')}`,
                        dbId: data.id,
                        name: data.name,
                        type: data.type,
                        rating: parseFloat(data.rating || 0),
                        reviews: data.review_count || 0,
                        location: data.location,
                        address: data.address,
                        price: `$${data.price_per_night}`,
                        priceRaw: data.price_per_night,
                        description: data.description,
                        images: data.images && data.images.length > 0
                            ? data.images
                            : [data.main_image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
                        amenities: data.amenities ? data.amenities.map(a => a.name) : [],
                        specs: {
                            beds: data.bedrooms || 1,
                            baths: data.bathrooms || 1,
                            sqft: 2800,
                            maxGuests: data.max_guests || 2
                        },
                        status: data.status,
                        owner: {
                            name: data.owner_name || 'Not specified',
                            phone: data.owner_phone || 'Not specified',
                            email: data.owner_email || 'Not specified'
                        }
                    });
                }
            } catch (error) {
                console.error("Failed to load property details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [id]);

    if (loading) return (
        <div className="property-details-loading">
            <div className="industrial-spinner"></div>
            <span>Syncing property dossier...</span>
        </div>
    );

    if (!property) return <div className="error-state">Property not found</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="property-details-container"
        >
            <PageHeader
                backAction={() => navigate('/properties')}
                icon={<Home size={22} />}
                title={property.name}
                subtitle={`${property.type} • ${property.location}`}
                stats={[
                    { value: property.price, label: 'Per Night' },
                    { value: String(property.rating), label: 'Rating' }
                ]}
            />

            <div className="details-layout-grid">
                {/* Left Column: Visuals & Info */}
                <div className="main-content-column">
                    <div className="image-gallery-industrial">
                        <div className="main-img-wrap">
                            <img src={property.images[activeImage]} alt="Property Main" />
                        </div>
                        <div className="thumb-strip">
                            {property.images.map((img, idx) => (
                                <div
                                    key={idx}
                                    className={`thumb-wrap ${activeImage === idx ? 'active' : ''}`}
                                    onClick={() => setActiveImage(idx)}
                                >
                                    <img src={img} alt={`Gallery ${idx + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="description-card-industrial">
                        <h3>Property Overview</h3>
                        <p className="description-text">{property.description || "No description provided for this property."}</p>

                        <div className="amenities-section">
                            <h4>Premium Amenities</h4>
                            <div className="amenities-grid">
                                {property.amenities.length > 0 ? (
                                    property.amenities.map((item, idx) => (
                                        <div key={idx} className="amenity-item">
                                            <CheckCircle size={16} className="check-icon" />
                                            <span>{item}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-data">No amenities listed.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Details & Owner Info */}
                <div className="sidebar-column">
                    <div className="sidebar-card property-specs-card">
                        <h3>Specifications</h3>
                        <div className="specs-grid">
                            <div className="spec-row">
                                <div className="spec-icon"><BedDouble size={18} /></div>
                                <div className="spec-label">Bedrooms</div>
                                <div className="spec-value">{property.specs.beds}</div>
                            </div>
                            <div className="spec-row">
                                <div className="spec-icon"><Bath size={18} /></div>
                                <div className="spec-label">Bathrooms</div>
                                <div className="spec-value">{property.specs.baths}</div>
                            </div>
                            <div className="spec-row">
                                <div className="spec-icon"><Maximize size={18} /></div>
                                <div className="spec-label">Area (est)</div>
                                <div className="spec-value">{property.specs.sqft} sqft</div>
                            </div>
                            <div className="spec-row">
                                <div className="spec-icon"><Calendar size={18} /></div>
                                <div className="spec-label">Max Guests</div>
                                <div className="spec-value">{property.specs.maxGuests}</div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-card owner-details-card">
                        <h3>Owner Information</h3>
                        <div className="owner-info-list">
                            <div className="owner-info-item">
                                <User size={18} />
                                <div className="info-content">
                                    <label>Owner Name</label>
                                    <span>{property.owner.name}</span>
                                </div>
                            </div>
                            <div className="owner-info-item">
                                <Phone size={18} />
                                <div className="info-content">
                                    <label>Phone Number</label>
                                    <span>{property.owner.phone}</span>
                                </div>
                            </div>
                            <div className="owner-info-item">
                                <Mail size={18} />
                                <div className="info-content">
                                    <label>Email Address</label>
                                    <span>{property.owner.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sidebar-card location-card-industrial">
                        <h3>Location</h3>
                        <div className="loc-info">
                            <MapPin size={18} />
                            <span>{property.address || property.location}</span>
                        </div>
                        <div className="mini-map-placeholder">
                            <span>Relational Mapping Interface</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PropertyDetailsPage;
