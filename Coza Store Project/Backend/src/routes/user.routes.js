import express from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verify } from "crypto";

const userRouter = express.Router();

// Creating route for registering a user

userRouter.route("/register").post(
  (req, res, next) => {
    console.log("Request received at /register");
    next();
  },
  upload.fields[
    {
      name: "avatar",
      maxCount: 1,
    }
  ],
  registerUser
);

// Creating route for logging in a user

userRouter.route("/login").post((req, res, next) => {
  console.log("Request received at /register");
  next();
}, loginUser
);

// Creating route for logging out a user

userRouter.route("/register").post(
  (req, res, next) => {
    console.log("Request received at /register");
    next();
  },
  verifyJWT,
  logoutUser
);
