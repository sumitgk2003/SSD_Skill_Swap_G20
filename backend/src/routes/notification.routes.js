import express from 'express';
import { getNotifications, markAsRead, markAllRead } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', verifyJWT, getNotifications);
router.patch('/:id/mark-read', verifyJWT, markAsRead);
router.post('/mark-all-read', verifyJWT, markAllRead);

export default router;
