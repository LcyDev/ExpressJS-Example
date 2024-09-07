const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const { deleteProduct } = require('../src/productManager');

chai.should();
chaiHttp.use(chai);

describe('deleteProduct InvalidID', () => {
    it('should return 400 when request or response object is invalid', (done) => {
        const invalidReq = {};
        const invalidRes = {};

        deleteProduct(invalidReq, invalidRes)
            .then(() => {
                done(new Error('Expected 400 status code'));
            })
            .catch((err) => {
                err.response.should.have.status(400);
                done();
            });
    });
});

describe('deleteProduct ValidID', () => {
    it('should return 200 when request and response objects are valid', (done) => {
        const validReq = { params: { id: '5e8365757637456ab7a64264561770786c736c61732431' } };
        const validRes = {};

        deleteProduct(validReq, validRes)
            .then((res) => {
                res.should.have.status(200);
                done();
            })
            .catch((err) => {
                done(new Error('Expected 200 status code'));
            });
    });
});

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

describe('deleteProduct', () => {
    beforeEach((done) => {
        // Create a product before each test
        const product = new Product({ name: 'Test Product', price: 10, description: 'This is a test product' });
        product.save().then(() => done());
    });

    it('should delete a product from the database by ID and return a message confirming the deletion', (done) => {
        chai.request(server)
            .delete('/products/5e848c0725daf3fb6d2226daf3fb6d22') // Replace with the actual ID of the created product
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Product deleted: Test Product');
                done();
            });
    });

    afterEach((done) => {
        // Clean up after each test
        Product.deleteMany({}).then(() => done());
    });
});