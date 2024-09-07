const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const faker = require('faker');

chai.should();
chaiHttp.use(chaiHttp);

describe('Products', () => {
  let productId;

  beforeEach(async () => {
    const newProduct = new Product({
      name: faker.commerce.productName(),
      price: faker.commerce.price(),
      description: faker.lorem.sentence(),
    });
    const savedProduct = await newProduct.save();
    productId = savedProduct._id;
  });

  it('it should get a single product by ID', (done) => {
    chai
      .request(server)
      .get(`/products/${productId}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('name');
        res.body.should.have.property('price');
        res.body.should.have.property('description');
        done();
      });
  });

  afterEach(async () => {
    await Product.deleteMany({});
  });
});