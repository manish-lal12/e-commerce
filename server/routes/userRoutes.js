const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  verifyUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUser,
  verifyOldPassword,
  updateUserPassword,
  uploadProfileImage,
  deleteUser,
} = require("../controllers/userController");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);
router.route("/getUser/:id").get(authenticateUser, getUser);
router.route("/showCurrentUser").get(authenticateUser, showCurrentUser);
router.route("/updateUser/:id").patch(authenticateUser, updateUser);
router.route("/verifyPassword").get(authenticateUser, verifyOldPassword);
router
  .route("/updatePassword")
  .patch(authenticateUser, verifyUser, updateUserPassword);
router.route("/uploadProfileImage").post(authenticateUser, uploadProfileImage);
router
  .route("/delete/:id")
  .delete(authenticateUser, authorizePermissions("admin"), deleteUser);

module.exports = router;
