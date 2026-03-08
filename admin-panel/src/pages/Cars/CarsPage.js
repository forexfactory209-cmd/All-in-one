import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Car, Search, Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import ImageUploader from '../../components/ImageUploader/ImageUploader';
import './CarsPage.css';

const API_URL = 'http://localhost:5000/api/v1/cars';

const CarsPage = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [images, setImages] = useState([]);
    const [formData, setFormData] = useState({ 
        id: null, 
        make: '', 
        model: '', 
        year: new Date().getFullYear(), 
        description: '', 
        price_per_day: '', 
        status: 'Active', 
        location: '', 
        transmission: 'Automatic', 
        seats: 4, 
        doors: 4,
        owner_name: '',
        owner_phone: '',
        owner_email: '',
        rating: 4.8
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setCars(res.data.data);
        } catch (error) {
            console.error('Failed to fetch cars', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, images };
            if (formData.id) {
                await axios.put(`${API_URL}/${formData.id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            setShowForm(false);
            setImages([]);
            setImages([]);
            setFormData({ 
                id: null, 
                make: '', 
                model: '', 
                year: new Date().getFullYear(), 
                description: '', 
                price_per_day: '', 
                status: 'Active', 
                location: '', 
                transmission: 'Automatic', 
                seats: 4, 
                doors: 4,
                owner_name: '',
                owner_phone: '',
                owner_email: '',
                rating: 4.8
            });
            fetchCars();
        } catch (error) {
            alert('Error saving car');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this car?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchCars();
            } catch (error) {
                alert('Error deleting car');
            }
        }
    };

    const filteredCars = cars.filter(c => c.make.toLowerCase().includes(searchQuery.toLowerCase()) || c.model.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="cars-page-container">
            <PageHeader
                icon={<Car size={22} />}
                title="Rental Cars"
                subtitle="Manage available rental cars for users"
                actions={[
                    <button key="add" className="phb-action-btn" onClick={() => { 
                        setFormData({ 
                            id: null, 
                            make: '', 
                            model: '', 
                            year: new Date().getFullYear(), 
                            description: '', 
                            price_per_day: '', 
                            status: 'Active', 
                            location: '', 
                            transmission: 'Automatic', 
                            seats: 4, 
                            doors: 4,
                            owner_name: '',
                            owner_phone: '',
                            owner_email: '',
                            rating: 4.8
                        }); 
                        setImages([]);
                        setShowForm(true); 
                    }}>
                        <Plus size={17} />
                        <span>Add Car</span>
                    </button>
                ]}
            />

            {showForm && (
                <div className="car-form-modal">
                    <div className="car-form-content extended-modal">
                        <h3>{formData.id ? 'Edit Car Information' : 'Register New Vehicle'}</h3>
                        <form onSubmit={handleSave} className="extended-form-body">
                            <div className="form-section-label">General Details</div>
                            <div className="form-group-row">
                                <div className="form-item">
                                    <label>Make</label>
                                    <input type="text" placeholder="e.g. Toyota" value={formData.make} onChange={e => setFormData({ ...formData, make: e.target.value })} required />
                                </div>
                                <div className="form-item">
                                    <label>Model</label>
                                    <input type="text" placeholder="e.g. Corolla" value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })} required />
                                </div>
                                <div className="form-item">
                                    <label>Year</label>
                                    <input type="number" placeholder="2024" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} required />
                                </div>
                            </div>
                            
                            <div className="form-section-label">Vehicle Narrative & Highlights</div>
                            <div className="form-item full-width-item">
                                <label>Detailed Description</label>
                                <textarea 
                                    placeholder="Enter premium vehicle features, condition details, and logistical notes for the renter..." 
                                    value={formData.description} 
                                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                                    className="description-textarea" 
                                    rows="8" 
                                />
                                <span className="field-hint">This description appears to users on the mobile app.</span>
                            </div>

                            <div className="form-section-label">Pricing & Logistics</div>
                            <div className="form-group-row">
                                <div className="form-item">
                                    <label>Price per Day ($)</label>
                                    <input type="number" placeholder="50.00" value={formData.price_per_day} onChange={e => setFormData({ ...formData, price_per_day: e.target.value })} required />
                                </div>
                                <div className="form-item">
                                    <label>Location</label>
                                    <input type="text" placeholder="City" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                </div>
                                <div className="form-item">
                                    <label>Transmission</label>
                                    <select value={formData.transmission} onChange={e => setFormData({ ...formData, transmission: e.target.value })}>
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group-row">
                                <div className="form-item">
                                    <label>Seats</label>
                                    <input type="number" value={formData.seats} onChange={e => setFormData({ ...formData, seats: e.target.value })} required />
                                </div>
                                <div className="form-item">
                                    <label>Doors</label>
                                    <input type="number" value={formData.doors} onChange={e => setFormData({ ...formData, doors: e.target.value })} required />
                                </div>
                                <div className="form-item">
                                    <label>Visibility Status</label>
                                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                        <option value="Active">Active / Available</option>
                                        <option value="Rented">Currently Rented</option>
                                        <option value="Maintenance">Under Maintenance</option>
                                        <option value="Inactive">Inactive / Hidden</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-section-label">Inventory Ownership Info</div>
                            <div className="form-group-row">
                                <div className="form-item">
                                    <label>Owner Full Name</label>
                                    <input type="text" placeholder="Owner..." value={formData.owner_name} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} />
                                </div>
                                <div className="form-item">
                                    <label>Owner Phone</label>
                                    <input type="text" placeholder="+252..." value={formData.owner_phone} onChange={e => setFormData({ ...formData, owner_phone: e.target.value })} />
                                </div>
                                <div className="form-item">
                                    <label>Vehicle Rating (0-5)</label>
                                    <input type="number" step="0.1" max="5" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} />
                                </div>
                            </div>

                            <div className="form-image-uploader">
                                <label>Car Images (Banner and Thumbnails)</label>
                                <ImageUploader
                                    value={images}
                                    onChange={setImages}
                                    multiple={true}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                                <button type="submit">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="hub-controls-bar">
                <div className="premium-search">
                    <Search size={18} />
                    <input type="text" placeholder="Search cars..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <table className="cars-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Make & Model</th>
                            <th>Year</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Price/Day</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCars.map(car => (
                            <tr key={car.id}>
                                <td>#{car.id}</td>
                                <td>{car.make} {car.model}</td>
                                <td>{car.year}</td>
                                <td>{car.location}</td>
                                <td><span className={`status-badge ${car.status.toLowerCase()}`}>{car.status}</span></td>
                                <td>${car.price_per_day}</td>
                                <td>
                                    <button onClick={() => { 
                                        setFormData({
                                            ...car,
                                            owner_name: car.owner_name || '',
                                            owner_phone: car.owner_phone || '',
                                            owner_email: car.owner_email || '',
                                            description: car.description || '',
                                            location: car.location || '',
                                            transmission: car.transmission || 'Automatic',
                                            seats: car.seats || 4,
                                            doors: car.doors || 4,
                                            rating: car.rating || 4.8
                                        }); 
                                        setImages(car.images || (car.main_image ? [car.main_image] : []));
                                        setShowForm(true); 
                                    }}><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(car.id)}><Trash2 size={16} color="red" /></button>
                                    <button onClick={() => setExpandedRow(expandedRow === car.id ? null : car.id)}>
                                        {expandedRow === car.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            {expandedRow && (
                <div className="expanded-details-drawer">
                    <div className="drawer-section">
                        <h4>Vehicle Description</h4>
                        <p className="description-text">
                            {cars.find(c => c.id === expandedRow)?.description || 'No description provided for this vehicle.'}
                        </p>
                    </div>
                    
                    <div className="drawer-section">
                        <h4>Image Gallery</h4>
                        <div className="images-gallery">
                            {cars.find(c => c.id === expandedRow)?.images?.length > 0 ? (
                                cars.find(c => c.id === expandedRow).images.map((img, idx) => (
                                    <div key={idx} className="gallery-thumbnail">
                                        <img src={img} alt="car thumbnail" />
                                        {idx === 0 && <span className="banner-badge">Cover</span>}
                                    </div>
                                ))
                            ) : (
                                <p className="no-images-text">No images bound to this car.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarsPage;
