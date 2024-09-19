const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: [100, "Review title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      minlength: 10,
      maxlength: 120,
      required: [true, "Please provide review text"],
    },
    rating: {
      type: Number,
      default: 1,
      required: [true, "Please provide rating"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// enforces one user can leave only one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } }, // 1st stage
    {
      $group: {
        //2nd stage
        _id: null,
        averageRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  console.log(result);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: productId },
      {
        rating: Math.ceil(result[0]?.averageRating || 0),
        numOfReviews: result[0]?.numOfReviews || 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.product);
  console.log("Post save hook called");
});

// here {document: true, query: false} specifies it is a document middleware and not a query middleware, it is called on a document instance (review) and not on Model itself (Review),
// some document middlewares: "save", "remove", "updateOne", "deleteOne"
// some query middlewares: "findOneAndUpdate", "findOneAndDelete", "update" [when they are called as static methods on the model]
reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.constructor.calculateAverageRating(this.product);
    // this ensures that averageRating of product is calculated each time a document instance containing review of the product is deleted
    // this.constructor refers to the mongoose model associated with the document (here, Review)
  }
);

module.exports = mongoose.model("Review", reviewSchema);
