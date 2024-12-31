const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    payload: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seen: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    type: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      enum: ["message", "booking", "review", "roommateReview"],
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
