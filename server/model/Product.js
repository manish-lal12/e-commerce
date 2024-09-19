const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
      minlength: 3,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      minlength: 7,
    },
    image: {
      type: String,
      default:
        "https://www.mountaingoatsoftware.com/uploads/blog/2016-09-06-what-is-a-product.png ",
    },
    category: {
      type: String,
    },
    rating: {
      type: String,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    company: {
      type: String,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  // timestamps keep track of created and updated time of document
  // toJSON controls how the document is transformed when it is converted to JSON (while sending response in API), virtuals: true enssures that virtual properties are included in the JSON representation of document
  // toObject controls how the document is transformed when it is converted into plain JavaScript object using toObject(), virtals: true ensures that virtual properties are included in the plain JavaScript object representation of the document
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

// Delete all reviews associated with product
productSchema.statics.deleteProductAndReviews = async function (productId) {
  await this.model("Product").deleteOne({ _id: productId });
  await this.model("Review").deleteMany({ product: productId }); // deletes all documents in Review model whose product {property that stores productId in Review model} is equal to the productId passed in the staticMethod(Called upon model rather than on document instance)
};

module.exports = mongoose.model("Product", productSchema);
