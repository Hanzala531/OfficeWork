import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure quantity is at least 1
      },
      price: {
        type: Number,
        required: true,
        min: 0, // Ensure price is non-negative
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0, // Ensure total amount is non-negative
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date and time
  },
});

export const Order = mongoose.model("Order", OrderSchema);