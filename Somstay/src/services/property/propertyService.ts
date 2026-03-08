import api from '../api/client';
import { PropertyResponse } from './propertyService.types';

class PropertyService {
    async getHotels(page = 1, limit = 10, filters = {}) {
        const response = await api.get('/hotels', {
            params: { page, limit, ...filters }
        });
        return response.data;
    }

    async getHotelById(id: string | number) {
        const response = await api.get(`/hotels/${id}`);
        return response.data.data;
    }

    async getProperties(page = 1, limit = 10, filters = {}) {
        const response = await api.get('/properties', {
            params: { page, limit, ...filters }
        });
        return response.data;
    }

    async getPropertyById(id: string | number) {
        const response = await api.get(`/properties/${id}`);
        return response.data.data;
    }

    async getRoomById(id: string | number) {
        const response = await api.get(`/rooms/${id}`);
        return response.data.data;
    }

    async getLocations() {
        const response = await api.get('/hotels/locations');
        return response.data.data;
    }
}

export default new PropertyService();
