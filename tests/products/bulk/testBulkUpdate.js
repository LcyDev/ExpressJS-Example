const productManager = require('./productManager');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const faker = require('faker');

chai.use(chaiHttp);
const { expect } = chai;

describe('Bulk Update Products', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should update multiple products', async () => {
    const updatedProducts = [
      { _id: faker.datatype.uuid(), name: 'Product 1', price: 10, description: 'Description 1' },
      { _id: faker.datatype.uuid(), name: 'Product 2', price: 20, description: 'Description 2' }
    ];

    sandbox.stub(Product, 'findByIdAndUpdate').resolves(updatedProducts);

    const res = await chai.request(app).put('/products/bulk-update').send(updatedProducts);

    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal(updatedProducts);
  });

  it('should return error when no product IDs provided', async () => {
    const res = await chai.request(app).put('/products/bulk-update').send([]);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('message', 'No product IDs provided');
  });

  it('should update all fields of a product', async () => {
    const updatedProduct = {
      _id: faker.datatype.uuid(),
      name: 'Updated Product',
      price: 30,
      description: 'Updated Description'
    };

    sandbox.stub(Product, 'findByIdAndUpdate').resolves([updatedProduct]);

    const res = await chai.request(app).put('/products/bulk-update').send([updatedProduct]);

    expect(res).to.have.status(200);
    expect(res.body).to.deep.equal([updatedProduct]);
  });

  it('should return error when updating a non-existing product', async () => {
    const nonExistingId = faker.datatype.uuid();
    const updatedProduct = { _id: nonExistingId, name: 'Updated Product', price: 30, description: 'Updated Description' };

    sandbox.stub(Product, 'findByIdAndUpdate').rejects(new Error('Product not found'));

    const res = await chai.request(app).put('/products/bulk-update').send([updatedProduct]);

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('message', 'Product not found');
  });
});