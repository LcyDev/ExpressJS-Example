import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Product from '../../src/models/Product.js';
import server from '../../src/server.js';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

describe('Product Creation - Empty Description Tests', () => {
    let createdProductId;

    beforeEach(async () => {
        // Ensure a clean database state before each test
        await Product.deleteMany({});
    });

    afterEach(async () => {
        // Clean up the created product after the test runs
        if (createdProductId) {
            await Product.findByIdAndDelete(createdProductId);
            createdProductId = null;
        }
    });

    it('should create a new product with all required fields and return a 201 status', async () => {
        const productData = {
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            description: faker.lorem.sentence()
        };

        const res = await supertest(server)
            .post('/products')
            .send(productData);

        assert.strictEqual(res.status, 201);
        assert.strictEqual(typeof res.body, 'object');
        assert.strictEqual(res.body.name, productData.name);
        assert.strictEqual(res.body.price, productData.price);
        assert.strictEqual(res.body.description, productData.description);

        // Save ID for cleanup
        createdProductId = res.body._id;
        assert.ok(createdProductId);
    });

    it('should create a new product with an empty description and return a 201 status', async () => {
        const productData = {
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            description: ''
        };

        // Note: Ensure your route path matches your server configuration (e.g., '/products' vs '/api/products')
        const res = await supertest(server)
            .post('/products')
            .send(productData);

        assert.strictEqual(res.status, 201);
        assert.strictEqual(typeof res.body, 'object');
        assert.ok(res.body.name);
        assert.ok(res.body.price);

        // Save ID for cleanup
        createdProductId = res.body._id;

        // Verify description is either omitted or empty depending on your Mongoose schema configuration
        assert.strictEqual(res.body.description, '');
    });
});