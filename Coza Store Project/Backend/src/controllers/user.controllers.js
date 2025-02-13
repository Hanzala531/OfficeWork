import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

// Access and Refresh Tokens
const generateAccessAndRefreshTokens = async (userid) => {
  try {
    const user = await User.findById(userid);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Call the methods on the user instance
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error); // Log the error
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

// get all users 
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

//update user role
const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  user.role = role;
  await user.save();
  res.status(200).json({
    success: true,
    user,
  });
});

// Register Controller
const registerUser = asyncHandler(async (req, res) => {
  console.log("req body", req.body)
  const { email, username, password, avatar } = req.body;
  // console.log("data : ",email, "\n", username, "\n", password);
  // Validate required fields
  if ([email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "Incomplete User credentials");
  }

  // Checking if user exists
  const existingUser = await User.findOne({
    email,
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // adding avatar 
  const avatarLocalPath = req.files?.avatar?.[0]?.path || null;
  const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  // Creating user
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    avatar: avatarUrl?.url || "",
    password,

  });


  // Checking if user is created
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "We are having trouble creating your account");
  }
  console.log("asdasd", createdUser);

  return res.status(201).json({
    success: true,
    user: createdUser,
  });
});

// const registerUser = asyncHandler(async (req, res) => {
//   console.log("Received request:", req.body);

//   const { email, username, password } = req.body;
//   if ([email, username, password].some((field) => !field?.trim())) {
//     throw new ApiError(400, "Incomplete User credentials");
//   }

//   // Check if user already exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     throw new ApiError(409, "User already exists");
//   }

//   // Handle avatar upload
//   let avatarUrl = "";
//   const avatarLocalPath = req.file?.path || null;
//   if (avatarLocalPath) {
//     try {
//       avatarUrl = await uploadOnCloudinary(avatarLocalPath);
//     } catch (error) {
//       console.error("Cloudinary Upload Error:", error);
//       throw new ApiError(500, "Error uploading avatar");
//     }
//   }

//   console.log("Avatar URL:", avatarUrl);

//   // Create user
//   const user = await User.create({
//     username: username.toLowerCase(),
//     email,
//     avatar: avatarUrl?.url || "",
//     password, // No need to hash, it's handled in the model
//   });

//   // Validate user creation
//   const createdUser = await User.findById(user._id).select("-password -refreshToken");
//   if (!createdUser) {
//     throw new ApiError(500, "We are having trouble creating your account");
//   }

//   res.status(201).json({
//     success: true,
//     message: "User registered successfully",
//     user: createdUser,
//   });
// });

// Login Controller
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Find the user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check for password validity
  const isPasswordValid = await user.isPasswordCorrect(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set secure flag based on environment
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      user: loggedInUser,
      accessToken,
      refreshToken,
      message: "User Logged In Successfully",
    });
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ success: true, message: "User logged out successfully" });
});

export {
  getAllUsers,
  updateUserRole,
  registerUser,
  loginUser,
  deleteUser,
  logoutUser
};
