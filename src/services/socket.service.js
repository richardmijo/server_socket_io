
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import prisma from '../utils/prisma.js';
import { saveMessage } from './chat.service.js';

export const socketConfig = (io) => {

    // Middleware: Autenticación
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) throw new Error('Authentication error');

            const decoded = jwt.verify(token, config.jwtSecret);
            socket.user = decoded; // { id, email }

            // Actualizar estado 'en línea'
            await prisma.user.update({
                where: { id: decoded.id },
                data: { isOnline: true },
            });

            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.user.email} (${socket.id})`);

        // Unirse a una sala específica
        socket.on('join_room', async ({ roomId }) => {
            socket.join(roomId);
            console.log(`Usuario ${socket.user.email} se unió a la sala: ${roomId}`);
        });

        // Enviar Mensaje
        socket.on('send_message', async ({ roomId, content, type }, callback) => {
            try {
                console.log(`📩 Nuevo mensaje en ${roomId} de ${socket.user.email}`);

                // 1. Guardar en BD
                const message = await saveMessage(roomId, socket.user.id, content, type);

                // 2. Transmitir a la sala (incluyendo al remitente para confirmar ID y fecha del servidor)
                io.to(roomId).emit('new_message', message);

                // 3. Confirmar al remitente
                if (callback) callback({ status: 'ok', message });

            } catch (error) {
                console.error('Error sending message:', error);
                if (callback) callback({ status: 'error', error: error.message });
            }
        });

        // Desconexión
        socket.on('disconnect', async () => {
            console.log(`❌ Usuario desconectado: ${socket.user.email}`);
            await prisma.user.update({
                where: { id: socket.user.id },
                data: { isOnline: false, lastSeen: new Date() },
            });
        });
    });
};
