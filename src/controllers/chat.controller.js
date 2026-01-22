
import { getMessages, createOrGetDirectRoom } from '../services/chat.service.js';

export const getChatHistory = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { limit, offset } = req.query;

        // Opcional: Verificar si el usuario participa en la sala

        const messages = await getMessages(roomId, Number(limit) || 50, Number(offset) || 0);
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const initDirectChat = async (req, res) => {
    try {
        const { targetUserId } = req.body;
        const currentUserId = req.user.id;

        const room = await createOrGetDirectRoom(currentUserId, targetUserId);
        res.json(room);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
