//user
//product
//Ref
const mongoose = require("mongoose");
const Product = require("./Product");

const singleOrderItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  itemTotal: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const cartSchema = new mongoose.Schema(
  {
    tax: {
      type: Number,
      required: true,
      default: 8,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 100,
    },
    subTotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [singleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "cancelled"],
      default: "pending",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    clientSecret: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
    },
  },
  { timestamps: true }
);

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "clientSecretValue";
  return { client_secret, amount };
};

cartSchema.statics.calculateOrder = async function (items) {
  let orderItems = [];
  let subTotal = 0;

  for (const eachProduct of items) {
    const { product: productId } = eachProduct;
    const dbProduct = await Product.findOne({ _id: productId });
    const { name, price, image, _id } = dbProduct;
    let itemTotal = eachProduct.amount * price;
    const singleOrderItem = {
      amount: eachProduct.amount,
      name,
      price,
      image,
      product: _id,
      itemTotal,
    };
    orderItems = [...orderItems, singleOrderItem];
    // calculate subtotal
    subTotal += eachProduct.amount * price;
  }

  const taxPercent = 8;
  let shippingFee = 100;
  const tax = Number(((taxPercent * subTotal) / 100).toFixed(2));

  if (subTotal + tax > 200) {
    shippingFee = 0;
  }
  let total = Math.ceil(subTotal + tax + shippingFee);
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: "usd",
  });
  return {
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
  };
};

module.exports = mongoose.model("Cart", cartSchema);
