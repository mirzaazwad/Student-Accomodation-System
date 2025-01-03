const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    refreshToken: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      type: mongoose.Schema.Types.Date,
      required: true,
    },
    blacklisted: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
