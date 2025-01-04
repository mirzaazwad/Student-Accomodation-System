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
        username: {
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
        username: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
        email: {
          type: mongoose.Schema.Types.String,
          required: true,
        },
      },
    },
    status: {
      type: mongoose.Schema.Types.String,
      enum: ["VALID", "FAILED", "CANCELLED", "PENDING"],
      default: "PENDING",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
    transaction: {
      type: {
        bankTransactionId: {
          type: mongoose.Schema.Types.String,
        },
        cardIssuer: {
          type: mongoose.Schema.Types.String,
        },
        cardBrand: {
          type: mongoose.Schema.Types.String,
        },
        cardType: {
          type: mongoose.Schema.Types.String,
        },
        cardCountryCode: {
          type: mongoose.Schema.Types.String,
        },
        failedReason: {
          type: mongoose.Schema.Types.String,
        },
      },
      required: false,
    },
    amount: {
      type: mongoose.Schema.Types.Number,
      required: true,
    },
    hash: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    currency: {
      type: mongoose.Schema.Types.String,
      default: "BDT",
    },
    gatewayUrl: {
      type: mongoose.Schema.Types.String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
