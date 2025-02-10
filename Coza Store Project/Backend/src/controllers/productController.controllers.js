import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// Fetching all the products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching all the products");
    const products = await Product.find().populate("category");
    console.log(`Found ${products.length} products`);
    res.json(
      new ApiResponse(200, products, "All products fetched successfully")
    );
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
      return res.json( new ApiResponse(404, "Product not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    console.log("Error in finding product", error);
    throw new ApiError(500, "Something went wrong while fetching product");
  }
});

// Create Product Function
// const createProduct = asyncHandler(async (req, res) => {
//   try {
//     const { name, price, Category , descrription} = req.body;

//     // Validate the Category ID format
//     if (!mongoose.Types.ObjectId.isValid(Category)) {
//       return res.json(new ApiResponse(400, null, "Category does not exists"));
//     }

//     // Uploading the image on Cloudinary
//     const imagePath = req.files?.coverImage?.[0]?.path || null;
//     let imageUrl = "";
    
//     if (imagePath) {
//       const Image = await uploadOnCloudinary(imagePath);
//       imageUrl = Image?.url || "";
//     }

//     const product = new Product({
//       name,
//       price,
//       category: Category, // This is the ObjectId reference
//       coverImage: imageUrl,
//       descrription,
//     });

//     await product.save();
//     res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
//   } catch (error) {
//     console.log("Error in creating product", error);
//     throw new ApiError(500, "Something went wrong while creating product");
//   }
// });
const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, price, Category, description } = req.body;
    console.log("Received Category:", Category);

    // Validate category
    let categoryId = Category;
    if (!mongoose.Types.ObjectId.isValid(Category)) {
      const categoryDoc = await mongoose.model("Category").findOne({ name: Category });
      if (!categoryDoc) {
        throw new ApiError(404, "Category not found");
      }
      categoryId = categoryDoc._id;
    }

    // ✅ Fix: Properly handle `upload.fields()` (req.files is an object, not an array)
    const files = req.files?.coverImage || []; // `coverImage` is an array
    if (files.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }

    if (files.length > 3) {
      throw new ApiError(400, "Maximum 3 images allowed");
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      files.map(async (file) => {
        const uploadedImage = await uploadOnCloudinary(file.path);
        return uploadedImage.url;
      })
    );

    // Create and save the product
    const product = new Product({
      name,
      price,
      category: categoryId,
      coverImage: imageUrls, // Store multiple image URLs
      description,
    });

    await product.save();
    res.status(201).json(new ApiResponse(201, product, "Product created successfully"));
  } catch (error) {
    console.error("Error in creating product:", error);
    throw new ApiError(500, error.message || "Something went wrong while creating product");
  }
});




// Update a previously existing product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate({
      path: "category",
      select: "name", // Only select the name field from the category
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

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
     return res.json (new ApiResponse(404, "Product not found"));
    }
    res
      .status(200)
      .json(new ApiResponse(200, null, "Product has been deleted"));
  } catch (error) {
    console.log("Error in deleting product", error);
    throw new ApiError(500, "Something went wrong while deleting product");
  }
});

export {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};