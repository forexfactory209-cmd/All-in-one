import api from '../../../services/api';

/**
 * Review Service - Pure API Bridge
 * Manages property and guest reviews and moderation.
 */
export const reviewService = {
    // Fetch all reviews for moderation
    getAllReviews: async () => {
        return await api.get('/reviews');
    },

    // Delete or hide a review
    deleteReview: async (id) => {
        return await api.delete(`/reviews/${id}`);
    }
};
