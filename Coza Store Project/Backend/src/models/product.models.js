import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    } ,
    coverImage: {
        type:  [String],
        required: true,
    } ,
    category:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'   
    } ,
    price: {
        type: Number,
        required: true,
    } ,
    description: {
        type: String,
        required: true,
    } ,
    createdAt: {
        type: Date,
        default: Date.now,
    } ,
    updatedAt: {
        type: Date,
        default: Date.now,
    } ,
},
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);