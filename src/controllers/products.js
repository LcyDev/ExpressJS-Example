import Product from '../models/Product.js';
import errorHandler from '../utils/errorHandler.js';
import mongoose from 'mongoose';

async function getProducts(req, res) {
    console.log('(GET) Getting all products...');
    Product.find()
    .then(products => {
        console.log(`Found ${products.length} products`);
        res.status(200).json(products);
    })
    .catch(error => {
        errorHandler(res, error, 'Error fetching products');
    });
}

async function createProduct(req, res) {
    console.log('(POST) Creating new product...', req.body);
    const { nombre, precio, descripcion } = req.body;
    const newProduct = new Product({ nombre, precio, descripcion });
    await newProduct.save()
    .then(savedProduct => {
        console.log(`(201) Product created: ${savedProduct.nombre}`);
        res.status(201).json(savedProduct);
    })
    .catch(error => {
        errorHandler(res, error, 'Error creating product');
    });
}

async function createMultipleProducts(req, res) {
    console.log('(POST) Creating multiple products...', req.body);
    const productsToCreate = req.body;
    const createdProducts = productsToCreate.map(product => {
        return new Product(product).save();
    });
    await Promise.all(createdProducts)
    .then(createdProducts => {
        console.log(`(201) ${createdProducts.length} products created`);
        res.status(201).json(createdProducts);
    })
    .catch(error => {
        errorHandler(res, error, 'Error creating multiple products');
    });
}

async function updateProduct(req, res) {
    console.log('(PUT) Updating product...', req.body);
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
        return;
    }
    Product.findByIdAndUpdate(id, req.body, { new: true })
    .then(product => {
        if (!product) {
            errorHandler(res, new Error('Product not found'), undefined, 404);
            return;
        }
        console.log(`(200) Product updated: ${product.nombre}`);
        res.status(200).json(product);
    })
    .catch(error => {
        errorHandler(res, error, 'Error updating product');
    });
}

async function updateMultipleProducts(req, res) {
    console.log('(PUT) Updating multiple products...', req.body);
    const productsToUpdate = req.body;
    const updates = productsToUpdate.map(product => {
        return Product.findByIdAndUpdate(product.id, product, { new: true });
    });
    await Promise.all(updates)
    .then(updatedProducts => {
        console.log(`(200) ${updatedProducts.length} products updated`);
        res.status(200).json(updatedProducts);
    })
    .catch(error => {
        errorHandler(res, error, 'Error updating multiple products');
    });
}

async function deleteProduct(req, res) {
    console.log('(DELETE) Deleting product...', req.params.id);
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
        return;
    }
    Product.findByIdAndDelete(id)
    .then(deletedProduct => {
        if (!deletedProduct) {
            errorHandler(res, new Error('Product not found'), undefined, 404);
            return;
        }
        console.log(`(200) Product deleted: ${deletedProduct.nombre}`);
        res.status(200).json({ message: `Producto eliminado: ${deletedProduct.nombre}` });
    })
    .catch(error => {
        errorHandler(res, error, 'Error deleting product');
    });
}

async function deleteAllProducts(req, res) {
    console.log('(DELETE) Deleting all products...');
    Product.deleteMany({})
    .then(result => {
        console.log(`(200) ${result.deletedCount} products deleted`);
        res.status(200).json({ message: `All products deleted` });
    })
    .catch(error => {
        errorHandler(res, error, 'Error deleting all products');
    });
}

export default { getProducts, createProduct, createMultipleProducts, updateProduct, updateMultipleProducts, deleteProduct, deleteAllProducts };