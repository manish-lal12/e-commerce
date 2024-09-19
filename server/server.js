const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

require("dotenv").config();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const connectDB = require("./db/connectDB");

//routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const cartRouter = require("./routes/cartRoutes");
const uploadImageRouter = require("./routes/utils");

const { StatusCodes } = require("http-status-codes");

//middlewares
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET));

//middleware (serve static files)
app.use(express.static(path.join(__dirname, "../app/dist")));
console.log(path.join(__dirname, "../app/dist"));

app.use(fileUpload());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1", uploadImageRouter);

//test route
app.get("/api/v1/completePayment", async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "Payment Successs" });
});

// handle react-router (internal)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../app/dist", "/index.html"));
});

const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port} ..`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
