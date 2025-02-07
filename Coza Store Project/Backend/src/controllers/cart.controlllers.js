import { Cart } from '../models/cart.models.js';
import { Product } from '../models/product.models.js';
import {ApiResponse} from '../utils/APIResponse.js';
import {ApiError} from '../utils/APIError.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import { response } from 'express';

// Add a product to the cart
const addToCart = asyncHandler(async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Fetch the product from the database
        const product = await Product.findById(productId);
        if (!product) {
          return res.json( new ApiResponse('Product not found', 200));
        }

        // Check if the user already has a cart
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            // If no cart exists, create a new cart for the user
            cart = new Cart({
                userId: req.user._id,
                products: [{ productId, quantity }],
                total: quantity * product.price
            });
        } else {
            // Check if the product is already in the cart
            const index = cart.products.findIndex(
                (p) => p.productId.toString() === productId
            );

            if (index !== -1) {
                // If product exists, update the quantity
                cart.products[index].quantity += quantity;
            } else {
                // If product is not in the cart, add it
                cart.products.push({ productId, quantity });
            }

            // Recalculate total price
            cart.total = cart.products.reduce((sum, item) => {
                const itemPrice = item.productId.toString() === productId ? product.price : 0;
                return sum + item.quantity * itemPrice;
            }, 0);
        }

        // Save the cart to the database
        await cart.save();

        return ApiResponse.Ok(res, cart);
    } 
    catch (error) {
        throw new ApiError(error.message, 500);
    }
});

// Get the user's cart
const getCart = asyncHandler(async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id }).populate('products.productId');
        if (!cart) {
            return ApiResponse.Ok(res, {}, "Cart is empty");
        }
        return ApiResponse.Ok(res, cart, "Cart retrieved successfully");
    } 
    catch (error) {
        throw new ApiError(error.message, 500);
    }
});

// Remove a product from the cart
const removeFromCart = asyncHandler(async (req, res) => {
    try {
        const { productId } = req.body;
        let cart = await Cart.findOne({ userId: req.user._id });

        if (!cart) {
            return ApiResponse.Ok(res, {}, "Cart is empty");
        }

        // Filter out the product from the cart
        cart.products = cart.products.filter(
            (item) => item.productId.toString() !== productId
        );

        // Recalculate total price
        cart.total = await cart.products.reduce(async (sum, item) => {
            const product = await Product.findById(item.productId);
            return sum + item.quantity * (product ? product.price : 0);
        }, 0);

        await cart.save();
        return ApiResponse.Ok(res, cart, "Product removed from cart");
    } 
    catch (error) {
        throw new ApiError(error.message, 500);
    }
});

// Clear the entire cart
const clearCart = asyncHandler(async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.user._id });
        return ApiResponse.Ok(res, {}, "Cart cleared successfully");
    } 
    catch (error) {
        throw new ApiError(error.message, 500);
    }
});

export { addToCart, getCart, removeFromCart, clearCart };
