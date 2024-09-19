const User = require("../model/userModel");
const { StatusCodes } = require("http-status-codes");
const {
  uploadImage,
  attachCookiesToResponse,
  createTokenUser,
} = require("../utils");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Invalid credentials" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Incorrect password" });
    }
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(200).json({ user: tokenUser, msg: "Login" });
  } catch (error) {
    res.status(StatusCodes.OK).json(error);
  }
};

const signUp = async (req, res) => {
  try {
    if (req.files) {
      const imageUrl = await uploadImage(req);
      req.body.image = imageUrl;
    }
    const { name, email, password, image } = req.body;
    const doesEmailAlreadyExists = await User.findOne({ email });

    if (doesEmailAlreadyExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "This email is already registered" });
    }

    //first registered user is admin
    const isFirstUser = (await User.countDocuments({})) === 0;
    const role = isFirstUser ? "admin" : "user";

    const user = await User.create({
      name,
      email,
      password,
      role,
      image,
    });
    // const tokenUser = createTokenUser(user);
    // attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json(user);
  } catch (error) {
    console.log(error);
  }
};

const logOut = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("verificationToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
};

module.exports = { login, signUp, logOut };
