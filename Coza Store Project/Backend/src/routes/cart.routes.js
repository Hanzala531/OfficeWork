import express from 'express';
import { addToCart, getCart,updateProductQuantity, removeFromCart, clearCart } from '../controllers/cart.controlllers.js';
import { verifyJWT } from '../middlewares/Auth.middleware.js';

const cartRouter = express.Router();

// Apply authentication middleware
cartRouter.post('/', verifyJWT, addToCart);
cartRouter.get('/', verifyJWT, getCart);
cartRouter.put('/update', verifyJWT, updateProductQuantity);
cartRouter.delete('/remove',verifyJWT,removeFromCart);
cartRouter.delete('/clear',verifyJWT, clearCart);

export default cartRouter;