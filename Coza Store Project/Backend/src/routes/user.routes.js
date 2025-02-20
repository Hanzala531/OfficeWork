import express from "express";
import {
  getAllUsers,
  getUser,
  updateUserRole,
  registerUser,
  logoutUser,
  loginUser,
  deleteUser,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/Auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

const logRequest = (req, res, next) => {
  console.log(`User route received a ${req.method} request`);
  next();
};

//route to display users to admin 
userRouter.route("/").get(
  (req, res, next) => {
    console.log("Request received at /");
    next();
  },
  // verifyJWT,
  getAllUsers
);


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

// Getting a sinlge user for logged in user
userRouter.route("/:id").get(
  (req, res, next) => {
    console.log("Request received at /:id");
    next();
  },
  verifyJWT,
  getUser
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

// route for deleting a user
userRouter.delete('/:id',
  logRequest,
  verifyJWT,
  deleteUser
);

// route for updating user role
userRouter.put("/:id/role",
  // verifyJWT, 
  updateUserRole);

export default userRouter;