const wishlistService = require('./wishlist.service');
const { sendResponse, sendError } = require('../../utils/response');

class WishlistController {
    async getMyWishlist(req, res) {
        try {
            // TODO: Extract userId from auth middleware (req.user.id)
            const userId = req.user?.id || req.query.userId;
            if (!userId) return sendError(res, 400, 'User ID is required');

            const wishlist = await wishlistService.getUserWishlist(userId);
            return sendResponse(res, 200, true, 'Wishlist fetched successfully', wishlist);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async toggle(req, res) {
        try {
            const { entityType, entityId } = req.body;
            const userId = req.user?.id || req.body.userId;

            if (!userId || !entityType || !entityId) {
                return sendError(res, 400, 'User ID, entityType, and entityId are required');
            }

            const result = await wishlistService.toggleWishlist(userId, entityType, entityId);
            const message = result.added ? 'Added to wishlist' : 'Removed from wishlist';

            return sendResponse(res, 200, true, message, result);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }
}

module.exports = new WishlistController();
