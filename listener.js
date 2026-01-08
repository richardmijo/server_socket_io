// listener.js
import { io } from "socket.io-client"; // Importamos el cliente de Socket.IO

const ROOM = "room-1"; // El nombre de la sala a la que nos uniremos

// Conectamos al servidor local en el puerto 3000
const socket = io("http://localhost:3000", {
    transports: ["websocket"], // Usamos WebSocket puro para mejor rendimiento y compatibilidad
    reconnection: true, // Auto-reconectar si se cae el servidor
});

// ✅ Debugging global: esto imprime CUALQUIER evento que llegue al socket
// Es muy útil para ver qué está pasando realmente
socket.onAny((event, ...args) => {
    console.log("📡 [TODO] Evento recibido:", event, args);
});

// Evento "connect": se dispara cuando logramos conectar con éxito al servidor
socket.on("connect", () => {
    console.log("✅ Conectado al servidor. Mi ID de socket es:", socket.id);
    console.log("➡️ Intentando unirme (join) a la sala:", ROOM);

    // Emitimos el evento para unirnos al room
    socket.emit("joinConversation", { conversationId: ROOM });
});

// Escuchamos confirmación de que nos unimos
socket.on("joined", (data) => {
    console.log("👥 Confirmación: Me he unido al room:", data);
});

// --- AQUÍ LLEGAN LOS MENSAJES ---
// Escuchamos el evento "message:new" que emite el servidor cuando alguien envían algo
socket.on("message:new", (msg) => {
    console.log("\n📬 === NUEVO MENSAJE RECIBIDO ===");
    console.log("Texto:", msg.text);
    console.log("Room:", msg.conversationId);
    console.log("Fecha:", msg.createdAt);
    console.log("ID:", msg.id);
    console.log("===============================\n");
});

// Eventos de sistema: desconexión y errores
socket.on("disconnect", (reason) => {
    console.log("❌ Desconectado del servidor:", reason);
});

socket.on("connect_error", (err) => {
    console.log("⚠️ Error de conexión:", err.message);
});
