import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: String,
    edad: Number,
    email: String
});

const User = mongoose.model('User', userSchema);

export default User;