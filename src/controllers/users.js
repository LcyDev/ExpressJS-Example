/**
 * @module userManager
 * @description Module containing functions for managing users in the database.
 */
import generic from './generic.js';
import User from '../models/User.js';
import errorHandler from '../utils/errorHandler.js';

/**
 * Fetch all users from the database.
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
const getAllUsers = async (req, res) => {
    console.log('(GET) Getting all users...');
    try {
        const users = await User.find();
        res.status(200).json(users);
        console.log(`(200) Found ${users.length} users`);
    } catch (error) {
        errorHandler(res, error, 'Error fetching users');
    }
};

/**
 * Fetch a single user by ID from the database.
 * @param {string} id - The ID of the user to fetch.
 * @returns {Promise<User>} A promise that resolves to a User object.
 */
const getUser = async (req, res) => {
    const id = req.params.id;
    console.log('(GET) Getting user...', id);
    try {
        const user = generic.getDocById(User, id, res);
        res.status(200).json(user);
        console.log(`(200) User found: ${user.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error getting user');
    }
};

/**
 * Create a new user in the database.
 * @param {Express.Request} req - The request object containing the user data.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<User>} A promise that resolves to the created User object.
 */
const createUser = async (req, res) => {
    console.log('(POST) Creating new user...', req.body);
    try {
        const { name, age, email } = req.body;
        const newUser = new User({ name, age, email });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        console.log(`(201) User created: ${savedUser.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error creating user');
    }
};

/**
 * Create multiple new users in the database.
 * @param {Express.Request} req - The request object containing an array of user data.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<User[]>} A promise that resolves to an array of created User objects.
 */
const bulkCreateUsers = async (req, res) => {
    console.log('(POST) Creating multiple users...', req.body);
    try {
        const usersToCreate = req.body;
        const createdUsers = await Promise.all(usersToCreate.map(user => new User(user).save()));
        res.status(201).json(createdUsers);
        console.log(`(201) ${createdUsers.length} users created`);
    } catch (error) {
        errorHandler(res, error, 'Error creating multiple users');
    }
};

/**
 * Update an existing user in the database.
 * @param {string} id - The ID of the user to update.
 * @param {Express.Request} req - The request object containing the updated user data.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<User>} A promise that resolves to the updated User object.
 */
const updateUser = async (req, res) => {
    const id = req.params.id;
    console.log('(PUT) Updating user...', id);
    console.log(req.body)
    try {
        const user = await generic.updateDocById(User, id, req.body, res);
        res.status(200).json(user);
        console.log(`(200) User updated: ${user.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error updating user');
    }
};

/**
 * Update multiple existing users in the database.
 * @param {Express.Request} req - The request object containing an array of user data with IDs.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<User[]>} A promise that resolves to an array of updated User objects.
 */
const bulkUpdateUsers = async (req, res) => {
    console.log('(PUT) Updating multiple users...', req.body);
    try {
        const usersToUpdate = req.body;
        //const updatedUsers = await Promise.all(usersToUpdate.map(users => generic.updateDocById(User, user.id, user, res)));
        const updatedUsers = await Promise.all(usersToUpdate.map(user => User.findByIdAndUpdate(user.id, user, { new: true })));
        res.status(200).json(updatedUsers);
        console.log(`(200) ${updatedUsers.length} users updated`);
    } catch (error) {
        errorHandler(res, error, 'Error updating multiple users');
    }
};

/**
 * Delete a user from the database by ID.
 * @param {string} id - The ID of the user to delete.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 */
const deleteUser = async (req, res) => {
    const id = req.params.id;
    console.log('(DELETE) Deleting user...', id);
    try {
        const deletedUser = await generic.deleteDocById(User, id, res);
        if (deletedUser) {
            const identifier = deletedUser.name || id;
            res.status(200).json({ message: `User deleted: ${identifier}` });
            console.log(`(200) User deleted: ${identifier}`);
        }
    } catch (error) {
        errorHandler(res, error, 'Error deleting user');
    }
};

/**
 * Delete multiple users from the database by IDs.
 * @param {Express.Request} req - The request object containing an array of user IDs.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when the users are deleted.
 */
const bulkDeleteUsers = async (req, res) => {
    console.log('(DELETE) Deleting multiple users...', req.body);
    try {
        const ids = req.body;
        if (!ids || !ids.length) {
            errorHandler(res, new Error('No user IDs provided'), undefined, 400);
            return;
        }
        const result = await User.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${result.deletedCount} users deleted` });
        console.log(`(200) ${result.deletedCount} users deleted`);
    } catch (error) {
        errorHandler(res, error, 'Error deleting multiple users');
    }
};

/**
 * Delete all users from the database.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>} A promise that resolves when all users are deleted.
 */
const deleteAllUsers = async (req, res) => {
    console.log('(DELETE) Deleting all users...');
    try {
        const result = await User.deleteMany({});
        res.status(200).json({ message: `Deleted ${result.deletedCount} users` });
        console.log(`(200) ${result.deletedCount} users deleted`);
    } catch (error) {
        errorHandler(res, error, 'Error deleting all users');
    }
};

/**
 * Exports the functions for managing users.
 * @namespace
 */
const userManager = {
    getAllUsers,
    getUser,
    createUser,
    bulkCreateUsers,
    updateUser,
    bulkUpdateUsers,
    deleteUser,
    bulkDeleteUsers,
    deleteAllUsers
};

export default userManager;
