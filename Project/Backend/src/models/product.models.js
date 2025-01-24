import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        index: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    category:{
    type: mongoose.Schema.ObjectId,
    ref: 'Category'   
    },
    weight:{
        type : String,
        required: true
    },
    discount : {
        type :Number,
        required : true
    },
    discountedPrice:{
        type : Number,
        required : true
    },
    orignalPrice :{
        type : Number,
        required : true
    }


},
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);