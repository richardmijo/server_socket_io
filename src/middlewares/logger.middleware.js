
import prisma from '../utils/prisma.js';

export const dbLogger = async (req, res, next) => {
    // Capturar finalización de respuesta para guardar código de estado
    res.on('finish', async () => {
        // Filtrado básico: No guardar OPTIONS o health checks si es necesario
        if (req.method === 'OPTIONS') return;

        try {
            await prisma.systemLog.create({
                data: {
                    level: res.statusCode >= 400 ? 'ERROR' : 'INFO',
                    message: `${req.method} ${req.originalUrl} - ${res.statusCode}`,
                    meta: {
                        ip: req.ip,
                        userAgent: req.get('user-agent'),
                        body: req.method === 'POST' ? req.body : undefined, // Cuidado con datos sensibles en producción
                        user: req.user ? req.user.id : null,
                    },
                },
            });
        } catch (error) {
            console.error('Logger Error:', error);
        }
    });

    next();
};
