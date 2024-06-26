import User from '../models/User.js';
import errorHandler from '../utils/errorHandler.js';
import mongoose from 'mongoose';

const getUsers = async (req, res) => {
    console.log('(GET) Getting all users...');
    try {
        const users = await User.find();
        res.status(200).json(users);
        console.log(`(200) Found ${users.length} users`);
    } catch (error) {
        errorHandler(res, error, 'Error fetching users');
    }
};

const createUser = async (req, res) => {
    console.log('(POST) Creating new user...', req.body);
    try {
        const { name, age, email } = req.body;
        const user = new User({ name, age, email });
        const savedUser = await user.save();
        res.status(201).json(savedUser);
        console.log(`(201) User created: ${savedUser.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error creating user');
    }
};

const createMultipleUsers = async (req, res) => {
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
    console.log('(PUT) Updating user...', req.body);
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
            return;
        }
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!user) {
            errorHandler(res, new Error('User not found'), undefined, 404);
            return;
        }
        res.status(200).json(user);
        console.log(`(200) User updated: ${user.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error updating user');
    }
};

const updateMultipleUsers = async (req, res) => {
    console.log('(PUT) Updating multiple users...', req.body);
    try {
        const usersToUpdate = req.body;
        const updatedUsers = await Promise.all(usersToUpdate.map(user => User.findByIdAndUpdate(user.id, user, { new: true })));
        res.status(200).json(updatedUsers);
        console.log(`(200) ${updatedUsers.length} users updated`);
    } catch (error) {
        errorHandler(res, error, 'Error updating multiple users');
    }
};

const deleteUser = async (req, res) => {
    console.log('(DELETE) Deleting user...', req.params.id);
    try {
        const id = req.params.id;
        if (!mongoose.isValidObjectId(id)) {
            errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
            return;
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            errorHandler(res, new Error('User not found'), undefined, 404);
            return;
        }
        res.status(200).json({ message: 'User deleted' });
        console.log(`(200) User deleted: ${deletedUser.name}`);
    } catch (error) {
        errorHandler(res, error, 'Error deleting user');
    }
};

const deleteMultipleUsers = async (req, res) => {
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
    getUsers,
    createUser,createMultipleUsers,
    updateUser, updateMultipleUsers,
    deleteUser, deleteMultipleUsers,
    deleteAllUsers
};