const mongoose = require("mongoose");

const requestsSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: mongoose.Schema.Types.String,
      required: true,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
    apartment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Apartment",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Requests = mongoose.model("Requests", requestsSchema);

module.exports = Requests;
