
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import prisma from './utils/prisma.js';
import { socketConfig } from './services/socket.service.js';

const PORT = process.env.PORT || 3000;

// Crear servidor HTTP
const httpServer = http.createServer(app);

// Inicializar Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Adjust in production
        methods: ["GET", "POST"]
    }
});

// Inicializar lógica de Socket.IO
socketConfig(io);

// Iniciar servidor
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Manejo de apagado elegante (Graceful Shutdown)
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
