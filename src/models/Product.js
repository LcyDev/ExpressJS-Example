/**
 * @module Product
 * @description This module contains the schema and model for a product.
 */

import mongoose, { Schema } from 'mongoose';

/**
 * @typedef {Object} ProductSchema
 * @property {string} name - The name of the product.
 * @property {number} price - The price of the product.
 * @property {string} description - The description of the product.
 */

/**
 * @typedef {Object} Product
 * @property {string} _id - The unique identifier for the product.
 * @property {string} name - The name of the product.
 * @property {number} price - The price of the product.
 * @property {string} description - The description of the product.
 */

/**
 * @function createProductSchema
 * @description Creates a schema for a product.
 * @returns {ProductSchema} The schema for a product.
 */
const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    description: {
        type: String,
        trim: true,
    },
});

/*
productSchema.set('toJSON', {
    virtuals: true, // Create id field
    versionKey: false, // Prevent the _v field
    transform: (doc, ret) => {
        delete ret._id; // Delete the _id field
    },
});
*/

/**
 * @type {Product}
 */
const Product = mongoose.model('Product', productSchema);

export default Product;