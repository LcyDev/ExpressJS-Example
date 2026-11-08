/**
 * @module documentManager
 * @description Module containing functions for interacting with a database using Mongoose.
 */

import mongoose, { Model, Document } from 'mongoose';
import errorHandler from '../utils/errorHandler.js';

/**
 * Retrieves a document from the database by its id.
 *
 * @param {Model} model The Mongoose model to use for the query.
 * @param {String} id The id of the document to retrieve.
 * @param {Express.Response} res The Express response object.
 *
 * @returns {Promise<Document|null>} A Promise that resolves to the document if found, or null if not found or an error occurs.
 */
const getDocById = async (model, id, res) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            errorHandler(res, new Error('Invalid Mongoose ObjectId'), null, 400);
            return null;
        }

        const doc = await model.findById(id);
        if (!doc) {
            errorHandler(res, new Error(`${model.modelName} with ID ${id} doesn't exist`), null, 404);
            return null;
        }
        return doc;
    } catch (error) {
        errorHandler(res, error, `Error getting ${model.modelName}`, null, 404);
        return null;
    }
};

/**
 * Updates a document in the database by its id.
 *
 * @param {Model} model The Mongoose model to use for the query.
 * @param {String} id The id of the document to update.
 * @param {Object} data The data to update the document with.
 * @param {Express.Response} res The Express response object.
 *
 * @returns {Promise<Document|null>} A Promise that resolves to the updated document if successful, or null if not found or an error occurs.
 */
const updateDocById = async (model, id, data, res) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            errorHandler(res, new Error('Invalid Mongoose ObjectId'), null, 400);
            return null;
        }

        // Added { runValidators: true } to ensure schema rules are enforced during updates
        const updatedDoc = await model.findByIdAndUpdate(id, data, { returnDocument: 'after', runValidators: true });
        if (!updatedDoc) {
            errorHandler(res, new Error(`${model.modelName} not found`), null, 404);
            return null;
        }
        return updatedDoc;
    } catch (error) {
        errorHandler(res, error, `Error updating ${model.modelName}`, null, 404);
        return null;
    }
};

/**
 * Deletes a document from the database by its id.
 *
 * @param {Model} model The Mongoose model to use for the query.
 * @param {String} id The id of the document to delete.
 * @param {Express.Response} res The Express response object.
 *
 * @returns {Promise<Document|null>} A Promise that resolves to the deleted document if successful, or null if not found or an error occurs.
 */
const deleteDocById = async (model, id, res) => {
    try {
        if (!mongoose.isValidObjectId(id)) {
            errorHandler(res, new Error('Invalid Mongoose ObjectId'), null, 400);
            return null;
        }

        // Replaced deprecated/removed findByIdAndRemove with findByIdAndDelete for Mongoose 9+
        const deletedDoc = await model.findByIdAndDelete(id);
        if (!deletedDoc) {
            errorHandler(res, new Error(`${model.modelName} not found`), null, 404);
            return null;
        }
        return deletedDoc;
    } catch (error) {
        errorHandler(res, error, `Error deleting ${model.modelName}`, null, 404);
        return null;
    }
};

/**
 * Exports the functions for managing documents.
 * @namespace
 */
const documentManager = {
    getDocById,
    updateDocById,
    deleteDocById
};

export default documentManager;