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
        return response.data;
    }

    async getLocations() {
        const response = await api.get('/hotels/locations');
        return response.data;
    }
}

export default new PropertyService();
