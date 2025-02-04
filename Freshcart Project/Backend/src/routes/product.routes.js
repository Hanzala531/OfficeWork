import express from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const router = express.Router();

// Middleware for logging requests
const logRequest = (req, res, next) => {
  console.log(`Request received at ${req.originalUrl}`);
  next();
};

// Route to fetch all products
router.get("/", logRequest, getAllProducts);

// Route to fetch a product by ID or name
router.get("/:idOrName", logRequest, singleProduct);

// Route to create a new product
router.post(
  "/",
  logRequest,
  upload.fields([
    {
      name: "coverImage", // Corrected to a string (good!)
      maxCount: 1,
    },
    {
      name: "categoryCoverImage", // Corrected to a string (good!)
      maxCount: 1,
    },
  ]),
  createProduct
);

// Route to update a previously existing product by ID or name
router.put("/:idOrName", logRequest, updateProduct);

// Route to delete a product by ID or name
router.delete("/:idOrName", logRequest,verifyJWT, deleteProduct);

export default router;
