const wishlistRepository = require('./wishlist.repository');
const cache = require('../../utils/cache');

class WishlistService {
    async getUserWishlist(userId) {
        const cacheKey = `wishlist:${userId}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;
        
        const data = await wishlistRepository.findByUserId(userId);
        await cache.set(cacheKey, data, 120); // 120 secs
        return data;
    }

    async toggleWishlist(userId, entityType, entityId) {
        const added = await wishlistRepository.toggle(userId, entityType, entityId);

        // Invalidate cache immediately
        await cache.del(`wishlist:${userId}`);
        
        return { added };
    }
}

module.exports = new WishlistService();
