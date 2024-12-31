const mongoose = require("mongoose");

const roommateReviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: mongoose.Schema.Types.Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: { type: mongoose.Schema.Types.String, trim: true },
  },
  {
    timestamps: true,
  }
);

const RoommateReview = mongoose.model("RoommateReview", roommateReviewSchema);

module.exports = RoommateReview;
