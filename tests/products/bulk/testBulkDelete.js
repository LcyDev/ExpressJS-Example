import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Product from '../../../src/models/Product.js';
import server from '../../../src/server.js';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

describe('Products API - Bulk Delete Tests', () => {
    let sampleProducts = [];

    beforeEach(async () => {
        await Product.deleteMany({});

        // Seed test products in the database for valid deletion cases
        sampleProducts = await Product.create([
            { name: faker.commerce.productName(), price: 10, description: faker.lorem.sentence() },
            { name: faker.commerce.productName(), price: 20, description: faker.lorem.sentence() }
        ]);
    });

    afterEach(async () => {
        await Product.deleteMany({});
    });

    it('should return a 400 status when no product IDs or an empty array are provided', async () => {
        const res = await supertest(server)
            .delete('/products/bulk-delete')
            .send({ productIds: [] });

        assert.strictEqual(res.status, 400);
    });

    it('should successfully delete multiple products and return a 200 status when valid IDs are provided', async () => {
        const idsToDelete = sampleProducts.map(p => p._id.toString());

        const res = await supertest(server)
            .delete('/products/bulk-delete')
            .send({ productIds: idsToDelete });

        assert.strictEqual(res.status, 200);

        const remainingCount = await Product.countDocuments({ _id: { $in: idsToDelete } });
        assert.strictEqual(remainingCount, 0);
    });

    it('should return 400 when invalid non-string or malformed IDs are provided', async () => {
        const res = await supertest(server)
            .delete('/products/bulk-delete')
            .send({ productIds: [123, 456] }); // Invalid types

        assert.strictEqual(res.status, 400);
    });
});