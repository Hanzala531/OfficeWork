import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    coverImage: {
        type: [String],
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    price: {
        type: Number,
        required: true
    },
    stock: {

        type: Number,
        required: true,
        min: 0
    },  // 👈 Add stock field
    description: {
        type: String,
        required: true
    },
},
    {
        timestamps: true
    });

export const Product = mongoose.model("Product", productSchema);
