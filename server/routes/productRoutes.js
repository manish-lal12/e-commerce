const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImageProduct,
  deleteProduct,
} = require("../controllers/productController");

const { getSingleProductReviews } = require("../controllers/reviewController");

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

router.route("/").get(getAllProducts);
router
  .route("/createProduct")
  .post(authenticateUser, authorizePermissions("admin"), createProduct);
router.route("/getProduct/:id").get(getSingleProduct);
router.route("/updateProduct/:id").patch(authenticateUser, updateProduct);
router
  .route("/uploadImageProduct")
  .post(authenticateUser, authorizePermissions("admin"), uploadImageProduct);
router.route("/deleteProduct/:id").delete(authenticateUser, deleteProduct);

router.route("/reviews/:id").get(getSingleProductReviews);

module.exports = router;
