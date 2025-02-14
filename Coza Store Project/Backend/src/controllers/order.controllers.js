import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Order } from "../models/order.models.js";
import { ProductVariant } from "../models/productVariant.models.js"; // Import ProductVariant

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    // Validate request data
    if (!userId || !items || items.length === 0 || !totalAmount) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Missing required fields"));
    }

    const newOrder = new Order({ userId, items, totalAmount });
    await newOrder.save();

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
  .populate("items.productVariantId");

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
      .populate("items.productVariantId")
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

    if (!["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
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
