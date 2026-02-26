import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Wifi,
    Coffee,
    Tv,
    AirVent,
    Utensils,
    Maximize,
    BedDouble,
    Info,
    CheckCircle,
    Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageHeader from '../../../components/PageHeader';
import './RoomDetailsPage.css';

const RoomDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        // Mock data for room details
        setTimeout(() => {
            setRoom({
                id: id,
                type: 'Executive Suite',
                hotel: 'Grand Skyline Hotel',
                hotelId: 'VR-2032',
                price: '$890',
                size: '850 sqft',
                bedType: 'California King',
                view: 'City Skyline & Central Park',
                maxGuests: 4,
                description: 'The Executive Suite provides the ultimate Manhattan living experience. Each suite features a separate living area, marble bathroom with deep soaking tub, and floor-to-ceiling windows offering iconic views.',
                images: [
                    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=600&q=80',
                    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
                ],
                amenities: [
                    { name: 'High-Speed WiFi', icon: <Wifi size={18} /> },
                    { name: 'Nespresso Machine', icon: <Coffee size={18} /> },
                    { name: '65" Smart TV', icon: <Tv size={18} /> },
                    { name: 'Climate Control', icon: <AirVent size={18} /> },
                    { name: 'Mini Bar', icon: <Utensils size={18} /> },
                    { name: 'Spacious Balcony', icon: <Maximize size={18} /> }
                ]
            });
            setLoading(false);
        }, 500);
    }, [id]);

    if (loading) return (
        <div className="room-details-loading">
            <div className="industrial-spinner"></div>
            <span>Syncing room inventory...</span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="room-details-container"
        >
            <PageHeader
                backAction={() => navigate(-1)}
                icon={<BedDouble size={22} />}
                title={room.type}
                subtitle={`${room.hotel} • ${room.id}`}
                stats={[
                    { value: room.price, label: 'Per Night' },
                    { value: String(room.maxGuests), label: 'Max Guests' }
                ]}
            />

            <div className="room-grid-industrial">
                {/* Visuals Section */}
                <div className="visuals-stack">
                    <div className="primary-img-frame">
                        <img src={room.images[0]} alt="Room Main" />
                    </div>
                    <div className="secondary-images">
                        {room.images.slice(1).map((img, idx) => (
                            <div key={idx} className="sec-img-frame">
                                <img src={img} alt={`Room Detail ${idx + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Information Section */}
                <div className="info-stack-industrial">
                    <div className="info-card-industrial highlight">
                        <div className="c-header">
                            <Info size={18} />
                            <span>Room Specifications</span>
                        </div>
                        <div className="specs-row">
                            <div className="s-item">
                                <Maximize size={16} />
                                <span>{room.size}</span>
                            </div>
                            <div className="s-item">
                                <BedDouble size={16} />
                                <span>{room.bedType}</span>
                            </div>
                            <div className="s-item">
                                <ImageIcon size={16} />
                                <span>{room.view}</span>
                            </div>
                        </div>
                    </div>

                    <div className="info-card-industrial">
                        <div className="c-header">
                            <CheckCircle size={18} />
                            <span>About this Suite</span>
                        </div>
                        <p className="r-desc">{room.description}</p>
                    </div>

                    <div className="info-card-industrial">
                        <div className="c-header">
                            <Wifi size={18} />
                            <span>In-Room Amenities</span>
                        </div>
                        <div className="room-amn-grid">
                            {room.amenities.map((amn, idx) => (
                                <div key={idx} className="amn-tag">
                                    {amn.icon}
                                    <span>{amn.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RoomDetailsPage;
