const User = require("../model/User");
const path = require("path");
const bcrypt = require("bcrypt");
const AdminJWT = require('../utils/AdminJWT')

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    const getUser = await User.findOne({ email });
    if (!getUser || getUser.role !== "Admin") {
      return res.status(403).json({ success: false, message: "You are not an admin" });
    }
    console.log(getUser, "admin login");
    const isPasswordMatching = await bcrypt.compare(password, getUser.password);
    if (isPasswordMatching) {
      AdminJWT(res, getUser._id);
      return res.status(200).json({
        role: getUser.role,
        name: getUser.name,
        email: getUser.email,
        _id: getUser._id,
        success: true,
        message: "Admin logged in successfully",
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during admin login:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get all users from the database
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "User" });
    if (users) {
      res.status(200).json({
        users
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST: Admin can create a new user
const addNewUser = async (req, res) => {
  const { email } = req.body;
  try {
    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.json("User already exists with this email address");
    }
    const createdUser = await User.create(req.body);
    if (createdUser) {
      return res.json("User registration successful");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET: Get user by their ID
const getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const getUser = await User.findById(userId);
    if (getUser) {
      return res.status(200).json({
        success: true,
        message: "User found",
        user: getUser,
      });
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json("Something went wrong");
  }
};

// Update the user by their ID
const updateUser = async (req, res) => {
  console.log(req.body)
  const { id, name, email } = req.body;
  console.log(req.file)
  const profileImage = req.file ? path.join("/uploads", req.file.filename) : null;

  const user = await User.findById(id);
  console.log(user)

  if (!user) {
    return res.status(404).json({ message: "User not found.." });
  }

  if (email && email !== user.email) {
    const ExistingUser = await User.findOne({ email });
    if (ExistingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
  }

  let isUpdated = false;

  if (name && name !== user.name) {
    user.name = name;
    isUpdated = true;
  }

  if (email && email !== user.email) {
    user.email = email;
    isUpdated = true;
  }

  if (profileImage && profileImage !== user.profileImage) {
    user.profileImgUrl = profileImage;
    isUpdated = true;
  }
  if (!isUpdated) {
    return res.status(200).json({ message: "No changes made" });
  }
  const updateUser = await user.save();

  res.status(200).json({
    name:updateUser.name,
    email:updateUser.email,
    profileImage:updateUser.profileImage,
  })
}

// Delete the user based on their ID
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId)
    const deleteUser = await User.findByIdAndDelete(userId);
    if (deleteUser) {
      return res.json("User deleted successfully");
    } else {
      res.json("Delete user failed");
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json("Something went wrong");
  }
};
const logoutAdmin = async (req, res) => {
  try {

    res.clearCookie("jwtAdmin");

    res.status(200).json({
      success: true,
      message: "Admin successfully logged out",
    });
  } catch (error) {
    console.log("Error during admin logout", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  adminLogin,
  getAllUsers,
  addNewUser,
  getUser,
  updateUser,
  deleteUser,
  logoutAdmin,
};
