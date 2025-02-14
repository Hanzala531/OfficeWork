import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Fetching all the products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching all the products");
    const products = await Product.find().populate("category");
    console.log(`Found ${products.length} products`);
    res.json(new ApiResponse(200, products, "All products fetched successfully"));
  } catch (error) {
    console.log("Error in finding products", error);
    throw new ApiError(500, "Something went wrong while fetching products");
  }
});

// Fetching a single product
const singleProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path: "category",
      select: "name",
    });
    if (!product) {
      console.log("Product not found");
      return res.json(new ApiResponse(404, "Product not found"));
    }
    res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    console.log("Error in finding product", error);
    throw new ApiError(500, "Something went wrong while fetching product");
  }
});

// Create Product
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;
    console.log("Received category from Postman:", category);

    // Validate category
    let categoryId = category;
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const categoryDoc = await Category.findOne({ name: category });
      if (!categoryDoc) {
        throw new ApiError(404, "Category not found");
      }
      categoryId = categoryDoc._id;
    }

    // Validate stock
    if (stock < 0) throw new ApiError(400, "Stock cannot be negative");

    // Validate image upload
    const files = req.files?.coverImage || [];
    if (files.length === 0) throw new ApiError(400, "At least one image is required");
    if (files.length > 3) throw new ApiError(400, "Maximum 3 images allowed");

    // Upload images
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const uploadedImage = await uploadOnCloudinary(file.path);
        return uploadedImage.url;
      })
    );

    // Create product
    const product = new Product({
      name,
      price,
      category: categoryId,
      coverImage: imageUrls,
      description,
      stock,
    });

    await product.save();
    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    console.error("Error in creating product:", error);
    throw new ApiError(500, error.message || "Something went wrong while creating product");
  }
});


// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock !== undefined && stock < 0) {
      throw new ApiError(400, "Stock cannot be negative");
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate({
      path: "category",
      select: "name",
    });

    if (!product) {
      return res.json(new ApiResponse(404, "Product not found"));
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in updating product", error);
    throw new ApiError(500, "Something went wrong while updating the product");
  }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.json(new ApiResponse(404, "Product not found"));
    }
    res.status(200).json(new ApiResponse(200, null, "Product has been deleted"));
  } catch (error) {
    console.log("Error in deleting product", error);
    throw new ApiError(500, "Something went wrong while deleting product");
  }
});

export { getAllProducts, singleProduct, createProduct, updateProduct, deleteProduct };
