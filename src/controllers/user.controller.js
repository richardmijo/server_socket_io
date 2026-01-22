
import { saveDeviceToken } from '../services/user.service.js';

export const registerFCMToken = async (req, res) => {
    try {
        const { token, platform } = req.body;
        const userId = req.user.id; // Del Middleware JWT

        if (!token) return res.status(400).json({ error: 'Token is required' });

        await saveDeviceToken(userId, token, platform);
        res.json({ message: 'Token registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
