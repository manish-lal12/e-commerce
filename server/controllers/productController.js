const { StatusCodes } = require("http-status-codes");
const Product = require("../model/Product");
const uploadImage = require("../utils/uploadImage");

const createProduct = async (req, res) => {
  try {
    req.body.user = req.user.userId; // saves userId in user property of Product model
    if (req.files) {
      const imageUrl = await uploadImage(req);
      req.body.image = imageUrl;
    }
    const product = await Product.create(req.body);

    res.status(StatusCodes.CREATED).json(product);
  } catch (error) {
    console.log(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId }).populate(
      "reviews"
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product with id:${id} exists` });
    }
    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length === 0) {
    }
    if (!products[0]) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product available` });
    }
    res.status(StatusCodes.OK).json({ products, count: products.length });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOneAndUpdate(
      { _id: productId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product with id:${productId} exists` });
    }
    res.status(StatusCodes.OK).json(product);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product with id:${productId} exists` });
    }
    await Product.deleteProductAndReviews(productId);
    res.status(StatusCodes.OK).json({ msg: "Product deleted" });
  } catch (error) {
    // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    console.log(error);
  }
};

const uploadImageProduct = async (req, res) => {
  try {
    const imageUrl = await uploadImage(req);

    const { id: productId } = req.body;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No product with id:${productId} exists` });
    }
    await Product.findOneAndUpdate(
      { _id: productId },
      { image: imageUrl },
      { runValidators: true, new: true }
    );
    res.status(StatusCodes.OK).json({ msg: "Image uploaded" });
  } catch (error) {
    console.log(error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  uploadImageProduct,
  deleteProduct,
};
