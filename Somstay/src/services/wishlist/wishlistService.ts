import api from '../api/client';

export interface WishlistItem {
    id: number;
    user_id: number;
    entity_type: 'Hotel' | 'Property';
    entity_id: number;
    name: string;
    location: string;
    image: string;
    price: number;
}

class WishlistService {
    async getMyWishlist() {
        const response = await api.get('/wishlist');
        return response.data;
    }

    async toggleWishlist(entityType: 'Hotel' | 'Property', entityId: number) {
        const response = await api.post('/wishlist/toggle', {
            entityType,
            entityId,
            userId: 1 // TODO: Get from auth context
        });
        return response.data;
    }
}

export default new WishlistService();
