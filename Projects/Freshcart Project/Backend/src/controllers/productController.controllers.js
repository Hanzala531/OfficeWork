import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";
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
      throw new ApiError(404, "Product not found");
    }
    res.status(200).json(new ApiResponse(200, product, "Product fetched successfully"));
  } catch (error) {
    console.log("Error in finding product", error);
    throw new ApiError(500, "Something went wrong while fetching product");
  }
});
//Create Product Function
const createProduct = asyncHandler(async (req, res) => {
  try {
    // Trim request body keys
    const trimmedBody = Object.fromEntries(
      Object.entries(req.body).map(([key, value]) => [key.trim(), value])
    );

    const { 
      name, 
      weight, 
      discount, 
      discountedPrice, 
      originalPrice, 
      category 
    } = trimmedBody;

    const discountValue = parseFloat(discount) || 0;
    const originalPriceValue = parseFloat(originalPrice);

    console.log("Request body:", trimmedBody);

    if (!name) {
      throw new ApiError(400, "Product name is required");
    }
    if (isNaN(originalPriceValue)) {
      throw new ApiError(400, "Original price is required and must be a number");
    }
    if (!category?.trim()) {
      throw new ApiError(400, "Category name is required");
    }

    // Check uploaded files
    console.log("Uploaded files:", req.files);

    const coverImagePath = req.files?.coverImage?.[0]?.path || null;
    const categoryCoverImagePath = req.files?.categoryCoverImage?.[0]?.path || null;

    // Upload images to Cloudinary
    const [coverImage, categoryCoverImage] = await Promise.all([
      coverImagePath ? uploadOnCloudinary(coverImagePath) : null,
      categoryCoverImagePath ? uploadOnCloudinary(categoryCoverImagePath) : null
    ]);

    console.log("Cover Image URL:", coverImage?.url);
    console.log("Category Cover Image URL:", categoryCoverImage?.url);

    // Find or create the category
    let existingCategory = await Category.findOne({ name: category });

    if (!existingCategory) {
      console.log("Category does not exist, creating a new one...");
      existingCategory = new Category({
        name: category,
        coverImage: categoryCoverImage?.url || "", // Use uploaded category cover image if available
      });
      await existingCategory.save();
    }

    // Create new product
    const newProduct = new Product({
      name,
      coverImage: coverImage?.url || "", 
      weight,
      discount: discountValue,
      discountedPrice,
      originalPrice: originalPriceValue,
      category: existingCategory._id,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(new ApiResponse(201, savedProduct, "Product created successfully"));
    
  } catch (error) {
    console.error("Error in creating product:", error);
    throw new ApiError(500, "Something went wrong while creating the product");
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
      throw new ApiError(404, "Product not found");
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
      throw new ApiError(404, "Product not found");
    }
    res.status(200).json(new ApiResponse(200, null, "Product has been deleted"));
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
