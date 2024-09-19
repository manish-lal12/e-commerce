const mongoose = require("mongoose");

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("DB attached");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
