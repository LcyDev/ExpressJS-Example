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

if (!process.env.MONGODB_URI) {
    logger.error('Error: MONGODB_URI environment variable not defined');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Enable access from any origin
app.use(cors());

// Handle requests in JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log http requests
app.use(endpointLogger);

mongoose.connect(process.env.MONGODB_URI, {})
    .then(() => logger.info('Connected to MongoDB'))
    .catch((err) => logger.error('Error connecting to MongoDB:', err));

// Define API endpoints
const apiEndpoints = {
    products: {
        getAllProducts: {
            method: 'GET',
            path: '/products',
            description: 'Get all products',
        },
        getProduct: {
            method: 'GET',
            path: '/products/:id',
            description: 'Get an existing product',
        },
        createProduct: {
            method: 'POST',
            path: '/products',
            description: 'Create a new product',
        },
        bulkCreateProducts: {
            method: 'POST',
            path: '/products/bulk',
            description: 'Create multiple new products',
        },
        updateProduct: {
            method: 'PUT',
            path: '/products/:id',
            description: 'Update an existing product',
        },
        bulkUpdateProducts: {
            method: 'PUT',
            path: '/products/bulk',
            description: 'Update multiple existing products',
        },
        deleteProduct: {
            method: 'DELETE',
            path: '/products/:id',
            description: 'Delete a product',
        },
        bulkDeleteProducts: {
            method: 'DELETE',
            path: '/products/bulk',
            description: 'Delete a product',
        },
        deleteAllProducts: {
            method: 'DELETE',
            path: '/products',
            description: 'Delete all products',
        },
    },
    users: {
        getAllUsers: {
            method: 'GET',
            path: '/users',
            description: 'Get all users',
        },
        getUser: {
            method: 'GET',
            path: '/users/:id',
            description: 'Get an existing user',
        },
        createUser: {
            method: 'POST',
            path: '/users',
            description: 'Create a new user',
        },
        bulkCreateUsers: {
            method: 'POST',
            path: '/users/bulk',
            description: 'Create multiple new users',
        },
        updateUser: {
            method: 'PUT',
            path: '/users/:id',
            description: 'Update an existing user',
        },
        bulkUpdateUsers: {
            method: 'PUT',
            path: '/users/bulk',
            description: 'Update multiple existing users',
        },
        deleteUser: {
            method: 'DELETE',
            path: '/users/:id',
            description: 'Delete a user',
        },
        bulkDeleteUsers: {
            method: 'DELETE',
            path: '/users/bulk',
            description: 'Delete multiple users',
        },
        deleteAllUsers: {
            method: 'DELETE',
            path: '/users',
            description: 'Delete all users',
        },
    },
};

function registerResource(resource, controller) {
    Object.keys(apiEndpoints[resource]).forEach((func) => {
        const endpoint = apiEndpoints[resource][func];
        app[endpoint.method.toLowerCase()](endpoint.path, controller[func]);
        logger.info(`Route (${endpoint.method}) ${endpoint.path} registered -> ${func}()`);
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
    res.status(404).send(`Resource not found ${req.path}`);
});

// Handle global errors
app.use((err, req, res, next) => {
    logger.error(err);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

app.listen(PORT, () => {
    logger.info(`Express Server started and listening in port {${PORT}}`);
});