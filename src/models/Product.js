import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    nombre: String,
    precio: Number,
    descripcion: String
});

const Product = mongoose.model('Product', productSchema);

export default Product;