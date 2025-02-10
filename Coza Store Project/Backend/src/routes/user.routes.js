import express from "express";
import {
  registerUser,
  logoutUser,
  loginUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

// Creating route for registering a user

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    }
  ]),
  registerUser
);

// Creating route for logging in a user

userRouter.route("/login").post((req, res, next) => {
  console.log("Request received at /login");
  next();
}, loginUser
);

// Creating route for logging out a user

userRouter.route("/logout").post(
  (req, res, next) => {
    console.log("Request received at /register");
    next();
  },
  verifyJWT,
  logoutUser
);


export default userRouter;