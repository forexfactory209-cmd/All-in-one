const roomsRepository = require('./rooms.repository');
const cache = require('../../utils/cache');

class RoomsService {
    mapRoom(room) {
        if (!room) return null;
        return {
            ...room,
            id: (room.id || '').toString(),
            hotel_id: (room.hotel_id || '').toString(),
            title: room.title || `${room.type || 'Standard'} Room`,
            hotel_name: room.hotel_name || '',
            price_per_night: parseFloat(room.price) || 0,
            city: room.hotel_location || '',
            country: 'Somalia',
            photos: room.images && room.images.length > 0
                ? room.images.map((url, i) => ({ id: `img-${i}`, photo_url: url }))
                : [{ id: 'main', photo_url: room.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811' }],
            average_rating: 4.5,
            isVerified: true,
            type: 'room'
        };
    }

    async getAllRooms(page = 1, limit = 10, filters = {}) {
        const cacheKey = `rooms:v1:all:p${page}:l${limit}:f${JSON.stringify(filters)}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;
        const rooms = await roomsRepository.findAll(limit, offset, filters);
        const total = await roomsRepository.countAll(filters);

        const mappedRooms = rooms.map(room => this.mapRoom(room));

        const result = {
            rooms: mappedRooms,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };

        await cache.set(cacheKey, result, 300);
        return result;
    }

    async getRoomsByHotelId(hotelId, page = 1, limit = 10) {
        const cacheKey = `rooms:list:h${hotelId}:p${page}:l${limit}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;
        const rooms = await roomsRepository.findAllByHotelId(hotelId, limit, offset);
        const total = await roomsRepository.countByHotelId(hotelId);

        const result = {
            rooms,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };

        await cache.set(cacheKey, result, 300);
        return result;
    }

    async getRoomById(id, dates = {}) {
        const { checkIn, checkOut } = dates;
        const cacheKey = `rooms:detail:${id}`;

        // Cache basic room info, but NOT availability
        let room = await cache.get(cacheKey);
        if (!room) {
            room = await roomsRepository.findById(id);
            if (room) await cache.set(cacheKey, room, 300);
        }

        if (!room) return null;

        // --- REAL-TIME AVAILABILITY CHECK (MANDATORY) ---
        // High-class engines never cache availability long-term
        const searchService = require('../search/search.service');
        const availability = await searchService.checkAvailability(
            id,
            checkIn || new Date().toISOString().split('T')[0],
            checkOut || new Date(Date.now() + 86400000).toISOString().split('T')[0]
        );

        return {
            ...room,
            realtime_status: availability.available ? 'Available' : 'Booked',
            availability_info: availability
        };
    }

    async createRoom(roomData) {
        const roomId = await roomsRepository.create(roomData);
        if (roomData.images) {
            await roomsRepository.syncImages(roomId, roomData.images);
        }
        // Invalidate list cache for this hotel
        const hotelId = roomData.hotel_id || roomData.hotelId;
        await cache.delByPattern(`rooms:list:h${hotelId}:*`);
        return roomId;
    }

    async updateRoom(id, roomData) {
        const oldRoom = await this.getRoomById(id);
        let updated = await roomsRepository.update(id, roomData);
        if (roomData.images) {
            await roomsRepository.syncImages(id, roomData.images);
            updated = true;
        }

        if (updated) {
            await cache.del(`rooms:detail:${id}`);
            const hotelId = oldRoom.hotel_id;
            await cache.delByPattern(`rooms:list:h${hotelId}:*`);
        }
        return updated;
    }

    async deleteRoom(id) {
        const oldRoom = await this.getRoomById(id);
        const success = await roomsRepository.delete(id);
        if (success) {
            await cache.del(`rooms:detail:${id}`);
            const hotelId = oldRoom.hotel_id;
            await cache.delByPattern(`rooms:list:h${hotelId}:*`);
        }
        return success;
    }
}

module.exports = new RoomsService();
