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
  // Trim the keys in the request body
  const trimmedBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [key.trim(), value])
  );

  const { 
    name, 
    coverImage, 
    weight, 
    discount, 
    discountedPrice, 
    originalPrice, // Ensure this is spelled correctly
    category, 
    categoryCoverImage 
  } = trimmedBody;

  const discountValue = parseFloat(discount) || 0; // Ensure it's a number
  const originalPriceValue = parseFloat(originalPrice); // Ensure it's a number

  console.log("Request body:", trimmedBody); // Log the request body

  try {
    if (!name) {
      throw new ApiError(400, "Product name is required");
    }
    if (isNaN(originalPriceValue)) {
      throw new ApiError(400, "Original price is required and must be a number");
    }

    // Check if the category already exists
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    const categoryCoverImageLocalPath = req.files?.categoryCoverImage[0]?.path;

    const coverimage = coverImageLocalPath
      ? await uploadOnCloudinary(coverImageLocalPath)
      : null;

    const categorycoverImage = categoryCoverImageLocalPath
      ? await uploadOnCloudinary(categoryCoverImageLocalPath)
      : null;

    console.log("Category name:", category); // Log the category name

    if (!category?.trim()) {
      throw new ApiError(400, "Category name is required");
    }

    let existingCategory = await Category.findOne({ name: category });
    
    // If the category does not exist, create a new one
    if (!existingCategory) {
      console.log("The entered category does not exist. Let's create a new one.");
      existingCategory = new Category({
        name: category,
        coverImage: categorycoverImage?.url || "", // Use the provided category cover image
      });
      await existingCategory.save();
    }

    // Create the new product with the existing or newly created category
    const newProduct = new Product({
      name,
      coverImage: coverimage?.url || "",
      weight,
      discount: discountValue, // Store as a number
      discountedPrice,
      originalPrice: originalPriceValue, // Store as a number
      category: existingCategory._id, // Store the ObjectId of the category
    });
    
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log("Error in creating product", error);
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
