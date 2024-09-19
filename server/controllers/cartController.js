const { StatusCodes } = require("http-status-codes");
const Cart = require("../model/Cart");
const Product = require("../model/Product");
const stripe = require("stripe")(process.env.STRIPE_S_KEY);

const isAuthorized = require("../utils/checkPermission");

//payment Integration
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    const orderDetails = await Cart.calculateOrder(items);

    const order = await Cart.create({
      user: req.user.userId,
      orderItems: orderDetails.orderItems,
      total: orderDetails.total,
      subTotal: orderDetails.subTotal,
      tax: orderDetails.tax,
      shippingFee: orderDetails.shippingFee,
      clientSecret: orderDetails.clientSecret,
    });
    res
      .status(StatusCodes.CREATED)
      .json({ order, clientSecret: order.clientSecret });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Cart.find({});
    if (!orders) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No order available" });
    }
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const order = await Cart.findById(orderId);
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No order with id:${id} exists` });
    }
    isAuthorized(req.user, order.user);
    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const getCurrentUserOrder = async (req, res) => {
  try {
    const order = await Cart.find({ user: req.user.userId });
    if (!order || order.length < 1) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No order for user with id:${req.user.userId} exists` });
    }
    res.status(StatusCodes.OK).json(order);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { items } = req.body;

    const order = await Cart.findOne({ _id: orderId });

    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No order with id:${orderId} exists` });
    }
    isAuthorized(req.user, order.user);
    const orderDetails = await Cart.calculateOrder(items);

    order.orderItems = orderDetails.orderItems;
    order.total = orderDetails.total;
    order.subTotal = orderDetails.subTotal;
    order.tax = orderDetails.tax;
    order.shippingFee = orderDetails.shippingFee;
    order.clientSecret = orderDetails.clientSecret;

    await order.save();
    // isAuthorized(req.user, order.user);

    res.status(StatusCodes.OK).json({ msg: "Updated Success", order });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;

    const order = await Cart.findOne({ _id: orderId });
    if (!order) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: `No order with id: ${orderId} exists..` });
    }
    isAuthorized(req.user, order.user);
    await order.deleteOne({ _id: orderId });
    res.status(StatusCodes.OK).json({ msg: "Order deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

const checkOutOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const { total } = await Cart.findOne({ _id: orderId });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    await Cart.findOneAndUpdate({ _id: orderId }, { status: "paid" });
    res
      .status(StatusCodes.OK)
      .json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getCurrentUserOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  checkOutOrder,
};
