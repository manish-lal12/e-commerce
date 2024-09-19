const { StatusCodes } = require("http-status-codes");
const Review = require("../model/Review");
const Product = require("../model/Product");
const isAuthorized = require("../utils/checkPermission");

const createReview = async (req, res) => {
  try {
    const { product: productId, title, description, rating } = req.body;

    const isValidProduct = await Product.findOne({ _id: productId });
    if (!isValidProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product with id: ${productId} exists` });
    }
    const alreadySubmitted = await Product.findOne({
      product: productId,
      user: req.user.userId,
    });
    if (alreadySubmitted) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Review already submitted by the user" });
    }
    req.body.user = req.user.userId;
    const review = await Review.create({
      user: req.body.user,
      title,
      description,
      rating,
      product: productId,
    });
    // await Review.calculateAverageRatings();
    res.status(StatusCodes.OK).json(review);
  } catch (error) {
    if (error.code === 11000) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Review already submitted by the user" });
    } else {
      console.log(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: "An error occurred" });
    }
  }
};

const getReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id });
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No review with id:${req.params.id} exists` });
    }
    isAuthorized(req.user, review.user);
    res.status(StatusCodes.OK).json(review);
  } catch (error) {
    console.log(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    if (!reviews[0]) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No reviews available" });
    }
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getCurrentUserReview = async (req, res) => {
  try {
    const review = await Review.find({ user: req.user.userId });
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No reviews available of user: ${req.user.userId}` });
    }
    res.status(StatusCodes.OK).json({ review });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, title, description } = req.body;
    const review = await Review.findOne({ _id: req.params.id });
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No review with id:${req.params.id} exists` });
    }
    isAuthorized(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.description = description;

    await review.save();
    res.status(StatusCodes.OK).json(review);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id });
    if (!review) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No review with id: ${req.params.id} exists` });
    }
    isAuthorized(req.user, review.user);
    await review.deleteOne();
    res.status(StatusCodes.OK).json({ msg: "Review deleted successfully" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getSingleProductReviews = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const reviews = await Review.find({ product: productId });
    if (!reviews) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No review available" });
    }
    res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReview,
  getCurrentUserReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
