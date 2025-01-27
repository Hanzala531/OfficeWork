import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"

// Fetching all the products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching all the products");
    const products = await Product.find().populate("category");
    console.log(`Found ${products.length} products`);
    res.json(new ApiResponse (201 , products , "All products are fetched successfully"));
  } catch (error) {
    console.log("Error in finding products", error);
    // res.status(500).json({ message: "Internal Server Error" });
    throw new ApiError (500 , "Something went wrong while fetching products")
  }
});

// Fetching a single product
const singleProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate({
      path : "category",
      select : "name"
    });
    if (!product) {
      console.log("Product not found");
      throw new ApiError(404 , "Product not found" );
    }
    res.status(200).json(product);
  } catch (error) {
    console.log("Error in finding product", error);
    // res.status(500).json({ message: "Internal Server Error" });
    throw new ApiError (500 , "Something went wrong while fetching product")
  }
});

// Creating a new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, coverImage, weight, discount, discountedPrice, originalPrice, category } = req.body;
  let existingCategory = await Category.findById(category);
  try {
    if (!existingCategory) {
      console.log("The entered category does not exist. Let's create a new one.");
      existingCategory = new Category({
        name: category,
        coverImage: coverImage,
      });
      await existingCategory.save();
    }
    const newProduct = new Product({
      name,
      coverImage,
      weight,
      discount,
      discountedPrice,
      originalPrice,
      category: existingCategory,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log("Error in creating product", error);
    // res.status(500).json({ message: "Internal Server Error" });
    throw new ApiError (500 , "Something went wrong while creating the product")
  }
});

// Update a previously existing product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      throw new ApiError(404 , "Product not found" );
    }
    res.status(200).json(product);
  }catch (error) {
    console.log("Error in finding product", error);
    // res.status(500).json({ message: "Internal Server Error" });
    throw new ApiError (500 , "Something went wrong while finding product")
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      throw new ApiError(404 , "Product not found" );
    }
    res.status(200).json({ message: "Product has been deleted" });
  }catch (error) {
    console.log("Error in finding products", error);
    // res.status(500).json({ message: "Internal Server Error" });
    throw new ApiError (500 , "Something went wrong while finding product")
  }
});

export {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
