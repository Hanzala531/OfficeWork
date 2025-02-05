import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    }
})

export const SubCategory = mongoose.model("SubCategory", subcategorySchema);