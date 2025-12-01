import { Router } from 'express';
import { createSession, getMySessions, getMySummary, getPartnerSessionHistory } from '../controllers/session.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Record a completed session
router.post('/complete', verifyJWT, createSession);

// Get sessions for current user
router.get('/me', verifyJWT, getMySessions);

// Get session history for current user with a specific partner (by matchId)
router.get('/me/partner-history', verifyJWT, getPartnerSessionHistory);

// Summary for current user
router.get('/me/summary', verifyJWT, getMySummary);

export default router;
