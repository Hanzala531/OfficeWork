import express from "express";
import {
  getAllProducts,
  singleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.controllers.js";

const router = express.Router();

// Route to fetch all products
router.get("/", (req, res, next) => {
  console.log("Request received at /");
  next(); // Call the next middleware or route handler
}, getAllProducts);


//route to fetch products individually
router.get('/:id' ,( req , res , next) => {
  console.log('Request received at ' , req.params.id);
  next();  
}, singleProduct)

//Route to create a new product 
router.post('/' , (req , res , next)=>{
  console.log("Request received at /" );
  next();
}, createProduct);

//route to update a previously existing product
router.put('/:id' , (req , res , next)=>{
  console.log('Request received at ' , req.params.id);
  next();
},updateProduct);

//Route to delete a product 
router.delete('/:id' , ( req , res , next )=>{
  console.log('Delete request received at ' , req.params.id);
  next();
},deleteProduct);

export default router;