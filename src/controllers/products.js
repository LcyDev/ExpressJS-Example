/**
 * @module productManager
 * @description Module containing functions for managing products in the database.
 */
import generic from './generic.js';
import Product from '../models/Product.js';
import errorHandler from '../utils/errorHandler.js';

/**
 * Fetch all products from the database.
 * @returns {Promise<Product[]>} A promise that resolves to an array of Product objects.
 */
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

/**
 * Fetch a single product by ID from the database.
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Product>} A promise that resolves to a Product object.
 */
const getProduct = async (req, res) => {
    const id = req.params.id;
    console.log('(GET) Getting product...', id);
    try {
        const product = generic.getDocById(Product, id, res);
        res.status(200).json(product);
        console.log(`(200) Product found: ${product.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error getting product');
    }
};

/**
 * Create a new product in the database.
 * @param {Express.Request} req - The request object containing the product data.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<Product>} A promise that resolves to the created Product object.
 */
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

/**
 * Create multiple new products in the database.
 * @param {Express.Request} req - The request object containing an array of product data.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<Product[]>} A promise that resolves to an array of created Product objects.
 */
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

/**
 * Update an existing product in the database.
 * @param {string} id - The ID of the product to update.
 * @param {Express.Request} req - The request object containing the updated product data.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<Product>} A promise that resolves to the updated Product object.
 */
const updateProduct = async (req, res) => {
    const id = req.params.id;
    console.log('(PUT) Updating product...', id);
    console.log(req.body)
    try {
        const product = await generic.updateDocById(Product, id, req.body, res);
        res.status(200).json(product);
        console.log(`(200) Product updated: ${product.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error updating product');
    }
};


/**
 * Update multiple existing products in the database.
 * @param {Express.Request} req - The request object containing an array of product data with IDs.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<Product[]>} A promise that resolves to an array of updated Product objects.
 */
const bulkUpdateProducts = async (req, res) => {
    console.log('(PUT) Updating multiple products...', req.body);
    try {
        const productsToUpdate = req.body;
        // const updatedProducts = await Promise.all(productsToUpdate.map(product => generic.updateModelById(Product, product.id, product, res)));
        const updatedProducts = await Promise.all(productsToUpdate.map(product => Product.findByIdAndUpdate(product.id, product, { new: true })));
        res.status(200).json(updatedProducts);
        console.log(`(200) ${updatedProducts.length} products updated`);
    } catch (error) {
        errorHandler(res, error, 'Error updating multiple products');
    }
};

/**
 * Delete a product from the database by ID.
 * @param {string} id - The ID of the product to delete.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the product is deleted.
 */
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    console.log('(DELETE) Deleting product...', id);
    try {
        const deletedProduct = await generic.deleteDocById(Product, id, res);
        if (deletedProduct) {
            res.status(200).json({ message: `Product deleted: ${deletedProduct.name}` });
            console.log(`(200) Product deleted: ${deletedProduct.name}`);
        }
    } catch (error) {
        errorHandler(res, error, 'Error deleting product');
    }
};

/**
 * Delete multiple products from the database by IDs.
 * @param {Express.Request} req - The request object containing an array of product IDs.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the products are deleted.
 */
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

/**
 * Delete all products from the database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when all products are deleted.
 */
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

/**
 * Exports the functions for managing products.
 * @namespace
 */
const productManager = {
    getAllProducts,
    getProduct,
    createProduct,
    bulkCreateProducts,
    updateProduct,
    bulkUpdateProducts,
    deleteProduct,
    bulkDeleteProducts,
    deleteAllProducts
};
export default productManager;
