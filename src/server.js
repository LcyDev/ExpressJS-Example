import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import productCtrl from './controllers/products.js';
import userCtrl from './controllers/users.js';
import endpointLogger from './middleware/endpointLogger.js';
import logger from './utils/logger.js'

// Initialize
dotenv.config();
mongoose.connect(process.env.MONGODB_URI, {});

const app = express();
const PORT = process.env.PORT || 8080;

// Enable access from any origin
app.use(cors());
// Handle requests in JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Log http requests
app.use(endpointLogger);

// Define API endpoints
const apiEndpoints = {
    products: {
        getProducts: {
            method: 'GET',
            path: '/products',
            description: 'Obtener todos los productos',
        },
        createProduct: {
            method: 'POST',
            path: '/products',
            description: 'Crear un nuevo producto',
        },
        createMultipleProducts: {
            method: 'POST',
            path: '/products/multiple',
            description: 'Crear múltiples productos',
        },
        updateProduct: {
            method: 'PUT',
            path: '/products/:id',
            description: 'Actualizar un producto',
        },
        updateMultipleProducts: {
            method: 'PUT',
            path: '/products/multiple',
            description: 'Actualizar múltiples productos',
        },
        deleteProduct: {
            method: 'DELETE',
            path: '/products/:id',
            description: 'Eliminar un producto',
        },
        deleteAllProducts: {
            method: 'DELETE',
            path: '/products',
            description: 'Eliminar todos los productos',
        },
    },
    users: {
        getUsers: {
            method: 'GET',
            path: '/users',
            description: 'Obtener todos los usuarios',
        },
        createUser: {
            method: 'POST',
            path: '/users',
            description: 'Crear un nuevo usuario',
        },
        createMultipleUsers: {
            method: 'POST',
            path: '/users/multiple',
            description: 'Crear múltiples usuarios',
        },
        updateUser: {
            method: 'PUT',
            path: '/users/:id',
            description: 'Actualizar un usuario',
        },
        updateMultipleUsers: {
            method: 'PUT',
            path: '/users/multiple',
            description: 'Actualizar múltiples usuarios',
        },
        deleteUser: {
            method: 'DELETE',
            path: '/users/:id',
            description: 'Eliminar un usuario',
        },
        deleteAllUsers: {
            method: 'DELETE',
            path: '/users',
            description: 'Eliminar todos los usuarios',
        },
    },
};

function registerResource(resource, controller) {
    Object.keys(apiEndpoints[resource]).forEach((func) => {
        const endpoint = apiEndpoints[resource][func];
        app[endpoint.method.toLowerCase()](endpoint.path, controller[func]);
        logger.info(`Ruta (${endpoint.method}) ${endpoint.path} registrada -> ${func}()`);
    });
}
// Register API endpoints
registerResource('products', productCtrl)
registerResource('users', userCtrl)

// Root endpoint: provide a JSON with all API endpoints
app.get('/', (req, res) => {
    res.status(200).json(apiEndpoints);
});

// Handle 404 errors
app.use((req, res, next) => {
    logger.info(`The specified resource doesn't exist: ${req.path}`);
    res.status(404).send(`No se encontró la ruta ${req.path} (404)`);
});

// Handle global errors
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: err.message
    });
});

app.listen(PORT, () => {
    logger.info(`Servidor Express iniciado en el puerto {${PORT}}`);
});