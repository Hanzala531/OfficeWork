import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  // Order Schema
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Make sure "User" is the correct model name
    required: true,
  },
  items: [
    {
      productVariantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductVariant", // Make sure "ProductVariant" is correct
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model("Order", OrderSchema);
