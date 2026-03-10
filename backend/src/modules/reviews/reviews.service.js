const reviewsRepository = require('./reviews.repository');
const cache = require('../../utils/cache');

class ReviewsService {
    /**
     * Submit a new review
     */
    async createReview(userId, data) {
        const { booking_id, rating } = data;

        // Must be a valid rating
        if (!rating || rating < 1 || rating > 5) {
            throw new Error('Rating must be between 1 and 5.');
        }

        // If booking_id provided: validate eligibility
        if (booking_id) {
            const booking = await reviewsRepository.isBookingEligible(booking_id, userId);
            if (!booking) {
                throw new Error('You can only review completed bookings that belong to you.');
            }

            const existing = await reviewsRepository.findByUserAndBooking(userId, booking_id);
            if (existing) {
                throw new Error('You have already reviewed this booking.');
            }

            // Inherit entity info from booking if not provided
            data.entity_type = data.entity_type || booking.entity_type;
            data.entity_id   = data.entity_id   || booking.entity_id;
        }

        if (!data.entity_type || !data.entity_id) {
            throw new Error('entity_type and entity_id are required.');
        }

        const reviewId = await reviewsRepository.create({ ...data, user_id: userId });

        // Invalidate cached stats & listing
        await this._invalidateCache(data.entity_type, data.entity_id);

        return reviewId;
    }

    /**
     * Get paginated reviews for a hotel / room / property
     */
    async getReviewsByEntity(entity_type, entity_id, options = {}) {
        const cacheKey = `reviews:${entity_type}:${entity_id}:p${options.page || 1}:s${options.sort || 'newest'}`;
        const cached   = await cache.get(cacheKey);
        if (cached) return cached;

        const limit  = parseInt(options.limit)  || 10;
        const offset = ((parseInt(options.page)  || 1) - 1) * limit;

        const [reviews, count, stats] = await Promise.all([
            reviewsRepository.findByEntity(entity_type, entity_id, { limit, offset, sort: options.sort }),
            reviewsRepository.countByEntity(entity_type, entity_id),
            reviewsRepository.statsByEntity(entity_type, entity_id),
        ]);

        const result = {
            stats,
            reviews,
            pagination: {
                total:      count,
                page:       parseInt(options.page) || 1,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        };

        await cache.set(cacheKey, result, 120); // 2-minute cache
        return result;
    }

    /**
     * Get stats only (for displaying in hotel/room cards)
     */
    async getStats(entity_type, entity_id) {
        const cacheKey = `reviews:stats:${entity_type}:${entity_id}`;
        const cached   = await cache.get(cacheKey);
        if (cached) return cached;

        const stats = await reviewsRepository.statsByEntity(entity_type, entity_id);
        await cache.set(cacheKey, stats, 300);
        return stats;
    }

    /**
     * Reviews written by a specific user
     */
    async getUserReviews(userId, page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        return reviewsRepository.findByUser(userId, limit, offset);
    }

    /**
     * Bookings that are complete but not yet reviewed (for review prompts)
     */
    async getPendingReviewPrompts(userId) {
        return reviewsRepository.findUnreviewedBookings(userId);
    }

    /**
     * Delete a review (user can delete their own)
     */
    async deleteReview(reviewId, userId) {
        const review = await reviewsRepository.findById(reviewId);
        if (!review) throw new Error('Review not found.');
        if (review.user_id !== userId) throw new Error('You can only delete your own reviews.');

        const success = await reviewsRepository.delete(reviewId, userId);
        if (success) {
            await this._invalidateCache(review.entity_type, review.entity_id);
        }
        return success;
    }

    // ─── Helpers ───────────────────────────────────────────────────────────────

    async _invalidateCache(entity_type, entity_id) {
        await cache.delByPattern(`reviews:${entity_type}:${entity_id}:*`);
        await cache.del(`reviews:stats:${entity_type}:${entity_id}`);
        // Also invalidate the hotel/property listing caches
        if (entity_type === 'Hotel' || entity_type === 'Room') {
            await cache.delByPattern('hotels:*');
        } else if (entity_type === 'Property') {
            await cache.delByPattern('properties:*');
        }
    }
}

module.exports = new ReviewsService();
