import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { ProductVariant } from "../models/productVariant.models.js"; // Import ProductVariant
import { Cart } from "../models/cart.models.js"; // Import Cart model

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate request data
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "User ID is required"));
    }

    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productVariantId"); // Use productVariantId

    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Cart is empty"));
    }

    // Extract items and total amount from the cart
    const items = cart.items.map((item) => ({
      productVariantId: item.productVariantId._id, // Use productVariantId
      quantity: item.quantity,
      price: item.productVariantId.price, // Use productVariantId
    }));

    const totalAmount = cart.total;

    // Create a new order
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
    });

    await newOrder.save();

    // Clear the cart after creating the order
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], total: 0 } },
      { new: true }
    );

    res
      .status(201)
      .json(new ApiResponse(201, newOrder, "Order created successfully"));
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json(new ApiError(500, "Error creating order", error));
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.productVariantId"); // Use productVariantId

    res
      .status(200)
      .json(new ApiResponse(200, orders, "Orders fetched successfully"));
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json(new ApiError(500, "Error fetching orders", error));
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.productVariantId") // Use productVariantId
      .populate("userId");

    if (!order) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, order, "Order fetched successfully"));
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json(new ApiError(500, "Error fetching order", error));
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    if (!status) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Status is required"));
    }

    if (
      !["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(
        status
      )
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Invalid status value"));
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedOrder, "Order status updated"));
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json(new ApiError(500, "Error updating order status", error));
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json(new ApiResponse(404, null, "Order not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Order deleted successfully"));
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json(new ApiError(500, "Error deleting order", error));
  }
};

export {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};