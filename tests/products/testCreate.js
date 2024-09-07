const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const faker = require('faker');

chai.should();
chaiHttp.use(chaiHttp);

describe('Product Creation', () => {
    it('it should create a new product with an empty description and return a 201 status', (done) => {
        const productData = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: ''
        };

        chai.request(server)
            .post('/api/products')
            .send(productData)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('price');
                res.body.should.not.have.property('description');
                done();
            });
    });
});