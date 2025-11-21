import { Router } from 'express';
import { createReview, getReviewsForUser, getAverageRating } from '../controllers/review.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Create review (authenticated)
router.post('/', verifyJWT, createReview);

// Get reviews for a user
router.get('/:userId', getReviewsForUser);

// Get average rating for a user
router.get('/:userId/average', getAverageRating);

export default router;
