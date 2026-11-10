import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Product from '../../src/models/Product.js';
import server from '../../src/server.js';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

describe('Delete Product Tests', () => {
    let sampleId;
    let fakeId;
    let sampleProductName;

    beforeEach(async () => {
        sampleProductName = faker.commerce.productName();

        // Create a fresh product before each test
        const newProduct = new Product({
            name: sampleProductName,
            price: Number(faker.commerce.price()),
            description: faker.lorem.sentence()
        });

        const saved = await newProduct.save();
        sampleId = saved._id.toString();

        // Generate a valid Mongoose ID format that does not exist in the database
        fakeId = new Product()._id.toString();
    });

    afterEach(async () => {
        // Clean up ONLY the specific document created for the test, avoiding global wipes
        if (sampleId) {
            await Product.findByIdAndDelete(sampleId);
        }
    });

    it('should delete an existing product by ID and return confirmation (200)', async () => {
        const res = await supertest(server).delete(`/products/id/${sampleId}`);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.body, 'object');
        assert.ok(res.body.message);
        assert.strictEqual(res.body.message, `Product deleted: ${sampleProductName}`);
    });

    it('should return 404 when trying to delete a product that does not exist', async () => {
        const res = await supertest(server).delete(`/products/id/${fakeId}`);

        assert.strictEqual(res.status, 404);
    });

    it('should return 400 when an invalid Mongoose ObjectId is provided', async () => {
        const res = await supertest(server).delete('/products/id/invalid-id-format-123');

        assert.strictEqual(res.status, 400);
    });
});