import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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


// Register Controller
const registerUser = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { fullname, email, username, password } = req.body;
  console.log(fullname , "\n" , email  , "\n" ,username  , "\n" ,password)
  // Validate required fields
  if ([fullname, email, username, password].some((field) => !field?.trim())) {
    throw new ApiError(400, "Incomplete User credentials");
  }

  // Checking if user exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  // Local path of avatar and cover image
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // Check if avatar is provided
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Uploading to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  // Check if avatar upload was successful
  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // Creating user
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Checking if user is created
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "We are having trouble creating your account");
  }

  res.status(201).json({
    success: true,
    user: createdUser,
  });
});

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
  const isPasswordValid = await user.isPasswordCorrect(password , user.password);
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

export { registerUser, loginUser, logoutUser };
