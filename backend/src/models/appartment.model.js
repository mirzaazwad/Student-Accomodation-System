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
    amenities: {
      type: [mongoose.Schema.Types.String],
      default: [],
    },
    images: {
      type: [mongoose.Schema.Types.String],
      default: [],
    },
    availabilityStatus: {
      type: mongoose.Schema.Types.String,
      enum: ["Available", "Occupied"],
      default: "Available",
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
  },
  {
    timestamps: true,
  }
);

apartmentSchema.index({ "location.coordinates": "2dsphere" });

const Apartment = mongoose.model("Apartment", apartmentSchema);

module.exports = Apartment;
