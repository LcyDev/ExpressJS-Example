import mongoose, { Schema } from 'mongoose';

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

productSchema.set('toJSON', {
    virtuals: true,
/*
    versionKey: false, // Prevent the _v field
    transform: (doc, ret) => {
        delete ret._id; // Delete the _id field
    },
*/
});

const Product = mongoose.model('Product', productSchema);

export default Product;