import { asyncHandler } from "../utils/asyncHandler.js";
import { Category } from "../models/category.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Fetching all the categories
const getCategories = asyncHandler(async (req, res) => {
    try {
        console.log("Fetching all the categories");
        const categories = await Category.find();
        console.log(`Found ${categories.length} categories`);
        res.json(new ApiResponse(200, categories, "All categories fetched successfully"));
    } catch (error) {
        console.log("Error in finding categories", error);
        throw new ApiError(500, "Something went wrong while fetching categories");
    }
});

// Creation of a new category
 const createCategory = asyncHandler(async (req, res) => {
    try {
        //destructure request.body

        const { name } = req.body;
        // console.log("Creating a new category");
        
        const newCategory = new Category({
            name,
        });

        // Save the new category to the database
        const savedCategory = await newCategory.save();

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: savedCategory
        });
    } catch (error) {
        console.error("Error in creating category:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong while creating category"
        });
    }
});

// Deleting a category by name
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const categoryName = req.params.name; // Get the category name from the request parameters
        console.log(`Deleting category with name: ${categoryName}`);
        const category = await Category.findOneAndDelete({ name: categoryName });
        if (!category) {
            throw new ApiError(404, "Category not found");
        }
        res.json(new ApiResponse(200, category, "Category deleted successfully"));
    } catch (error) {
        console.log("Error in deleting category", error);
        throw new ApiError(500, "Something went wrong while deleting category");
    }
});

export { getCategories,  createCategory, deleteCategory };
