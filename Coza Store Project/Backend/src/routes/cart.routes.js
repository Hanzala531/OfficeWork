// All the routes for the cart will be defined in the cart.routes.js file. The routes will call the addToCart function from the cart controller.

import express from 'express';
import { addToCart 
    , getCart
    , removeFromCart
    , clearCart
 } from '../controllers/cart.controlllers.js';

const cartRouter = express.Router();

//middleware to manage log requests

const logRequest = (req, res, next) => {
    console.log('Request sent to:', req.originalUrl);
    next();
};


cartRouter.get('/get', logRequest, getCart);
cartRouter.post('/', logRequest, addToCart);
cartRouter.delete('/remove', logRequest, removeFromCart);
cartRouter.delete('/clear', logRequest, clearCart);


export default cartRouter;