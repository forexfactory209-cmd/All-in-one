import React from 'react';
import { MapPin } from 'lucide-react';
import { propertyService } from '../services/propertyService';
import './PropertiesTable.css';

const PropertiesTable = ({ properties, loading, onRowClick, onEdit }) => {
    if (loading) {
        return (
            <div className="table-loading">
                <div className="spinner"></div>
                <span>Syncing properties...</span>
            </div>
        );
    }

    return (
        <div className="properties-table-container">
            <table className="properties-table">
                <thead>
                    <tr>
                        <th>PROPERTY</th>
                        <th>TYPE</th>
                        <th>LOCATION</th>
                        <th>PRICE</th>
                        <th>STATUS</th>
                        <th>CREATED DATE</th>
                        <th className="text-center">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {properties.map((property) => (
                        <tr
                            key={property.id}
                            onClick={() => onRowClick && onRowClick(property.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td className="property-cell">
                                <div className="property-visual">
                                    <div className="img-wrapper">
                                        <img src={property.image} alt={property.name} />
                                    </div>
                                    <div className="property-meta">
                                        <span className="property-title">{property.name}</span>
                                        <span className="property-id">ID: {property.id}</span>
                                    </div>
                                </div>
                            </td>
                            <td className="type-cell">{property.type}</td>
                            <td className="location-cell">
                                <div className="loc-group">
                                    <MapPin size={14} className="pin-icon" />
                                    <span>{property.location}</span>
                                </div>
                            </td>
                            <td className="price-cell">
                                <span className="price-val">{property.price}</span>
                                <span className="price-unit">/ night</span>
                            </td>
                            <td>
                                <span className={`status-pill ${property.status.toLowerCase().replace(' ', '-')}`}>
                                    {property.status}
                                </span>
                            </td>
                            <td className="date-cell">{property.createdDate}</td>
                            <td className="actions-cell">
                                <div className="action-btns-group">
                                    <button
                                        className="action-btn edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEdit && onEdit({
                                                ...property,
                                                dbId: property.id.startsWith('#VR-') ? parseInt(property.id.replace('#VR-', '')) : property.id,
                                                priceRaw: parseFloat(property.price.replace('$', ''))
                                            });
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="action-btn delete"
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (window.confirm('Are you sure you want to delete this property?')) {
                                                try {
                                                    const cleanId = property.id.startsWith('#VR-') ? parseInt(property.id.replace('#VR-', '')) : property.id;
                                                    await propertyService.deleteProperty(cleanId);
                                                    if (onRowClick) window.location.reload(); // Refresh after delete
                                                } catch (error) {
                                                    alert('Failed to delete property');
                                                }
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {properties.length === 0 && (
                        <tr>
                            <td colSpan="7" className="empty-state">No properties found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PropertiesTable;
