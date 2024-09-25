// adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const { verifyUser, isAdminAuth } = require("../middleware/authMiddleware");
const { upload } = require("../config/multer");


router.post("/login", adminController.adminLogin);
router.post("/logout", adminController.logoutAdmin);
router.get("/getusers", isAdminAuth, adminController.getAllUsers);
router.post("/users",  isAdminAuth, adminController.addNewUser);
router.get("/:id", isAdminAuth, adminController.getUser);
router.delete("/users/:id", isAdminAuth, adminController.deleteUser);

router.put(
  "/updateUsers",
  isAdminAuth,
  upload.single("image"),
  adminController.updateUser
);




module.exports = router;