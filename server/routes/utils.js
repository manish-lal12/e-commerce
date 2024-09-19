const express = require("express");
const router = express.Router();
const uploadImage = require("../utils/uploadImage");

router.route("/uploadImage").post(uploadImage);

module.exports = router;
