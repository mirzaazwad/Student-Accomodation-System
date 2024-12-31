const mongoose = require("mongoose");
const { userTypes } = require("./user.model");

const messageSchema = new mongoose.Schema(
  {
    messages: [
      {
        type: {
          message: mongoose.Schema.Types.String,
          createdAt: mongoose.Schema.Types.Date,
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
            profilePicture: {
              type: mongoose.Schema.Types.String,
            },
            userType: {
              type: mongoose.Schema.Types.String,
              required: true,
              enum: userTypes,
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
            profilePicture: {
              type: mongoose.Schema.Types.String,
            },
            userType: {
              type: mongoose.Schema.Types.String,
              required: true,
              enum: userTypes,
            },
          },
        },
      },
    ],
    users: {
      type: [
        {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          username: {
            type: mongoose.Schema.Types.String,
            required: true,
          },
          profilePicture: {
            type: mongoose.Schema.Types.String,
          },
          userType: {
            type: mongoose.Schema.Types.String,
            required: true,
            enum: userTypes,
          },
        },
      ],
    },
    sessionId: {
      type: mongoose.Schema.Types.String,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
