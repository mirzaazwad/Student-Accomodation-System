const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
    },
    description: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
    },
    location: {
      address: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
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
    roomType: {
      type: mongoose.Schema.Types.String,
      enum: ["Single", "Shared", "Studio", "Other"],
      required: true,
    },
    rent: {
      type: Number,
      required: true,
      min: 0,
    },
    availabilityStatus: {
      type: mongoose.Schema.Types.String,
      enum: ["Available", "Unavailable"],
      default: "Unavailable",
    },
    amenities: {
      type: [mongoose.Schema.Types.String],
      default: [],
    },
    images: {
      type: [mongoose.Schema.Types.String],
      default: [],
    },
    reviews: [
      {
        student: {
          type: {
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
        rating: {
          type: mongoose.Schema.Types.Number,
          min: 1,
          max: 5,
          required: true,
        },
        comment: { type: mongoose.Schema.Types.String, trim: true },
        createdAt: { type: mongoose.Schema.Types.Date, default: Date.now },
      },
    ],
    bookings: [
      {
        student: {
          type: {
            id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            username: {
              type: mongoose.Schema.Types.String,
            },
          },
        },
        roommates: [
          {
            type: {
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
            },
          },
        ],
        checkIn: { type: mongoose.Schema.Types.Date, required: true },
        checkOut: { type: mongoose.Schema.Types.Date, required: true },
        status: {
          type: mongoose.Schema.Types.String,
          enum: ["Paid", "Approved", "Pending", "Rejected", "Confirm"],
          default: "Pending",
        },
        rejectionReason: { type: mongoose.Schema.Types.String, trim: true },
        createdAt: { type: mongoose.Schema.Types.Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
