const express = require('express');
const router = express.Router();
const reviewsController = require('./reviews.controller');
const { protect } = require('../../middleware/auth.middleware');

// ── Public routes ──────────────────────────────────────────────────────────
// GET /api/v1/reviews/:entityType/:entityId           → list reviews
router.get('/:entityType/:entityId', reviewsController.getReviews.bind(reviewsController));

// GET /api/v1/reviews/:entityType/:entityId/stats     → rating breakdown
router.get('/:entityType/:entityId/stats', reviewsController.getStats.bind(reviewsController));

// GET /api/v1/reviews/pending-prompts                → unreviewed completed bookings
router.get('/pending-prompts', reviewsController.getPendingPrompts.bind(reviewsController));

// ── Authenticated routes ───────────────────────────────────────────────────
router.use(protect);

// POST /api/v1/reviews                               → create a review
router.post('/', reviewsController.createReview.bind(reviewsController));

// GET /api/v1/reviews/my-reviews                     → current user's reviews
router.get('/my-reviews', reviewsController.getMyReviews.bind(reviewsController));

// DELETE /api/v1/reviews/:id                         → delete own review
router.delete('/:id', reviewsController.deleteReview.bind(reviewsController));

module.exports = router;
