import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Map, Search, Plus, Edit, Trash2 } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import './ToursPage.css';

const API_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:9050/api'}/v1/tours`;

const ToursPage = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', description: '', price_per_person: '', duration_hours: 1, location: '', status: 'Active', max_participants: 10, guide_name: '', guide_phone: '' });

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        try {
            setLoading(true);
            const res = await axios.get(API_URL);
            setTours(res.data.data);
        } catch (error) {
            console.error('Failed to fetch tours', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                await axios.put(`${API_URL}/${formData.id}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            setShowForm(false);
            setFormData({ id: null, title: '', description: '', price_per_person: '', duration_hours: 1, location: '', status: 'Active', max_participants: 10, guide_name: '', guide_phone: '' });
            fetchTours();
        } catch (error) {
            alert('Error saving tour');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this tour?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                fetchTours();
            } catch (error) {
                alert('Error deleting tour');
            }
        }
    };

    const filteredTours = tours.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="tours-page-container">
            <PageHeader
                icon={<Map size={22} />}
                title="City Tours"
                subtitle="Manage available city tours and excursions"
                actions={[
                    <button key="add" className="phb-action-btn" onClick={() => { setFormData({ id: null, title: '', description: '', price_per_person: '', duration_hours: 1, location: '', status: 'Active', max_participants: 10, guide_name: '', guide_phone: '' }); setShowForm(true); }}>
                        <Plus size={17} />
                        <span>Add Tour</span>
                    </button>
                ]}
            />

            {showForm && (
                <div className="tour-form-modal">
                    <div className="tour-form-content">
                        <h3>{formData.id ? 'Edit Tour' : 'Add New Tour'}</h3>
                        <form onSubmit={handleSave}>
                            <input type="text" placeholder="Tour Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                            <input type="text" placeholder="Location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                            <input type="number" placeholder="Price per Person" value={formData.price_per_person} onChange={e => setFormData({ ...formData, price_per_person: e.target.value })} required />
                            <input type="number" placeholder="Duration (hours)" value={formData.duration_hours} onChange={e => setFormData({ ...formData, duration_hours: e.target.value })} required />
                            <input type="number" placeholder="Max Participants" value={formData.max_participants} onChange={e => setFormData({ ...formData, max_participants: e.target.value })} required />
                            <input type="text" placeholder="Guide Name" value={formData.guide_name} onChange={e => setFormData({ ...formData, guide_name: e.target.value })} />
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Fully Booked">Fully Booked</option>
                            </select>
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
                    <input type="text" placeholder="Search tours..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </div>

            {loading ? <p>Loading...</p> : (
                <table className="tours-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Duration</th>
                            <th>Status</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTours.map(tour => (
                            <tr key={tour.id}>
                                <td>#{tour.id}</td>
                                <td>{tour.title}</td>
                                <td>{tour.location}</td>
                                <td>{tour.duration_hours} hrs</td>
                                <td><span className={`status-badge ${tour.status.toLowerCase().replace(' ', '-')}`}>{tour.status}</span></td>
                                <td>${tour.price_per_person}</td>
                                <td>
                                    <button onClick={() => { setFormData(tour); setShowForm(true); }}><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(tour.id)}><Trash2 size={16} color="red" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ToursPage;
