const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getReview,
  getCurrentUserReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllReviews);
router.route("/createReview").post(authenticateUser, createReview);
router.route("/getReview/:id").get(authenticateUser, getReview);
router.route("/getUserReview").get(authenticateUser, getCurrentUserReview);
router
  .route("/updateReview/:id")
  .patch(authenticateUser, authorizePermissions("admin", "user"), updateReview);
router.route("/deleteReview/:id").delete(authenticateUser, deleteReview);

module.exports = router;
