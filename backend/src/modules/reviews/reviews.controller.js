const reviewsService = require('./reviews.service');
const { sendResponse, sendError } = require('../../utils/response');

class ReviewsController {
    /**
     * POST /api/v1/reviews
     * Submit a new review (requires auth)
     */
    async createReview(req, res, next) {
        try {
            const userId   = req.user.id;
            const reviewId = await reviewsService.createReview(userId, req.body);
            return sendResponse(res, 201, true, 'Review submitted successfully.', { id: reviewId });
        } catch (error) {
            if (error.message.includes('already reviewed') || error.message.includes('only review')) {
                return sendError(res, 400, error.message);
            }
            next(error);
        }
    }

    /**
     * GET /api/v1/reviews/:entityType/:entityId
     * Public - Get paginated reviews for a hotel/room/property
     */
    async getReviews(req, res, next) {
        try {
            const { entityType, entityId } = req.params;
            const result = await reviewsService.getReviewsByEntity(entityType, entityId, req.query);
            return sendResponse(res, 200, true, 'Reviews fetched.', result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/reviews/:entityType/:entityId/stats
     * Public - Rating stats only (for cards/snippets)
     */
    async getStats(req, res, next) {
        try {
            const { entityType, entityId } = req.params;
            const stats = await reviewsService.getStats(entityType, entityId);
            return sendResponse(res, 200, true, 'Stats fetched.', stats);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/reviews/my-reviews
     * Authenticated - Reviews written by the current user
     */
    async getMyReviews(req, res, next) {
        try {
            const reviews = await reviewsService.getUserReviews(req.user.id, req.query.page, req.query.limit);
            return sendResponse(res, 200, true, 'Your reviews.', reviews);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/reviews/pending-prompts
     * Authenticated - Completed bookings that haven't been reviewed yet
     */
    async getPendingPrompts(req, res, next) {
        try {
            const userId = req.user?.id || req.query.userId;
            if (!userId) {
                return sendResponse(res, 200, true, 'No user context provided.', []);
            }
            const prompts = await reviewsService.getPendingReviewPrompts(userId);
            return sendResponse(res, 200, true, 'Review prompts fetched.', prompts);
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/v1/reviews/:id
     * Authenticated - User deletes their own review
     */
    async deleteReview(req, res, next) {
        try {
            await reviewsService.deleteReview(parseInt(req.params.id), req.user.id);
            return sendResponse(res, 200, true, 'Review deleted.');
        } catch (error) {
            if (error.message.includes('only delete')) return sendError(res, 403, error.message);
            if (error.message.includes('not found'))   return sendError(res, 404, error.message);
            next(error);
        }
    }
}

module.exports = new ReviewsController();
