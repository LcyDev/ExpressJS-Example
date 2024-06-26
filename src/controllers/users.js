import User from '../models/User.js';
import errorHandler from '../utils/errorHandler.js';
import mongoose from 'mongoose';

async function getUsers(req, res) {
    console.log('(GET) Getting all users...');
    User.find()
    .then(users => {
        console.log(`(200) Found ${users.length} users`);
        res.status(200).json(users);
    })
    .catch(error => {
        errorHandler(res, error, 'Error fetching users');
    });
}

async function createUser(req, res) {
    console.log('(POST) Creating new user...', req.body);
    const { name, age, email } = req.body;
    const user = new User({ name, age, email });
    await user.save()
    .then(savedUser => {
        console.log(`(201) User created: ${savedUser.name}`);
        res.status(201).json(savedUser);
    })
    .catch(error => {
        errorHandler(res, error, 'Error creating user');
    });
}

async function createMultipleUsers(req, res) {
    console.log('(POST) Creating multiple users...', req.body);
    const usersToCreate = req.body;
    const createdUsers = usersToCreate.map(user => {
        return new User(user).save();
    });
    await Promise.all(createdUsers)
    .then(createdUsers => {
        console.log(`(201) ${createdUsers.length} users created`);
        res.status(201).json(createdUsers);
    })
    .catch(error => {
        errorHandler(res, error, 'Error creating multiple users');
    });
}

async function updateUser(req, res) {
    console.log('(PUT) Updating user...', req.body);
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
        return;
    }
    User.findByIdAndUpdate(id, req.body, { new: true })
    .then(user => {
        if (!user) {
            errorHandler(res, new Error('User not found'), undefined, 404);
            return;
        }
        console.log(`(200) User updated: ${user.name}`);
        res.status(200).json(user);
    })
    .catch(error => {
        errorHandler(res, error, 'Error updating user');
    });
}

async function updateMultipleUsers(req, res) {
    console.log('(PUT) Updating multiple users...', req.body);
    const usersToUpdate = req.body;
    const updates = usersToUpdate.map(user => {
        return User.findByIdAndUpdate(user.id, user, { new: true });
    });
    await Promise.all(updates)
    .then(updatedUsers => {
        console.log(`(200) ${updatedUsers.length} users updated`);
        res.status(200).json(updatedUsers);
    })
    .catch(error => {
        errorHandler(res, error, 'Error updating multiple users');
    });
}

async function deleteUser(req, res) {
    console.log('(DELETE) Deleting user...', req.params.id);
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
        errorHandler(res, new Error('Invalid ObjectId'), undefined, 400);
        return;
    }
    User.findByIdAndDelete(id)
    .then(deletedUser => {
        if (!deletedUser) {
            errorHandler(res, new Error('User not found'), undefined, 404);
            return;
        }
        console.log(`(200) User deleted: ${deletedUser.name}`);
        res.status(200).json({ message: 'Usuario eliminado' });
    })
    .catch(error => {
        errorHandler(res, error, 'Error deleting user');
    });
}

async function deleteAllUsers(req, res) {
    console.log('(DELETE) Deleting all users...');
    User.deleteMany({})
    .then(result => {
        console.log(`(200) ${result.deletedCount} users deleted`);
        res.status(200).json({ message: 'All users deleted' });
    })
    .catch(error => {
        errorHandler(res, error, 'Error deleting all users');
    });
}

export default { getUsers, createUser, createMultipleUsers, updateUser, updateMultipleUsers, deleteUser, deleteAllUsers };