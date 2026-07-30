const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= Register =================
async function register(req, res) {
  console.log(req.body);
  const data = req.body;
  const { name, email, password, contactNumber } = data;

  // Check required fields
  if (!name || !email || !password || !contactNumber) {
    return res.status(400).send({
      success: false,
      message: "All Required Fields are Missing",
    });
  }

  // Check if email already exists
  const userData = await User.findOne({ email });

  if (userData) {
    return res.status(400).send({
      success: false,
      message: "Email Already Registered",
    });
  }

  // Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create New User
  const newUserData = new User({
    name,
    email,
    password: hashedPassword,
    contactNumber,
  });

  const newUser = await newUserData.save();

  return res.status(201).send({
    success: true,
    message: "Registration Successful",
    data: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      contactNumber: newUser.contactNumber,
      role: newUser.role,
    },
  });
}

// ================= Login =================
async function login(req, res) {
  console.log(req.body);
  const data = req.body;
  const { email, password } = data;

  // Check required fields
  if (!email || !password) {
    return res.status(400).send({
      success: false,
      message: "Email and Password are Required",
    });
  }

  // Check if user exists
  const userData = await User.findOne({ email });

  if (!userData) {
    return res.status(400).send({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  // Compare Password
  const isPasswordMatch = await bcrypt.compare(
    password,
    userData.password
  );

  if (!isPasswordMatch) {
    return res.status(400).send({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  // Generate JWT Token
  const token = jwt.sign(
    {
      userId: userData._id,
      role: userData.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  // Store Token in Cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.MODE === "production",
    sameSite: process.env.MODE === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).send({
    success: true,
    message: "Login Successful",
    data: {
      id: userData._id,
      name: userData.name,
      email: userData.email,
      contactNumber: userData.contactNumber,
      role: userData.role,
    },
  });
}

// ================= Get Logged In User =================
async function getMe(req, res) {
  const user = req.user;

  if (!user) {
    return res.status(404).send({
      success: false,
      message: "User Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    data: user,
  });
}

// ================= Update Profile =================
async function updateProfile(req, res) {
  const userId = req.user._id;
  const { name, contactNumber } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { name, contactNumber },
    { new: true }
  ).select("-password");

  if (!updatedUser) {
    return res.status(404).send({
      success: false,
      message: "User Not Found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Profile Updated Successfully",
    data: updatedUser,
  });
}

// ================= Get All Users (Admin) =================
async function getAllUsers(req, res) {
  const users = await User.find({}).select("-password");

  return res.status(200).send({
    success: true,
    message: "Users Found",
    data: users,
  });
}

// ================= Logout =================
async function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    maxAge: 0,
  });

  return res.status(200).send({
    success: true,
    message: "Logout Successful",
  });
}

module.exports = {
  register,
  login,
  getMe,
  logout,
  updateProfile,
  getAllUsers,
};