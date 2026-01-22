
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { config } from '../config/index.js';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend API for Flutter Chat',
            version: '1.0.0',
            description: 'API documentation for the Clean Architecture Node.js Backend',
        },
        servers: [
            {
                url: `http://localhost:${config.port}`,
                description: 'Local server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const swaggerDocs = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
