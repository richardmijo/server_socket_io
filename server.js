// server.js
// Importamos las librerías necesarias
import express from "express"; // Framework web (opcional aquí, pero útil si escalas)
import http from "http"; // Módulo nativo HTTP de Node.js para crear el servidor
import { Server } from "socket.io"; // Clase principal de Socket.IO para el servidor
import crypto from "crypto"; // Para generar IDs únicos (UUID)

const app = express();
app.use(express.json()); // Middleware para parsear JSON en peticiones HTTP normales

// Endpoint REST básico para comprobar que el servidor corre (http://localhost:3000)
app.get("/", (_, res) => res.send("OK"));

// Creamos el servidor HTTP pasando la app de Express
const server = http.createServer(app);

// Inicializamos Socket.IO adjuntándolo al servidor HTTP
const io = new Server(server, {
    cors: { origin: "*" }, // Permitimos conexiones desde cualquier origen (útil para desarrollo)
    transports: ["websocket"], // Forzamos transporte WebSocket (recomendado para Postman y clientes modernos)
});

// Evento principal: se dispara cuando un cliente (Postman, navegador, app) se conecta
io.on("connection", (socket) => {
    console.log("✅ conectado:", socket.id);

    // Evento se dispara si el cliente se desconecta
    socket.on("disconnect", (reason) => {
        console.log("❌ desconectado:", socket.id, "reason:", reason);
    });

    // --- EVENTO PERSONALIZADO: Unirse a una sala (room) ---
    // El cliente envía "joinConversation" con un ID de conversación
    socket.on("joinConversation", ({ conversationId }) => {
        // El socket se "suscribe" al canal con ese nombre
        socket.join(conversationId);

        console.log(`👥 ${socket.id} se unió a room ${conversationId}`);
        // socket.rooms es un Set que contiene los rooms donde está este socket
        console.log("   rooms de este socket:", [...socket.rooms]);

        // Confirmamos al cliente que se unió exitosamente
        socket.emit("joined", { conversationId });
    });

    // --- LÓGICA DE MENSAJERÍA ---
    // Función reutilizable para procesar mensajes entrantes
    const handleMessage = async (payload, ack) => {
        // Construimos el objeto del mensaje final con metadatos del servidor
        const msg = {
            id: crypto.randomUUID(), // ID único generado por el server
            conversationId: payload.conversationId, // Room destino
            text: payload.text, // Contenido del mensaje
            createdAt: new Date().toISOString(), // Fecha creación
        };

        console.log("📩 message:send (procesado):", msg);

        // (Opcional) Debug: Verificar quién está escuchando en ese room
        try {
            const socketsInRoom = await io.in(msg.conversationId).fetchSockets();
            console.log(
                `   sockets en room ${msg.conversationId} (ids):`,
                socketsInRoom.map((s) => s.id)
            );
        } catch (e) {
            console.log("⚠️ error en fetchSockets():", e.message);
        }

        // --- BROADCAST ---
        // Emitimos el evento "message:new" a TODOS los que estén en ese room
        // .to() selecciona el destino, .emit() envía los datos
        io.to(msg.conversationId).emit("message:new", msg);

        // --- ACKNOWLEDGEMENT (Confirmación) ---
        // Si el cliente envió una función de callback (ack), la ejecutamos para confirmar recepción
        if (typeof ack === "function") {
            ack({ ok: true, serverMsgId: msg.id });
        }
    };

    // Evento principal para enviar mensajes
    socket.on("message:send", handleMessage);

    // Evento fallback por si el cliente (como Postman por defecto) envía el evento "message"
    // Esto asegura que ambos eventos procesen el mensaje de la misma forma
    socket.on("message", handleMessage);
});

// Iniciamos el servidor en el puerto 3000
server.listen(3000, () => console.log("🚀 Server corriendo en http://localhost:3000"));
