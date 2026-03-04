const wishlistRepository = require('./wishlist.repository');

class WishlistService {
    async getUserWishlist(userId) {
        return await wishlistRepository.findByUserId(userId);
    }

    async toggleWishlist(userId, entityType, entityId) {
        const exists = await wishlistRepository.checkExists(userId, entityType, entityId);

        if (exists) {
            await wishlistRepository.remove(userId, entityType, entityId);
            return { added: false };
        } else {
            await wishlistRepository.add(userId, entityType, entityId);
            return { added: true };
        }
    }
}

module.exports = new WishlistService();
