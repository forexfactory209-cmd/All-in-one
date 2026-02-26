const hotelsRepository = require('./hotels.repository');
const roomsRepository = require('../rooms/rooms.repository');

class HotelsService {
    async getAllHotels() {
        const hotels = await hotelsRepository.findAll();
        // Enrich each hotel with its amenities and images for the list view
        const enrichedHotels = await Promise.all(hotels.map(async (hotel) => {
            hotel.amenities = await hotelsRepository.findAmenitiesByHotelId(hotel.id);
            hotel.images = await hotelsRepository.findImagesByHotelId(hotel.id);
            return hotel;
        }));
        return enrichedHotels;
    }

    async getHotelById(id) {
        const hotel = await hotelsRepository.findById(id);
        if (hotel) {
            hotel.amenities = await hotelsRepository.findAmenitiesByHotelId(id);
            hotel.rooms = await roomsRepository.findAllByHotelId(id);
        }
        return hotel;
    }

    async createHotel(hotelData) {
        const hotelId = await hotelsRepository.create(hotelData);
        if (hotelData.amenities) {
            await hotelsRepository.syncAmenities(hotelId, hotelData.amenities);
        }
        if (hotelData.images) {
            await hotelsRepository.syncImages(hotelId, hotelData.images);
        }
        return hotelId;
    }

    async updateHotel(id, hotelData) {
        let updated = await hotelsRepository.update(id, hotelData);
        if (hotelData.amenities) {
            await hotelsRepository.syncAmenities(id, hotelData.amenities);
            updated = true;
        }
        if (hotelData.images) {
            await hotelsRepository.syncImages(id, hotelData.images);
            updated = true;
        }
        return updated;
    }

    async deleteHotel(id) {
        return await hotelsRepository.delete(id);
    }
}

module.exports = new HotelsService();
