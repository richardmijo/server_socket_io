
import { Router } from 'express';
import { registerFCMToken } from '../controllers/user.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/users/fcm-token:
 *   post:
 *     summary: Register FCM Token for Push Notifications
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Firebase Cloud Messaging Token
 *               platform:
 *                 type: string
 *                 description: Platform (android, ios, web)
 *     responses:
 *       200:
 *         description: Token registered successfully
 */
router.post('/fcm-token', authenticateJWT, registerFCMToken);

export default router;
