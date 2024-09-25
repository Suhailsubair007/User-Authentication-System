const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { compareHashedPassword } = require("../utils/hashing");
const generateJWT = require('../utils/genarateAcessTocken'); // Adjust the path to the actual location of the file
const path = require("path");

const securePassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isUserExist = await User.findOne({ email });
    const imageUrl = req.file ? path.join("/uploads", req.file.filename) : null;
    if (isUserExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email address",
      });
      
    } else {
      const passwordHash = await securePassword(password);
      const createdUser = await User.create({
        name: name,
        email: email,
        password: passwordHash,
        profileImgUrl: imageUrl,
      })
      generateJWT(res, createdUser)
      console.log(generateJWT)
      return res.status(200).json({
        success: true,
        message: "User registration successful",
        user: createdUser,

      })
    }

  } catch (error) {
    res.status(500).json({ error: "Server error: " + error });
  }
};


// POST request for user login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const getUser = await User.findOne({ email });
    if (!getUser) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordMatching = await bcrypt.compare(password, getUser.password);
    if (isPasswordMatching) {
      generateJWT(res, getUser._id);
      return res.status(200).json({
        name: getUser.name,
        email: getUser.email,
        _id: getUser._id,
        success: true,
        message: "User logged in",
        profileImgUrl: getUser.profileImgUrl,
      });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



// GET: User log out
const logout = (req, res) => {

  res.clearCookie("jwt");
  res.status(200).json("User logged out successfully");
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userProfile = await User.findById(userId);
    if (userProfile) {
      return res.status(200).json({
        success: true,
        message: "User profile found",
        user: userProfile,
      });
    } else {
      res.json({
        success: false,
        message: "No user profile found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "server error" });
  }
};

// PUT: User update profile
// const updateUserProfile = async (req, res) => {
//   const { name, email } = req.body;  // id should be retrieved from `req.params` or `req.body`
//   const userId = req.body.id || req.params.id;  // Make sure you're getting the ID

//   const imageUrl = req.file ? path.join('./uploads', req.file.filename) : null;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       userId,
//       { name, email, profileImgUrl: imageUrl },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const updateUserProfile = async (req, res) => {
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
    name: updateUser.name,
    email: updateUser.email,
    profileImage: updateUser.profileImage,
  })
}

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name email profileImgUrl _id"
    )
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
}



// GET: Get user details (profileImg, name, email)
// const getUserDetails = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming the user ID is extracted from the request

//     // Find user by ID and only select the necessary fields
//     const user = await User.findById(userId).select("profileImgUrl name email");

//     if (user) {
//       return res.status(200).json({
//         success: true,
//         message: "User details retrieved successfully",
//         user: {
//           profileImgUrl: user.profileImgUrl,
//           name: user.name,
//           email: user.email,
//         },
//       });
//     } else {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// const updateUserProfile = async (req, res) => {
//   const { id, name, email } = req.body;
//   const profileImage = req.file ? req.file.filename : undefined;
//   const user = await User.findById(id);

//   if (!user) {
//     return res.status(404).json({ message: "User not found" });

//   }
//   if (email && email !== user.email) {
//     const userExist = await User.findOne({ email });
//     if(userExist){
//       res.status(400).json({message:"Email alredy exist"});
//     }
//   }

// }



module.exports = {
  signupUser,
  login,
  logout,
  getUserProfile,
  updateUserProfile,
  getUserDetails,
};
