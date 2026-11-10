import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Product from '../../../src/models/Product.js';
import server from '../../../src/server.js';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

describe('Products API - GET All Tests', () => {
    beforeEach(async () => {
        // Ensure a clean database state before each test
        await Product.deleteMany({});
    });

    afterEach(async () => {
        // Clean up database after test execution
        await Product.deleteMany({});
    });

    it('should return an array of Product objects and a 200 status when products exist', async () => {
        // Seed test products in the database
        await Product.create([
            { name: faker.commerce.productName(), price: 10, description: faker.lorem.sentence() },
            { name: faker.commerce.productName(), price: 20, description: faker.lorem.sentence() }
        ]);

        const res = await supertest(server).get('/products');

        assert.strictEqual(res.status, 200);
        assert.strictEqual(Array.isArray(res.body), true);
        assert.ok(res.body.length >= 2);
        assert.strictEqual(typeof res.body[0].name, 'string');
        assert.strictEqual(typeof res.body[0].price, 'number');
    });

    it('should return an empty array with a 200 status when no products exist', async () => {
        const res = await supertest(server).get('/products');

        assert.strictEqual(res.status, 200);
        assert.strictEqual(Array.isArray(res.body), true);
        assert.strictEqual(res.body.length, 0);
    });
});