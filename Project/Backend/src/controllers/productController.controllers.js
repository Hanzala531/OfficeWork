import {asyncHandler} from '../utils/asyncHandler.js'
import {Product} from '../models/product.models.js'
import {Category} from '../models/category.models.js'

// Fetching all the products 
const getAllProducts = asyncHandler(async (req , res )=> {
    try {
    console.log("Fetching all the products");
    const products = await Product.find().populate('category');
    console.log(`Found ${products.length} products `);
    res.json(products);
    }
    catch (error) {
        console.log("Error in finding products",error);
        res.status(500).json({message: "Internal Server Error" })
    }
});

// Creating a new product