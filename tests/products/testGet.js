import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { faker } from '@faker-js/faker';
import supertest from 'supertest';

import Product from '../../src/models/Product.js';
import server from '../../src/server.js';

describe('Products - GET Tests', () => {
  let sampleProduct;
  let sampleId;

  beforeEach(async () => {
    await Product.deleteMany({});

    sampleProduct = new Product({
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      description: faker.lorem.sentence(),
    });

    const savedProduct = await sampleProduct.save();
    sampleId = savedProduct._id.toString(); // Convertimos a string de forma explícita
  });

  it('it should get a single product by ID', async () => {
    const res = await supertest(server).get(`/products/id/${sampleId}`);

    console.log('Response:', res.body); // Log para depuración
    assert.strictEqual(res.status, 200);
    assert.strictEqual(typeof res.body, 'object');
    assert.strictEqual(res.body.name, sampleProduct.name);
    assert.strictEqual(res.body.price, sampleProduct.price);
    assert.ok(res.body.description);
  });

  it('it should return 404 if the product does not exist', async () => {
    const fakeId = new Product()._id.toString();
    const res = await supertest(server).get(`/products/id/${fakeId}`);

    assert.strictEqual(res.status, 404);
  });

  afterEach(async () => {
    // Clean up ONLY the specific test product we created, instead of wiping the whole collection
    if (sampleId) {
        await Product.findByIdAndDelete(sampleId);
    }  });
});