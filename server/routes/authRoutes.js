const express = require("express");
const router = express.Router();

const { login, signUp, logOut } = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signUp);
router.post("/logout", logOut);

module.exports = router;
