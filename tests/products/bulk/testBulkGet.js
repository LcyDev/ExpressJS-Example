
const productManager = require('./productManager');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Product Manager', () => {
  describe('getAllProducts', () => {
    let req, res, next;

    beforeEach(() => {
      res = {
        status: sinon.spy(res, 'status'),
        json: sinon.spy(res, 'json'),
      };
      next = sinon.spy();
      req = {
        params: {},
      };
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should return an array of Product objects when called without error', async () => {
      // Arrange
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 10 },
        { id: '2', name: 'Product 2', price: 20 },
      ];
      sinon.stub(Product, 'find').resolves(mockProducts);

      // Act
      await productManager.getAllProducts(req, res, next);

      // Assert
      res.status.calledWith(200).should.be.true;
      res.json.calledWith(mockProducts).should.be.true;
      next.called.should.be.false;
    });
  });
});