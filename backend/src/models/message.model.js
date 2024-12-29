const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    messages: [
      {
        type: mongoose.Schema.Types.String,
        required: true,
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    sender: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
    },
    receiver: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      username: {
        type: mongoose.Schema.Types.String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
