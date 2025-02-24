import express from "express";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import {
  getCategories,
  createCategory,
  deleteCategory,
} from "../controllers/category.controllers.js";

const categoryRouter = express.Router();

// Middleware for logging requests
const logRequest = (req, res, next) => {
  console.log(`Request received at ${req.originalUrl}`);
  next();
};

// Creating route for fetching all the categories
categoryRouter.get("/", logRequest, getCategories);


// Creating route for creating a category
categoryRouter.post(
  "/create",
  logRequest,
  // verifyJWT ,
  createCategory
);

// Route for deleting a category by name
categoryRouter.delete("/delete/:name", logRequest,verifyJWT, deleteCategory);

export default categoryRouter;
