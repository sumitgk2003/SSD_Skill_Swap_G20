import { Router } from 'express';
import { createDispute, getAllDisputes, updateDisputeStatus } from '../controllers/dispute.controller.js';
import { verifyJWT, verifyAdminJWT, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// Create a dispute (authenticated users can report)
router.post('/', verifyJWT, createDispute);

// Admin: list all disputes
router.get('/', verifyAdminJWT, requireAdmin, getAllDisputes);

// Admin: update dispute status
router.patch('/:id/status', verifyAdminJWT, requireAdmin, updateDisputeStatus);

export default router;
