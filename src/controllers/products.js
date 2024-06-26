import mongoose from 'mongoose';

import Product from '../models/Product.js';
import errorHandler from '../utils/errorHandler.js';

const getAllProducts = async (req, res) => {
    console.log('(GET) Getting all products...');
    try {
        const products = await Product.find();
        res.status(200).json(products);
        console.log(`Found ${products.length} products`);
    } catch (error) {
        errorHandler(res, error, 'Error fetching products');
    }
};

const getProduct = async (req, res) => {
    console.log('(GET) Getting product...', req.params.id);
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            errorHandler(res, new Error('Product not found'), undefined, 404);
            return;
        }
        res.status(200).json(product);
        console.log(`(200) Product found: ${product.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error getting product');
    }
};

const createProduct = async (req, res) => {
    console.log('(POST) Creating new product...', req.body);
    try {
        const { name, price, description } = req.body;
        const newProduct = new Product({ name, price, description });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
        console.log(`(201) Product created: ${savedProduct.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error creating product');
    }
};

const bulkCreateProducts = async (req, res) => {
    console.log('(POST) Creating multiple products...', req.body);
    try {
        const productsToCreate = req.body;
        const createdProducts = await Promise.all(productsToCreate.map(product => new Product(product).save()));
        res.status(201).json(createdProducts);
        console.log(`(201) ${createdProducts.length} products created`);
    } catch (error) {
        errorHandler(res, error, 'Error creating multiple products');
    }
};

const updateProduct = async (req, res) => {
    console.log('(PUT) Updating product...', req.params.id);
    console.log(req.body)
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
            return;
        }
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!product) {
            errorHandler(res, new Error('Product not found'), undefined, 404);
            return;
        }
        res.status(200).json(product);
        console.log(`(200) Product updated: ${product.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error updating product');
    }
};

const bulkUpdateProducts = async (req, res) => {
    console.log('(PUT) Updating multiple products...', req.body);
    try {
        const productsToUpdate = req.body;
        const updatedProducts = await Promise.all(productsToUpdate.map(product => Product.findByIdAndUpdate(product.id, product, { new: true })));
        res.status(200).json(updatedProducts);
        console.log(`(200) ${updatedProducts.length} products updated`);
    } catch (error) {
        errorHandler(res, error, 'Error updating multiple products');
    }
};

const deleteProduct = async (req, res) => {
    console.log('(DELETE) Deleting product...', req.params.id);
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
            return;
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            errorHandler(res, new Error('Product not found'), undefined, 404);
            return;
        }
        res.status(200).json({ message: `Product deleted: ${deletedProduct.name}` });
        console.log(`(200) Product deleted: ${deletedProduct.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error deleting product');
    }
};

const bulkDeleteProducts = async (req, res) => {
    console.log('(DELETE) Deleting multiple products...', req.body);
    try {
        const ids = req.body;
        if (!ids || !ids.length) {
            errorHandler(res, new Error('No product IDs provided'), undefined, 400);
            return;
        }
        const result = await Product.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${result.deletedCount} products deleted` });
        console.log(`(200) ${result.deletedCount} products deleted`);
    } catch (error) {
        errorHandler(res, error, 'Error deleting multiple products');
    }
};

const deleteAllProducts = async (req, res) => {
    console.log('(DELETE) Deleting multiple products...', req.body);
    try {
        const result = await Product.deleteMany({});
        res.status(200).json({ message: `Deleted ${result.deletedCount} products` });
        console.log(`(200) ${result.deletedCount} products deleted`);
    } catch (error) {
        errorHandler(res, error, 'Error deleting all products');
    }
};

export default {
    getProduct,
    getAllProducts,
    createProduct, bulkCreateProducts,
    updateProduct, bulkUpdateProducts,
    deleteProduct, bulkDeleteProducts,
    deleteAllProducts
};