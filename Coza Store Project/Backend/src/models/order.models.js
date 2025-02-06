import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productVariantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ProductVariant",
                required: true,
            },
            quantity: {
                type: Number, 
                required: true
            },
        },
    ],
    totalAmount: {
        type: Number, 
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending",
    },
    createdAt: { type: Date, default: Date.now },
});


export const Order = mongoose.model("Order", OrderSchema);