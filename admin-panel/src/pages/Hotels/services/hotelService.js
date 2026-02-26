import api from '../../../services/api';

class HotelService {
    async getHotels() {
        try {
            const response = await api.get('/v1/hotels');
            if (response.success) {
                // Map backend fields to frontend expectations if necessary
                return response.data.map(hotel => ({
                    id: `HTL-${String(hotel.id).padStart(4, '0')}`,
                    dbId: hotel.id,
                    name: hotel.name,
                    location: hotel.location,
                    totalRooms: hotel.total_rooms,
                    availableRooms: hotel.available_rooms,
                    rating: parseFloat(hotel.rating),
                    basePrice: hotel.base_price,
                    description: hotel.description || '',
                    image: hotel.main_image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
                    images: hotel.images || [],
                    status: hotel.status,
                    amenities: hotel.amenities ? hotel.amenities.map(a => a.name) : [],
                    owner_name: hotel.owner_name || '',
                    owner_phone: hotel.owner_phone || '',
                    owner_email: hotel.owner_email || '',
                }));
            }
            return [];
        } catch (error) {
            console.error('Error fetching hotels:', error);
            throw error;
        }
    }

    async addHotel(hotelData) {
        try {
            const payload = {
                name: hotelData.name,
                location: hotelData.location,
                total_rooms: hotelData.totalRooms,
                available_rooms: hotelData.availableRooms || hotelData.totalRooms,
                base_price: hotelData.basePrice,
                description: hotelData.description,
                main_image: hotelData.image,
                status: 'Active',
                amenities: hotelData.amenities,
                images: hotelData.images,
                owner_name: hotelData.owner_name || hotelData.ownerName,
                owner_phone: hotelData.owner_phone || hotelData.ownerPhone,
                owner_email: hotelData.owner_email || hotelData.ownerEmail,
            };
            console.log('Sending Add Hotel Payload:', payload);
            const response = await api.post('/v1/hotels', payload);
            return response;
        } catch (error) {
            console.error('Error adding hotel:', error);
            throw error;
        }
    }

    async getHotelById(id) {
        try {
            const response = await api.get(`/v1/hotels/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching hotel details:', error);
            throw error;
        }
    }

    async updateHotel(id, hotelData) {
        try {
            const payload = {
                name: hotelData.name,
                location: hotelData.location,
                total_rooms: hotelData.totalRooms,
                available_rooms: hotelData.availableRooms || hotelData.totalRooms,
                base_price: hotelData.basePrice,
                description: hotelData.description,
                main_image: hotelData.image,
                status: hotelData.status || 'Active',
                amenities: hotelData.amenities,
                images: hotelData.images,
                owner_name: hotelData.owner_name || hotelData.ownerName,
                owner_phone: hotelData.owner_phone || hotelData.ownerPhone,
                owner_email: hotelData.owner_email || hotelData.ownerEmail,
            };
            console.log(`Sending Update Hotel Payload for ID ${id}:`, payload);
            const response = await api.put(`/v1/hotels/${id}`, payload);
            return response;
        } catch (error) {
            console.error('Error updating hotel:', error);
            throw error;
        }
    }

    async deleteHotel(id) {
        try {
            const response = await api.delete(`/v1/hotels/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting hotel:', error);
            throw error;
        }
    }
}

export const hotelService = new HotelService();
