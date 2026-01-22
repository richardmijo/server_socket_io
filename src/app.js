
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { dbLogger } from './middlewares/logger.middleware.js';

// Rutas (serán importadas aquí)
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import chatRoutes from './routes/chat.routes.js';
import { swaggerDocs } from './docs/swagger.js';

const app = express();

// Middlewares
app.use(helmet({
    contentSecurityPolicy: false
})); // Headers de seguridad (CSP deshabilitado para facilitar demo)
app.use(cors()); // CORS
app.use(morgan('dev')); // Logger HTTP
app.use(dbLogger); // Logger a Base de Datos
app.use(express.json()); // Parsear JSON
app.use(express.urlencoded({ extended: true }));

// Rutas Básicas
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Clean Architecture API 🚀' });
});

// Servir cliente de prueba
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.get('/test_client.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../test_client.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

swaggerDocs(app);

export default app;
