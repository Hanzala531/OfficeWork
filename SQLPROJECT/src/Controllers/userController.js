// controllers/userController.js
const users = []; // Array to store user data
import {asyncHandler} from "../Utilities/asyncHandler.js";
import { pool } from "../config/db.js";

// get all users

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM users");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
}
);


// create user
const createUser = asyncHandler(async (req, res) => {
  try {
  const { email, password } = req.body;
  console.log("req.body", req.body);
  

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

    const newUser = await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, password]);
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// // Function to get all users
// export const getAllUsers = (req, res) => {
//   res.json(users); // Send all users as JSON response
// };

// // Function to create a new user
// export const createUser = (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }
  
//   const newUser = { email, password }; // Create a new user object
//   users.push(newUser); // Add the new user to the array
  
//   res.status(201).json({ message: 'User registered successfully', user: newUser });
// };

export  {
  getAllUsers,
  createUser
}