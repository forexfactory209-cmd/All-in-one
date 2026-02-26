const roomsRepository = require('./rooms.repository');

class RoomsService {
    async getRoomsByHotelId(hotelId) {
        return await roomsRepository.findAllByHotelId(hotelId);
    }

    async getRoomById(id) {
        return await roomsRepository.findById(id);
    }

    async createRoom(roomData) {
        const roomId = await roomsRepository.create(roomData);
        if (roomData.images) {
            await roomsRepository.syncImages(roomId, roomData.images);
        }
        return roomId;
    }

    async updateRoom(id, roomData) {
        let updated = await roomsRepository.update(id, roomData);
        if (roomData.images) {
            await roomsRepository.syncImages(id, roomData.images);
            updated = true;
        }
        return updated;
    }

    async deleteRoom(id) {
        return await roomsRepository.delete(id);
    }
}

module.exports = new RoomsService();
