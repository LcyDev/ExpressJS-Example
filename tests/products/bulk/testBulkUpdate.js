import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Product from '../../../src/models/Product.js';
import server from '../../../src/server.js';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

describe('Products API - Bulk Update Tests', () => {
    let sampleProducts = [];

    beforeEach(async () => {
        await Product.deleteMany({});

        // Seed test products in the database
        sampleProducts = await Product.create([
            { name: faker.commerce.productName(), price: 10, description: faker.lorem.sentence() },
            { name: faker.commerce.productName(), price: 20, description: faker.lorem.sentence() }
        ]);
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    it('should update multiple products and return a 200 status', async () => {
        // Construct update map payload: { [id]: { fieldsToUpdate } }
        const updatesMap = {
            [sampleProducts[0]._id.toString()]: { name: 'Updated Product 1', price: 15 },
            [sampleProducts[1]._id.toString()]: { name: 'Updated Product 2', price: 25 }
        };

        const res = await supertest(server)
            .put('/products/bulk-update')
            .send(updatesMap);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.body, 'object');
        assert.ok(res.body.updatedProducts);
        assert.strictEqual(res.body.updatedProducts.length, 2);
    });

    it('should return a 400 error when an invalid payload format or empty update map is provided', async () => {
        const res = await supertest(server)
            .put('/products/bulk-update')
            .send({}); // Empty object / invalid map format

        assert.strictEqual(res.status, 400);
    });

    it('should handle non-existing product IDs gracefully and list them in notFoundIds', async () => {
        const fakeId = new Product()._id.toString(); // Generate a valid Mongoose-style ID that doesn't exist in DB
        const updatesMap = {
            [fakeId]: { name: 'Ghost Product', price: 99 }
        };

        const res = await supertest(server)
            .put('/products/bulk-update')
            .send(updatesMap);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.body.notFoundIds.length, 1);
        assert.strictEqual(res.body.notFoundIds[0], fakeId);
    });
});