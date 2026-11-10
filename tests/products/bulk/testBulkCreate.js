import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Product from '../../../src/models/Product.js';
import server from '../../../src/server.js';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

describe('Products API - Bulk Create Tests', () => {
    // Keep track of any IDs created during tests so we can clean them up targetedly
    let createdIds = [];

    beforeEach(async () => {
        await Product.deleteMany({});
        createdIds = [];
    });

    afterEach(async () => {
        if (createdIds.length > 0) {
            await Product.deleteMany({ _id: { $in: createdIds } });
        }
    });

    it('should create multiple new Product objects and return them (201)', async () => {
        const productsToCreate = Array.from({ length: 3 }, () => ({
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            description: faker.lorem.sentence()
        }));

        const res = await supertest(server)
            .post('/products/bulk-create') // Adjust your route path if necessary (e.g. /products/bulk or /api/products/bulk)
            .send(productsToCreate);

        assert.strictEqual(res.status, 201);
        assert.strictEqual(Array.isArray(res.body), true);
        assert.strictEqual(res.body.length, 3);

        // Collect generated IDs for targeted cleanup
        createdIds = res.body.map(p => p._id);

        // Verify content fields match
        assert.strictEqual(res.body[0].name, productsToCreate[0].name);
        assert.strictEqual(res.body[1].price, productsToCreate[1].price);
    });
});