import express from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const productRouter = express.Router();

// Writing a short middleware to consoleLog the request received on an api endpoint
const logRequest = (req, res, next) => {
  console.log(`Request received at ${req.originalUrl}`);
  next();
};

// Route for fetching all the products
productRouter.get("/", logRequest, getAllProducts);

// Route for fetching a single product by id
productRouter.get("/:name", logRequest, singleProduct);

// Route for creating a product
productRouter.post(
  "/",
  logRequest,
  //   verifyJWT,
  upload.fields([
    {
      name: "coverImage",
      maxCount: 3,
    },
  ]),
  verifyJWT,
  createProduct
);

// Route for updating a product by name
productRouter.put(
  "/:name",
  logRequest,
  verifyJWT,
  updateProduct
);

// route for deleting a product by name
productRouter.delete("/:name", logRequest, verifyJWT, deleteProduct);

export default productRouter;
