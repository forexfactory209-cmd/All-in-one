import api from '../api/client';

// ── Types ───────────────────────────────────────────────────────────────────

export type EntityType = 'Hotel' | 'Room' | 'Property';

export interface CreateReviewData {
    entity_type: EntityType;
    entity_id:   number;
    booking_id?: number;
    rating:      number;        // 1–5
    title?:      string;
    body?:       string;
    cleanliness?: number;
    service?:     number;
    value?:       number;
    location?:    number;
}

export interface Review {
    id:             number;
    user_id:        number;
    reviewer_name:  string;
    reviewer_since: string;
    entity_type:    EntityType;
    entity_id:      number;
    booking_id:     number | null;
    rating:         number;
    title:          string | null;
    body:           string | null;
    cleanliness:    number | null;
    service:        number | null;
    value:          number | null;
    location:       number | null;
    created_at:     string;
}

export interface ReviewStats {
    avg_rating:      number;
    total:           number;
    avg_cleanliness: number | null;
    avg_service:     number | null;
    avg_value:       number | null;
    avg_location:    number | null;
    five_star:       number;
    four_star:       number;
    three_star:      number;
    two_star:        number;
    one_star:        number;
}

export interface ReviewsResult {
    stats:      ReviewStats;
    reviews:    Review[];
    pagination: { total: number; page: number; limit: number; totalPages: number };
}

export interface ReviewPrompt {
    booking_id:   number;
    entity_type:  EntityType;
    entity_id:    number;
    entity_name:  string;
    entity_image: string | null;
    check_out:    string;
}

// ── Service ─────────────────────────────────────────────────────────────────

class ReviewService {
    /** Submit a new review */
    async createReview(data: CreateReviewData): Promise<{ id: number }> {
        const response = await api.post('/reviews', data);
        return response.data.data;
    }

    /** Get reviews for an entity with pagination */
    async getReviews(
        entityType: EntityType,
        entityId: number | string,
        params: { page?: number; limit?: number; sort?: 'newest' | 'highest' | 'lowest' } = {}
    ): Promise<ReviewsResult> {
        const response = await api.get(`/reviews/${entityType}/${entityId}`, { params });
        return response.data.data;
    }

    /** Get rating stats only (lighter call for cards) */
    async getStats(entityType: EntityType, entityId: number | string): Promise<ReviewStats> {
        const response = await api.get(`/reviews/${entityType}/${entityId}/stats`);
        return response.data.data;
    }

    /** Reviews the current user has written */
    async getMyReviews(): Promise<Review[]> {
        const response = await api.get('/reviews/my-reviews');
        return response.data.data;
    }

    /** Completed bookings not yet reviewed (for prompts) */
    async getPendingPrompts(): Promise<ReviewPrompt[]> {
        const response = await api.get('/reviews/pending-prompts', {
            params: { userId: 1 } // Placeholder for dev
        });
        return response.data.data;
    }

    /** Delete the user's own review */
    async deleteReview(reviewId: number): Promise<void> {
        await api.delete(`/reviews/${reviewId}`);
    }
}

export const reviewService = new ReviewService();
export default reviewService;
