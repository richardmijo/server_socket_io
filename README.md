# Backend de Chat con Socket.IO y Node.js

Este es un backend educativo utilizando **Arquitectura Limpia (Clean Architecture)**.

## 🚀 Requisitos Previos

1.  **Node.js** instalado.
2.  **PostgreSQL** instalado y corriendo.
3.  Crear una base de datos vacía en Postgres (ej. `chat_db`).

## 🛠 Configuración Inicial

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Configurar Variables de Entorno**:
    *   Renombra o edita el archivo `.env`.
    *   Asegúrate de poner tus credenciales de Postgres correctamente:
    ```env
    DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_bd"
    ```

3.  **Iniciar Base de Datos (Migraciones)**:
    Esto creará las tablas (User, Message, etc.) en tu base de datos automáticamente.
    ```bash
    npx prisma migrate dev --name init
    ```

## ▶️ Ejecutar el Servidor

Para desarrollo (se reinicia al guardar cambios):
```bash
npm run dev
```

El servidor iniciará en: `http://localhost:3000`

## 📚 Documentación de API (Swagger)

Una vez corriendo el servidor, visita esta URL para ver **todas las rutas y probarlas visualmente**:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 🗺 Guía Rápida de Rutas

El código está organizado modularmente en `src/routes`:

### 🔐 Autenticación (`/api/auth`)
*   `POST /register` -> Crear nuevo usuario.
*   `POST /login` -> Iniciar sesión (recibes un `token`).

### 👤 Usuarios (`/api/users`)
*   `POST /fcm-token` -> Guardar token para notificaciones push (Firebase).

### 💬 Chat (`/api/chat`)
*   `GET /history/:roomId` -> Ver mensajes anteriores.
*   `POST /direct` -> Iniciar chat privado con alguien.

### ⚡️ Socket.IO (Tiempo Real)
*   **Conexión**: Requiere enviar el `token` de autenticación.
*   Eventos: `join_room`, `send_message`, `new_message`.

---

## 📁 Estructura del Proyecto

*   `src/app.js`: Configuración principal de Express.
*   `src/server.js`: Punto de entrada (levanta el servidor).
*   `src/routes/`: Definición de las URLs.
*   `src/controllers/`: Funciones que reciben la petición y responden.
*   `src/services/`: Lógica "pesada" (guardar en BD, hash passwords, etc).
*   `src/middlewares/`: Protecciones (validar Token JWT, logs).
