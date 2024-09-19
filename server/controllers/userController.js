const User = require("../model/userModel");
const { StatusCodes } = require("http-status-codes");
const {
  createTokenUser,
  attachCookiesToResponse,
  verifyUser,
  isAuthorized,
  uploadImage,
} = require("../utils");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    if (!users) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No user is available ..." });
    }
    res.status(StatusCodes.OK).json({ users, count: users.length });
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No user with id: ${userId} exists..` });
    }
    try {
      isAuthorized(req.user, user._id);
    } catch (error) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Unauthorized to access this route" });
    }
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const showCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId }).select(
      "-password"
    );
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No user with id: ${req.user.userId} exists..` });
    }
    res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;
    // Handle id email and name is not present in front-end
    const user = await User.findOne({ _id: userId }).select("-password -role");
    user.email = email;
    user.name = name;

    await user.save();
    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const verifyOldPassword = async (req, res) => {
  try {
    const { oldPassword } = req.body;
    const user = await User.findOne({ _id: req.user.userId });
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "Invalid password" });
    }
    let verificationStatus = { status: "verified" };
    verifyUser({ res, verificationStatus });
    return res.status(StatusCodes.OK).json({ msg: "Verified user" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error);
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { status } = req.verificationStatus;
    const { newPassword } = req.body;
    console.log(status);

    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No user with id:${req.user.userId}` });
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Password updated" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    // imageUrl contains unique URL created by cloudinary for the image
    // search login user and update image in DB
    const imageUrl = await uploadImage(req);
    await User.findOneAndUpdate(
      { _id: req.user.userId },
      { image: imageUrl },
      { new: true }
    );
    res.status(StatusCodes.OK).json({ msg: "Image uploaded", image: imageUrl });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findOneAndDelete({ _id: userId });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No user with id: ${req.user.userId} exists..` });
    }
    res.status(StatusCodes.OK).json({ msg: "Deleted user" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    res.cookie("token", "", {
      httpOnly: true,
    });
  }
};
module.exports = {
  getAllUsers,
  getUser,
  showCurrentUser,
  updateUser,
  verifyOldPassword,
  updateUserPassword,
  uploadProfileImage,
  deleteUser,
};
