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

        // (Returning an empty array [] with 200 OK is standard for REST APIs,
        if (!products || products.length === 0) {
            console.log('(200) No products found');
            return res.status(200).json([]);
        }
        console.log(`Found ${products.length} products`);

        return res.status(200).json(products);
    } catch (error) {
        errorHandler(res, error, 'Error getting all products');
    }
};

/**
 * Fetch a single product by ID from the database.
 * @param {string} req.params.id The ID of the product to fetch.
 * @returns {Promise<Product>} A promise that resolves to a Product object.
 */
const getProduct = async (req, res) => {
    const id = req.params.id;
    console.log('(GET) Getting product...', id);
    try {
        const product = await generic.getDocById(Product, id, res);

        // If generic.getDocById already handled the 404 and sent the response, stop
        if (!product) {
            return;
        }

        res.status(200).json(product);
        console.log(`(200) Product found: ${product.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error getting product');
    }
};

/**
 * Create a new product in the database.
 * @param {Express.Request} req The request object containing the product data.
 * @param {Express.Response} res The response object.
 * @returns {Promise<Product>} A promise that resolves to the created Product object.
 */
const createProduct = async (req, res) => {
    console.log('(POST) Creating new product...', req.body);
    try {
        // Guard clause: Ensure body exists and required fields are provided
        if (!req.body || !req.body.name || req.body.price === undefined) {
            errorHandler(res, new Error('Missing required product fields (name, price, description)'), null, 400);
            return;
        }

        const { name, price, description } = req.body;
        const newProduct = new Product({ name, price, description });
        const savedProduct = await newProduct.save();

        console.log(`(201) Product created: ${savedProduct.name}`);
        return res.status(201).json(savedProduct);
    } catch (error) {
        errorHandler(res, error, 'Error creating product');
    }
};

/**
 * Create multiple new products in the database.
 * @param {Express.Request} req The request object containing an array of product data.
 * @param {Express.Response} res The response object.
 * @returns {Promise<Product[]>} A promise that resolves to an array of created Product objects.
 */
const bulkCreateProducts = async (req, res) => {
    console.log('(POST) Creating multiple products...', req.body);
    try {
        const productsToCreate = req.body;

        // Guard clause: Ensure body is a valid, non-empty array to prevent map crashes
        if (!Array.isArray(productsToCreate) || productsToCreate.length === 0) {
            errorHandler(res, new Error('An array of products is expected'), null, 400);
            return;
        }

        const createdProducts = await Promise.all(
            productsToCreate.map(product => new Product(product).save())
        );

        console.log(`(201) ${createdProducts.length} products created`);
        return res.status(201).json(createdProducts);
    } catch (error) {
        errorHandler(res, error, 'Error creating multiple products');
    }
};
/**
 * Update an existing product in the database.
 * @param {string} id The ID of the product to update.
 * @param {Express.Request} req The request object containing the updated product data.
 * @param {Express.Response} res The response object.
 * @returns {Promise<Product>} A promise that resolves to the updated Product object.
 */
const updateProduct = async (req, res) => {
    const id = req.params.id;
    console.log('(PUT) Updating product...', id);
    console.log(req.body);
    try {
        const product = await generic.updateDocById(Product, id, req.body, res);

        // If generic.getDocById already handled the 404 and sent the response, stop
        if (!product) {
            return;
        }

        console.log(`(200) Product updated: ${product.name}`);
        return res.status(200).json(product);
    } catch (error) {
        errorHandler(res, error, 'Error updating product');
    }
};

/**
 * Update multiple existing products in the database using an object map of IDs.
 * @param {Express.Request} req The request object containing a dictionary mapping IDs to update data.
 * @param {Express.Response} res The response object.
 * @returns {Promise<Object>} A promise that resolves to an object detailing success and 404 errors.
 */
const bulkUpdateProducts = async (req, res) => {
    console.log('(PUT) Updating multiple products...', req.body);
    try {
        const updatesMap = req.body;

        // 1. Guard clause: Check if body is empty, not an object, or null
        if (!updatesMap || typeof updatesMap !== 'object' || Array.isArray(updatesMap) || Object.keys(updatesMap).length === 0) {
            errorHandler(res, new Error('Provide an object map of product updates, e.g., { "id": { property: value } }'), null, 400);
            return;
        }

        const ids = Object.keys(updatesMap);
        const results = {
            updated: [],
            notFound: []
        };

        // 2. Process updates concurrently for each ID in the map
        await Promise.all(
            ids.map(async (id) => {
                const updateData = updatesMap[id];

                // Find and update the document, returning the new version
                const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { returnDocument: 'after', runValidators: true });

                if (!updatedProduct) {
                    results.notFound.push(id);
                } else {
                    results.updated.push(updatedProduct);
                }
            })
        );

        // 3. Log results
        console.log(`(200) Bulk update complete: ${results.updated.length} updated, ${results.notFound.length} not found.`);

        // 4. Send response (you can choose to return 200 with details, or partial content status)
        return res.status(200).json({
            message: `Processed bulk update. Updated: ${results.updated.length}, Not Found: ${results.notFound.length}`,
            updatedProducts: results.updated,
            notFoundIds: results.notFound
        });

    } catch (error) {
        errorHandler(res, error, 'Error updating multiple products');
    }
};

/**
 * Delete a product from the database by ID.
 * @param {string} req.params.id The ID of the product to delete.
 * @param {Express.Request} req The request object.
 * @param {Express.Response} res The response object.
 * @returns {Promise<void>} A promise that resolves when the product is deleted.
 */
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    console.log('(DELETE) Deleting product...', id);
    try {
        const deletedProduct = await generic.deleteDocById(Product, id, res);

        // If generic.getDocById already handled the 404 and sent the response, stop
        if (!deletedProduct) {
            return;
        }

        console.log(`(200) Product deleted: ${deletedProduct.name}`);
        return res.status(200).json({ message: `Product deleted: ${deletedProduct.name}` });
    } catch (error) {
        errorHandler(res, error, 'Error deleting product');
    }
};

/**
 * Delete multiple products from the database by IDs.
 * @param {Express.Request} req The request object containing an array of product IDs.
 * @param {Express.Response} res The response object.
 * @returns {Promise<void>} A promise that resolves when the products are deleted.
 */
const bulkDeleteProducts = async (req, res) => {
    console.log('(DELETE) Deleting multiple products...', req.body);
    try {
        // Handle both direct array or wrapped object payloads ({ productIds: [...] } or { ids: [...] })
        const ids = Array.isArray(req.body)
            ? req.body
            : (req.body?.productIds || req.body?.ids);

        if (!Array.isArray(ids) || ids.length === 0) {
            errorHandler(res, new Error('An array of product IDs is expected'), null, 400);
            return;
        }

        const result = await Product.deleteMany({ _id: { $in: ids } });

        console.log(`(200) ${result.deletedCount} products deleted`);
        return res.status(200).json({ message: `${result.deletedCount} products deleted` });
    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            errorHandler(res, new Error('One or more provided IDs are invalid Mongoose ObjectIds'), null, 400);
            return;
        }
        errorHandler(res, error, 'Error deleting multiple products');
    }
};

/**
 * Delete all products from the database.
 * @param {Express.Request} req The request object.
 * @param {Express.Response} res The response object.
 * @returns {Promise<void>} A promise that resolves when all products are deleted.
 */
const deleteAllProducts = async (req, res) => {
    console.log('(DELETE) Deleting all products...');
    try {
        const result = await Product.deleteMany({});

        console.log(`(200) ${result.deletedCount} products deleted`);
        return res.status(200).json({ message: `Deleted ${result.deletedCount} products` });
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
