import { asyncHandler } from "../utils/asyncHandler.js";
import { Product } from "../models/product.models.js";
import { Category } from "../models/category.models.js";

// Fetching all the products
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching all the products");
    const products = await Product.find().populate("category");
    console.log(`Found ${products.length} products `);
    res.json(products);
  } catch (error) {
    console.log("Error in finding products", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
//Fetching a single product

const singleProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("categoey");
    if (!product) {
      console.log("Product not found");
      return res.status(404).json({ message: " product not found" });
    }
    res.status(200).json({ message: "Found" });
  } catch (error) {
    console.log("Error in fetching product");
    res.status(404).json({ message: "Internal Server Error" });
  }
});

// Creating a new product
const createProduct = asyncHandler(async (req, res) => {
  const { name, coverImage, weight, discount, discountedPrice, orignalPrice } =
    req.body;
  let existingCategory = await Category.findById(category);
  try {
    if (!existingCategory) {
      console.log("The entered category does not exits\nLets create a new one");
      existingCategory = new Category({
        name: category,
        coverImage: image,
      });
      await existingCategory.save();
      const newProduct = {
        name,
        coverImage,
        weight,
        discount,
        discountedPrice,
        orignalPrice,
      };
      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
    }
  } catch (error) {
    console.log("There is some problem with the server", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update a previously existing product

const updateProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404), { message: "Product not found" };
    }
    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete a product

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (deletedProduct) {
      res.status(404).json({ messege: " Product not found" });
    }
    res.status(201).json({ message: "Product has been deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
