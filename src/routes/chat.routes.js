
import { Router } from 'express';
import { getChatHistory, initDirectChat } from '../controllers/chat.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/chat/history/{roomId}:
 *   get:
 *     summary: Get chat history for a specific room
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the room
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of messages to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: Chat history
 */
router.get('/history/:roomId', authenticateJWT, getChatHistory);

/**
 * @swagger
 * /api/chat/direct:
 *   post:
 *     summary: Initiate or get existing direct chat room with a user
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 description: ID of the user to chat with
 *     responses:
 *       200:
 *         description: Room details
 */
router.post('/direct', authenticateJWT, initDirectChat);

export default router;
