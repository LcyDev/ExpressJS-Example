import mongoose, { Schema, model } from 'mongoose';

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

userSchema.set('toJSON', {
    virtuals: true,
/*
    versionKey: false, // Prevent the _v field
    transform: (doc, ret) => {
        delete ret._id; // Delete the _id field
    },
*/
});

const User = model('User', userSchema);

export default User;