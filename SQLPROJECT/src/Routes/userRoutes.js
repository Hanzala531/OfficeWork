// routes/userRoutes.js
import express from 'express';
import { getAllUsers, createUser } from '../Controllers/userController.js';

const router = express.Router();

router.get('/get-user', getAllUsers);
router.post('/create-user', createUser);

export  {router};
