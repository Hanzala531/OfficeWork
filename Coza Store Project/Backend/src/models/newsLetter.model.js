import mongoose from "mongoose";

const newsLetteSchema = new mongoose.Schema ({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    subscriberNo:{
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },   
});

export const NewsLetter = mongoose.model("NewsLetter", newsLetteSchema);