import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {Order} from '../models/order.models.js';

// Create a new order
const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;

        // Validate request data
        if (!userId || !items || items.length === 0 || !totalAmount) {
            return res.status(400).json(new ApiResponse(400, null, "Missing required fields"));
        }

        const newOrder = new Order({ userId, items, totalAmount });
        await newOrder.save();

        res.status(201).json(new ApiResponse(201, newOrder, "Order created successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Error creating order", error.message));
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("items.productVariantId").populate("userId");
        res.status(200).json(new ApiResponse(200, orders, "Orders fetched successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Error fetching orders", error.message));
    }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("items.productVariantId").populate("userId");

        if (!order) return res.status(404).json(new ApiResponse(404, null, "Order not found"));

        res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Error fetching order", error.message));
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].includes(status)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid status value"));
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json(new ApiResponse(404, null, "Order not found"));

        res.status(200).json(new ApiResponse(200, updatedOrder, "Order status updated"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Error updating order status", error.message));
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);

        if (!deletedOrder) return res.status(404).json(new ApiResponse(404, null, "Order not found"));

        res.status(200).json(new ApiResponse(200, null, "Order deleted successfully"));
    } catch (error) {
        res.status(500).json(new ApiError(500, "Error deleting order", error.message));
    }
};

export {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
};