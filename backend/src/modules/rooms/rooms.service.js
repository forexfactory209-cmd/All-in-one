const roomsRepository = require('./rooms.repository');
const cache = require('../../utils/cache');

class RoomsService {
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

    async getRoomById(id) {
        const cacheKey = `rooms:detail:${id}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const room = await roomsRepository.findById(id);
        if (room) {
            await cache.set(cacheKey, room, 300);
        }
        return room;
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
