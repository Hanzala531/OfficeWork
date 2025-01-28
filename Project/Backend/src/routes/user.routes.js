import express from "express";
import {
    logoutUser,
    registerUser,
    loginUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

// Register route
userRouter.route("/register").post(
    (req, res, next) => {
        console.log("Received request at /register");
        next();
    },
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage", // Corrected to a string (good!)
            maxCount: 1,
        },
    ]),
    registerUser
);

// Login route
userRouter.route("/login").post((req, res, next) => {
    console.log("Received request at /login");
    next();
}, loginUser);

// Secured Routes
userRouter.route("/logout").post(verifyJWT, logoutUser);

export default userRouter;