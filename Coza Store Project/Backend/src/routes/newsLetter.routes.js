import express from 'express';
import {
    getEmailAddresses,
    addEmail,
    deleteEmail
} from '../controllers/newsLetter.controller.js';
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const newsLetterRouter = express.Router();

const logRequest = (req, res, next) => {
    console.log(`NewsLetter route received a ${req.method} request`);
    next();
};

// route for getting all the emails
newsLetterRouter.get('/',
    logRequest,
    // verifyJWT,
    getEmailAddresses
);

// route for adding a new email
newsLetterRouter.post('/',
    logRequest,
    addEmail
);

// route for deleting an email
newsLetterRouter.delete('/:id',
    logRequest,
    verifyJWT,
    deleteEmail
);


export default newsLetterRouter;