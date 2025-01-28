import express from "express";
import {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.controllers.js";

const router = express.Router();

// Middleware for logging requests
const logRequest = (req, res, next) => {
  console.log(`Request received at ${req.originalUrl}`);
  next();
};

// Route to fetch all products
router.get("/", logRequest, getAllProducts);

// Route to fetch a product by ID or name
router.get('/:idOrName', logRequest, singleProduct);

// Route to create a new product 
router.post('/', logRequest, createProduct);

// Route to update a previously existing product by ID or name
router.put('/:idOrName', logRequest, updateProduct);

// Route to delete a product by ID or name
router.delete('/:idOrName', logRequest, deleteProduct);

export default router;
