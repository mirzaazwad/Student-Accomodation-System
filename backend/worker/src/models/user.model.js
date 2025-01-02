const { omit } = require("lodash");
const mongoose = require("mongoose");

const userTypes = ["student", "landlord"];
const otpTypes = ["register", "forgotPassword"];

const userSchema = new mongoose.Schema(
  {
    email: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true,
      minlength: 8,
    },
    username: {
      type: mongoose.Schema.Types.String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    userType: {
      type: mongoose.Schema.Types.String,
      enum: userTypes,
      required: true,
    },
    otp: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    profileCompleted: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    profilePicture: {
      type: mongoose.Schema.Types.String,
    },
    location: {
      type: {
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
      required: false,
    },
    otpType: {
      type: mongoose.Schema.Types.String,
      enum: otpTypes,
      required: true,
    },
    favorites: {
      type: [
        {
          appartmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Apartment",
          },
          title: {
            type: mongoose.Schema.Types.String,
          },
          description: {
            type: mongoose.Schema.Types.String,
          },
          address: {
            type: mongoose.Schema.Types.String,
          },
          rent: {
            type: mongoose.Schema.Types.Number,
          },
          image: {
            type: mongoose.Schema.Types.String,
          },
        },
      ],
      default: [],
      _id: false,
    },
    verified: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
    roommateProfile: {
      type: {
        preferences: {
          gender: {
            type: mongoose.Schema.Types.String,
            enum: ["male", "female", "no preference"],
            default: "no preference",
          },
          lifestyle: {
            type: mongoose.Schema.Types.String,
            enum: ["quiet", "social", "no preference"],
            default: "no preference",
          },
          cleanliness: {
            type: mongoose.Schema.Types.String,
            enum: ["very clean", "moderately clean", "no preference"],
            default: "no preference",
          },
        },
        budget: {
          minRent: { type: mongoose.Schema.Types.Number, default: 0 },
          maxRent: { type: mongoose.Schema.Types.Number, required: true },
        },
      },
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ "roommates.location.coordinates": "2dsphere" });

userSchema.statics.findUserById = async function (id) {
  const user = await this.findById(id);
  if (!user) {
    throw new Error("User not found");
  }
  return omit(user.toJSON(), ["password", "otp", "otpType", "favorites"]);
};

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
  userTypes,
  otpTypes,
};
