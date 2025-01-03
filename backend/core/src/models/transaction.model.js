const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    from: {
      type: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
        email: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
        location: {
          address: {
            type: mongoose.Schema.Types.String,
            required: true,
          },
          coordinates: {
            type: {
              type: mongoose.Schema.Types.String,
              enum: ["Point"],
              default: "Point",
            },
            coordinates: { type: [Number], required: true },
          },
        },
      },
    },
    to: {
      type: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        name: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
        email: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
        location: {
          address: {
            type: mongoose.Schema.Types.String,
            required: true,
          },
          coordinates: {
            type: {
              type: mongoose.Schema.Types.String,
              enum: ["Point"],
              default: "Point",
            },
            coordinates: { type: [Number], required: true },
          },
        },
      },
    },
    status: {
      type: mongoose.Schema.Types.String,
      required: true,
      enum: ["Successful", "Pending", "Failed", "Cancelled"],
      default: "Pending",
    },
    apartment: {
      type: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Apartment",
          required: true,
        },
        title: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
        location: {
          address: {
            type: mongoose.Schema.Types.String,
            required: true,
          },
          coordinates: {
            type: {
              type: mongoose.Schema.Types.String,
              enum: ["Point"],
              default: "Point",
            },
            coordinates: { type: [Number], required: true },
          },
        },
      },
    },
    amount: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    hash: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
