import mongoose from 'mongoose';

import generic from './generic.js';
import User from '../models/User.js';
import errorHandler from '../utils/errorHandler.js';

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

const bulkUpdateUsers = async (req, res) => {
    console.log('(PUT) Updating multiple users...', req.body);
    try {
        const usersToUpdate = req.body;
        // const updatedUsers = await Promise.all(usersToUpdate.map(users => generic.updateModelById(User, user.id, user, res)));
        const updatedUsers = await Promise.all(usersToUpdate.map(user => User.findByIdAndUpdate(user.id, user, { new: true })));
        res.status(200).json(updatedUsers);
        console.log(`(200) ${updatedUsers.length} users updated`);
    } catch (error) {
        errorHandler(res, error, 'Error updating multiple users');
    }
};

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

export default {
    getUser,
    getAllUsers,
    createUser, bulkCreateUsers,
    updateUser, bulkUpdateUsers,
    deleteUser, bulkDeleteUsers,
    deleteAllUsers
};