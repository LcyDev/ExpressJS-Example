/**
 * @module User
 * @description This module contains the schema and model for a user.
 */

import mongoose, { Schema, Model } from 'mongoose';

/**
 * @typedef {Schema} UserSchema
 * @property {string} name - The user's name.
 * @property {number} age - The user's age.
 * @property {string} email - The user's email.
 */

/**
 * @typedef {Model} User
 * @property {string} _id - The user's unique identifier.
 * @property {string} name - The user's name.
 * @property {number} age - The user's age.
 * @property {string} email - The user's email.
 */

/**
 * @type {UserSchema}
 */
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: 0,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: {
            validator: (email) => {
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(email);
            },
            message: 'Invalid email format',
        },
    },
});

/*
userSchema.set('toJSON', {
    virtuals: true, // Create id field
    versionKey: false, // Prevent the _v field
    transform: (doc, ret) => {
        delete ret._id; // Delete the _id field
    },
});
*/

/**
 * @type {User}
 */
const User = mongoose.model('User', userSchema);

export default User;