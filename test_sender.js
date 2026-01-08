import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { transports: ["websocket"] });

socket.on("connect", () => {
    console.log("⚡️ Test Sender Conectado:", socket.id);

    // 1. Primero nos unimos al room (opcional tecnicamente, pero buena práctica)
    console.log("➡️ Uniendo a room-1...");
    socket.emit("joinConversation", { conversationId: "room-1" });
});

// 2. Esperamos confirmación de que nos unimos
socket.on("joined", (data) => {
    console.log("✅ Joined recibido:", data);

    // 3. Ahora enviamos el mensaje
    const payload = {
        conversationId: "room-1", // Debe coincidir con el room unido
        text: "Hola desde Test Sender (con Join previo)"
    };

    console.log("📤 Enviando evento 'message'...");
    socket.emit("message", payload, (ack) => {
        console.log("✅ ACK de mensaje recibido:", ack);
        socket.disconnect();
    });
});

socket.on("disconnect", () => {
    console.log("🔌 Test Sender Desconectado");
});
