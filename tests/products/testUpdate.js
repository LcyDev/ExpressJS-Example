import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import Product from '../../src/models/Product.js';
import server from '../../src/server.js';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

describe('Update Product Tests', () => {
    let sampleId;
    let fakeId;
    let updatedData;

    beforeEach(async () => {
        // Create a fresh product before each test
        const newProduct = new Product({
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            description: faker.lorem.sentence()
        });

        const saved = await newProduct.save();
        sampleId = saved._id.toString();

        // Generate a valid Mongoose ID that is NOT saved in the database for the 404 test
        fakeId = new Product()._id.toString();

        // Data to apply during updates
        updatedData = {
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price()),
            description: faker.lorem.sentence()
        };
    });

    afterEach(async () => {
        // Clean up ONLY the specific document we created for this test
        if (sampleId) {
            await Product.findByIdAndDelete(sampleId);
        }
    });

    it('should update an existing product and return it (200)', async () => {
        const res = await supertest(server)
            .put(`/products/id/${sampleId}`)
            .send(updatedData);

        assert.strictEqual(res.status, 200);
        assert.strictEqual(typeof res.body, 'object');
        assert.strictEqual(res.body.name, updatedData.name);
        assert.strictEqual(res.body.price, updatedData.price);
        assert.strictEqual(res.body.description, updatedData.description);
    });

    it('should return 404 when trying to update a product that does not exist', async () => {
        const res = await supertest(server)
            .put(`/products/id/${fakeId}`)
            .send(updatedData);

        assert.strictEqual(res.status, 404);
    });
});