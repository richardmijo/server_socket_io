# Proyecto Server Socket.IO

Este es un proyecto sencillo para demostrar el funcionamiento de **Socket.IO** en tiempo real, utilizando el concepto de "Salas" (Rooms) para agrupar conexiones.

## 📂 Archivos Principales

- **`server.js`**: El servidor principal que gestiona las conexiones y distribuye los mensajes.
- **`listener.js`**: Un cliente de escucha que se conecta al servidor y muestra los mensajes recibidos en consola.
- **`test_sender.js`**: Un script de utilidad para simular el envío de mensajes (como si fuera otro cliente o Postman).

## 🚀 Cómo Iniciar

### 1. Instalar dependencias
Asegúrate de ejecutar esto la primera vez:
```bash
npm install
```

### 2. Levantar el Servidor
En una terminal:
```bash
npm start
```
_El servidor iniciará en `http://localhost:3000`._

### 3. Iniciar el Listener (Escucha)
En **otra** terminal:
```bash
npm run listen
```
_Este cliente se unirá automáticamente a la sala `room-1`._

---

## 🧪 Cómo Probar (Enviar Mensajes)

Tienes dos opciones para enviar mensajes y verlos aparecer en el `listener`:

### Opción A: Script de Prueba
Abre una **tercera** terminal y ejecuta:
```bash
node test_sender.js
```
Esto conectará un cliente temporal, enviará un mensaje y se desconectará.

### Opción B: Postman
1. Crea una request de tipo **Socket.IO** en Postman.
2. Conecta a `http://localhost:3000`.
3. Evento: `message:send`
4. Payload (Tipo JSON):
   ```json
   {
     "conversationId": "room-1",
     "text": "¡Hola desde Postman!"
   }
   ```
5. Click en Send.

---

## 🛠 Tecnologías
- Node.js
- Express
- Socket.IO (Server & Client)
