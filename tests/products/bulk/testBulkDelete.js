const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const faker = require('faker');

chai.should();
chaiHttp.use(chai);

describe('Bulk Delete Products', () => {
    let server;

    before(async () => {
        server = app.listen(3000);
    });

    after(async () => {
        server.close();
    });

    it('should return an error message when no product IDs are provided', (done) => {
        const productIds = [];
        chai.request(server)
        .delete('/products/bulk-delete')
        .send({ productIds })
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('No product IDs provided');
            done();
        });
    });

    it('should return an error message when an error occurs during the deletion process', (done) => {
        const productIds = [faker.datatype.uuid()];
        const error = new Error('Simulated error during deletion');
        sinon.stub(Product, 'deleteMany').resolves({ deletedCount: 0 });
        sinon.stub(Product, 'deleteMany').throws(error);

        chai.request(server)
        .delete('/products/bulk-delete')
        .send({ productIds })
        .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql('Error deleting multiple products');
            done();
        });

        Product.deleteMany.restore();
    });
});


const productManager = require('./productManager');
const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { expect } = chai;

chai.use(chaiHttp);

describe('Bulk Delete Products', () => {
    let req, res, next;

    beforeEach(() => {
        res = {
            status: sinon.spy(res, 'status'),
            json: sinon.spy(res, 'json'),
            send: sinon.spy(res, 'send')
        };
        next = sinon.spy();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return an error message when provided an array of non-string product IDs', async () => {
        req = {
            body: { ids: [1, 2, 3] }
        };

        await productManager.bulkDeleteProducts(req, res, next);

        expect(res.status.calledOnceWith(400)).to.be.true;
        expect(res.json.calledOnceWith({ message: 'No product IDs provided' })).to.be.true;
        expect(next.called).to.be.false;
    });
});