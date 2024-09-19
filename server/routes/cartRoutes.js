const express = require("express");
const router = express.Router();

//authentication

const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  getAllOrders,
  getOrder,
  createOrder,
  getCurrentUserOrder,
  updateOrder,
  deleteOrder,
  checkOutOrder,
} = require("../controllers/cartController");

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllOrders);
router.route("/createOrder").post(authenticateUser, createOrder);
router.route("/getCurrentUserOrder").get(authenticateUser, getCurrentUserOrder);
router.route("/updateOrder/:id").patch(authenticateUser, updateOrder);
router.route("/deleteOrder/:id").delete(authenticateUser, deleteOrder);
router.route("/create-intent").post(checkOutOrder);
router.route("/:id").get(authenticateUser, getOrder);

module.exports = router;
