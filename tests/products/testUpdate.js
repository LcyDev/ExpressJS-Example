const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const faker = require('faker');

describe('Update Product', () => {
    let productId;
    let updatedProduct;

    before(async () => {
        const newProduct = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.lorem.sentence()
        };

        const res = await chai.request(server).post('/products').send(newProduct);
        chai.expect(res).to.have.status(201);
        chai.expect(res.body).to.be.a('object');
        productId = res.body._id;

        updatedProduct = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.lorem.sentence()
        };
    });

    it('should update an existing product and return it', async () => {
        const res = await chai.request(server).put(`/products/${productId}`).send(updatedProduct);
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.be.a('object');
        chai.expect(res.body.name).to.equal(updatedProduct.name);
        chai.expect(res.body.price).to.equal(updatedProduct.price);
        chai.expect(res.body.description).to.equal(updatedProduct.description);
    });

    after(async () => {
        await chai.request(server).delete(`/products/${productId}`);
    });
});

