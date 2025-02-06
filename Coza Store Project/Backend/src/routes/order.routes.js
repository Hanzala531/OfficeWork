import express from "express";
import {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

const logRequest = (req, res, next) => {
    console.log(`Order route received a ${req.method} request`);
    next();
}

orderRouter.post("/",
    logRequest,
    createOrder);
orderRouter.get("/",
    logRequest,
    getAllOrders);
orderRouter.get("/:id",
    logRequest,
    getOrderById);
orderRouter.put("/:id/status",
    logRequest,
    updateOrderStatus);
orderRouter.delete("/:id",
    logRequest,
    deleteOrder);

export default orderRouter;