import { Cart } from '../models/cart.models.js';
import { Product } from '../models/product.models.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Add a product to the cart
const addToCart = asyncHandler(async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      console.log("Request Body:", req.body); // Log the request body
  
      // Fetch the product from the database
      const product = await Product.findById(productId);
      console.log("Product:", product); // Log the fetched product
  
      if (!product) {
        return res.status(404).json(new ApiResponse(404, null, "Product not found"));
      }
  
      // Check if the user already has a cart
      let cart = await Cart.findOne({ userId: req.user._id });
      console.log("Cart:", cart); // Log the cart
  
      if (cart) {
        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(
          (item) => item.productId.toString() === productId
        );
  
        if (productIndex > -1) {
          // If the product exists, update the quantity
          cart.products[productIndex].quantity += quantity;
        } else {
          // If the product does not exist, add it to the cart
          cart.products.push({ productId, quantity });
        }
  
        // Update the total price of the cart
        cart.total += product.price * quantity;
        cart.updated = Date.now();
  
        await cart.save();
        console.log("Cart Updated:", cart); // Log the updated cart
        return res
          .status(200)
          .json(new ApiResponse(200, cart, "Product added to cart"));
      } else {
        // If the cart does not exist, create a new cart
        const newCart = new Cart({
          userId: req.user._id,
          products: [{ productId, quantity }],
          total: product.price * quantity,
        });
  
        await newCart.save();
        console.log("Cart Created:", newCart); // Log the new cart
        return res
          .status(200)
          .json(new ApiResponse(200, newCart, "Product added to cart"));
      }
    } catch (error) {
      console.error("Error in addToCart:", error); // Log the error
      throw new ApiError(error.message, 500);
    }
  });



// Get the user's cart
const getCart = asyncHandler(async (req, res) => {
    try {
      // Fetch the user's cart and populate the product details (excluding coverImage)
      const cart = await Cart.findOne({ userId: req.user._id }).populate({
        path: "products.productId",
        model: "Product",
        select: "-coverImage", // Exclude the coverImage field
      });
  
      if (!cart) {
        return res.status(200).json(new ApiResponse(200, [], "Cart is empty"));
      }
  
      // Calculate the total price if it's not already stored
      if (cart.total === 0) {
        cart.total = cart.products.reduce(
          (sum, item) => sum + item.quantity * item.productId.price,
          0
        );
        await cart.save();
      }
  
      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart retrieved successfully"));
    } catch (error) {
      throw new ApiError(error.message, 500);
    }
  });

  
//   COntroller to update the quantity of the product in the cart
const updateProductQuantity = asyncHandler(async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      console.log("Request Body:", req.body); // Log the request body
  
      // Fetch the user's cart
      const cart = await Cart.findOne({ userId: req.user._id });
      console.log("Cart:", cart); // Log the fetched cart
  
      if (!cart) {
        return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
      }
  
      // Find the product in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      console.log("Product Index:", productIndex); // Log the product index
  
      if (productIndex === -1) {
        return res.status(404).json(new ApiResponse(404, null, "Product not found in cart"));
      }
  
      // Fetch the product to get its price
      const product = await Product.findById(productId);
      console.log("Product:", product); // Log the fetched product
  
      if (!product) {
        return res.status(404).json(new ApiResponse(404, null, "Product not found"));
      }
  
      // Calculate the difference in total price
      const oldQuantity = cart.products[productIndex].quantity;
      const priceDifference = product.price * (quantity - oldQuantity);
  
      // Update the product quantity
      cart.products[productIndex].quantity = quantity;
  
      // Update the total price of the cart
      cart.total += priceDifference;
      cart.updated = Date.now();
  
      // Save the updated cart
      await cart.save();
      console.log("Updated Cart:", cart); // Log the updated cart
  
      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Product quantity updated successfully"));
    } catch (error) {
      console.error("Error in updateProductQuantity:", error); // Log the error
      throw new ApiError(error.message, 500);
    }
  });




// Remove a product from the cart
const removeFromCart = asyncHandler(async (req, res) => {
    try {
      const { productId } = req.body;
      console.log("Request Body:", req.body); // Log the request body
  
      // Fetch the user's cart
      const cart = await Cart.findOne({ userId: req.user._id });
      console.log("Cart:", cart); // Log the fetched cart
  
      if (!cart) {
        return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
      }
  
      // Find the product in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      console.log("Product Index:", productIndex); // Log the product index
  
      if (productIndex === -1) {
        return res.status(404).json(new ApiResponse(404, null, "Product not found in cart"));
      }
  
      // Remove the product from the cart
      const removedProduct = cart.products.splice(productIndex, 1)[0];
      console.log("Removed Product:", removedProduct); // Log the removed product
  
      // Update the total price of the cart
      const product = await Product.findById(productId);
      console.log("Product:", product); // Log the fetched product
  
      if (!product) {
        return res.status(404).json(new ApiResponse(404, null, "Product not found"));
      }
  
      cart.total -= product.price * removedProduct.quantity;
      cart.updated = Date.now();
  
      await cart.save();
      console.log("Updated Cart:", cart); // Log the updated cart
  
      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Product removed from cart"));
    } catch (error) {
      console.error("Error in removeFromCart:", error); // Log the error
      throw new ApiError(error.message, 500);
    }
  });
// Clear the entire cart
const clearCart = asyncHandler(async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json(new ApiResponse(401, null, "Unauthorized: User not authenticated"));
      }
  
      console.log("Clearing cart for user:", req.user._id); // Log the user ID
  
      // Fetch the user's cart
      const cart = await Cart.findOne({ userId: req.user._id });
      console.log("Fetched Cart:", cart); // Log the fetched cart
  
      if (!cart) {
        console.log("Cart not found for user:", req.user._id); // Log if cart is not found
        return res.status(404).json(new ApiResponse(404, null, "Cart not found"));
      }
  
      // Clear the cart
      cart.products = []; // Remove all products
      cart.total = 0; // Reset the total price
      cart.updated = Date.now(); // Update the timestamp
  
      // Save the updated cart
      await cart.save();
      console.log("Cart cleared successfully:", cart); // Log the updated cart
  
      // Return the updated cart
      return res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart cleared successfully"));
    } catch (error) {
      console.error("Error in clearCart:", error); // Log the error
      throw new ApiError(error.message, 500);
    }
  });
export { addToCart, getCart, updateProductQuantity , removeFromCart, clearCart };