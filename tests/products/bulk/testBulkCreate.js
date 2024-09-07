const productManager = require('./productManager');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const faker = require('faker');

chai.should();
chai.use(chaiHttp);

describe('Product Manager', () => {
  describe('bulkCreateProducts', () => {
    let req, res, next;

    beforeEach(() => {
      res = {
        status: sinon.spy(res, 'status'),
        json: sinon.spy(res, 'json'),
        send: sinon.spy(res, 'send')
      };
      next = sinon.spy();
      req = {
        body: []
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should create multiple new Product objects and return them', async () => {
      const productsToCreate = Array.from({ length: 3 }, () => ({
        name: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.lorem.sentence()
      }));

      const createdProducts = [
        {
          _id: '5f4e1d4b374b2b2b393d1234',
          name: 'Product 1',
          price: 99.99,
          description: 'Description 1'
        },
        {
          _id: '5f4e1d4b374b2b2b393d1235',
          name: 'Product 2',
          price: 199.99,
          description: 'Description 2'
        },
        {
          _id: '5f4e1d4b374b2b2b393d1236',
          name: 'Product 3',
          price: 299.99,
          description: 'Description 3'
        }
      ];

      sinon.stub(Product, 'create').resolves(createdProducts);

      await productManager.bulkCreateProducts(req, res, next);

      res.status.calledWith(201).should.be.true;
      res.json.calledWith(createdProducts).should.be.true;
      res.send.notCalled.should.be.true;
    });
  });
});