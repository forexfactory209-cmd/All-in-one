import api from '../../../services/api';

class RoomService {
    async getRoomsByHotelId(hotelId) {
        try {
            const response = await api.get(`/v1/rooms/hotel/${hotelId}`);
            if (response.success) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error('Error fetching rooms:', error);
            throw error;
        }
    }

    async addRoom(roomData) {
        try {
            const response = await api.post('/v1/rooms', {
                hotel_id: roomData.hotelId,
                room_number: roomData.roomNumber,
                type: roomData.type,
                price: roomData.price,
                beds: roomData.beds,
                max_guests: roomData.maxGuests,
                status: roomData.status,
                image_url: roomData.imageUrl,
                images: roomData.images,
                description: roomData.description
            });
            return response;
        } catch (error) {
            console.error('Error adding room:', error);
            throw error;
        }
    }

    async updateRoom(id, roomData) {
        try {
            const response = await api.put(`/v1/rooms/${id}`, {
                room_number: roomData.roomNumber,
                type: roomData.type,
                price: roomData.price,
                beds: roomData.beds,
                max_guests: roomData.maxGuests,
                status: roomData.status,
                image_url: roomData.imageUrl,
                images: roomData.images,
                description: roomData.description
            });
            return response;
        } catch (error) {
            console.error('Error updating room:', error);
            throw error;
        }
    }

    async deleteRoom(id) {
        try {
            const response = await api.delete(`/v1/rooms/${id}`);
            return response;
        } catch (error) {
            console.error('Error deleting room:', error);
            throw error;
        }
    }
}

export const roomService = new RoomService();
