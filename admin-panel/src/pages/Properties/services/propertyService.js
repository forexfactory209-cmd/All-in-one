import api from '../../../services/api';

class PropertyService {
    async getProperties() {
        try {
            const response = await api.get('/v1/properties');
            if (response.success) {
                return response.data.map(prop => ({
                    id: `#VR-${String(prop.id).padStart(4, '0')}`,
                    dbId: prop.id,
                    name: prop.name,
                    type: prop.type,
                    location: prop.location,
                    address: prop.address,
                    description: prop.description,
                    price: `$${prop.price_per_night}`,
                    priceRaw: prop.price_per_night,
                    status: prop.status,
                    createdDate: new Date(prop.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    image: prop.main_image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80',
                    images: prop.images || [],
                    amenities: prop.amenities ? prop.amenities.map(a => a.name) : [],
                    bedrooms: prop.bedrooms || 1,
                    bathrooms: prop.bathrooms || 1,
                    maxGuests: prop.max_guests || 2,
                    rating: prop.rating || 0,
                    owner_name: prop.owner_name || '',
                    owner_phone: prop.owner_phone || '',
                    owner_email: prop.owner_email || '',
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    }

    async addProperty(propertyData) {
        try {
            const payload = {
                name: propertyData.name,
                description: propertyData.description,
                type: propertyData.type,
                price_per_night: propertyData.price,
                status: propertyData.status || 'Active',
                location: propertyData.location,
                address: propertyData.address,
                main_image: propertyData.image,
                owner_id: propertyData.ownerId,
                amenities: propertyData.amenities,
                bedrooms: propertyData.bedrooms,
                bathrooms: propertyData.bathrooms,
                maxGuests: propertyData.maxGuests,
                images: propertyData.images,
                owner_name: propertyData.owner_name || propertyData.ownerName,
                owner_phone: propertyData.owner_phone || propertyData.ownerPhone,
                owner_email: propertyData.owner_email || propertyData.ownerEmail,
            };
            console.log('Sending Add Property Payload:', payload);
            const response = await api.post('/v1/properties', payload);
            return response;
        } catch (error) {
            console.error('Error adding property:', error);
            throw error;
        }
    }

    async getPropertyById(id) {
        try {
            const response = await api.get(`/v1/properties/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching property details:', error);
            throw error;
        }
    }

    async updateProperty(id, propertyData) {
        try {
            const payload = {
                name: propertyData.name,
                description: propertyData.description,
                type: propertyData.type,
                price_per_night: propertyData.price,
                status: propertyData.status,
                location: propertyData.location,
                address: propertyData.address,
                main_image: propertyData.image,
                amenities: propertyData.amenities,
                bedrooms: propertyData.bedrooms,
                bathrooms: propertyData.bathrooms,
                maxGuests: propertyData.maxGuests,
                images: propertyData.images,
                owner_name: propertyData.owner_name || propertyData.ownerName,
                owner_phone: propertyData.owner_phone || propertyData.ownerPhone,
                owner_email: propertyData.owner_email || propertyData.ownerEmail,
            };
            console.log(`Sending Update Property Payload for ID ${id}:`, payload);
            const response = await api.put(`/v1/properties/${id}`, payload);
            return response;
        } catch (error) {
            console.error('Error updating property:', error);
            throw error;
        }
    }

    async deleteProperty(id) {
        try {
            const response = await api.delete(`/v1/properties/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting property:', error);
            throw error;
        }
    }
}

export const propertyService = new PropertyService();
