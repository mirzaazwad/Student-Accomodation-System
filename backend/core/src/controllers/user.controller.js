const { User } = require("../models/user.model");
const Apartment = require("../models/appartment.model");
const bcrypt = require("bcrypt");
const NotificationHelper = require("../utils/NotificationClient");
const { omit } = require("lodash");
const StorageClient = require("../providers/storage");
const fs = require("fs");

const addProfilePicture = async (req, res) => {
  try {
    const { user, file } = req;
    const { public_id } = await StorageClient.uploadFromPath(file.path);
    const url = await StorageClient.getUrlByFileKey(public_id);
    user.profilePicture = url;
    await User.updateOne({ _id: user.id }, { profilePicture: url });
    fs.unlinkSync(file.path);
    return res.status(200).json({
      message: "Profile Picture Added Successfully",
      profilePicture: url,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Add Profile Picture: " + error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { user } = req;
    const { username, location } = req.body;
    if (!username || !location) {
      return res.status(400).json({
        message: "Username and Location are required.",
      });
    }
    const updatedUser = {
      username,
      location,
    };
    const updateResult = await User.updateOne(
      { _id: user.id },
      { $set: updatedUser }
    );
    return res.status(200).json({
      message: "Profile Updated Successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Update Profile: " + error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findOne({ _id: req.user.id });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw Error("Invalid Old Password");
    }
    if (newPassword !== confirmPassword) {
      throw Error("Passwords do not match");
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({
      message: "Password Changed Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Change Password: " + error.message,
    });
  }
};

const roommateInformation = async (req, res) => {
  try {
    const { user } = req;
    const { preferences, budget } = req.body;

    if (!preferences || !budget) {
      return res.status(400).json({
        message:
          "All roommate attributes (preferences, location, budget, moveInDate) are required.",
      });
    }

    const updatedRoommateInfo = {
      preferences: {
        gender: preferences.gender || "no preference",
        lifestyle: preferences.lifestyle || "no preference",
        cleanliness: preferences.cleanliness || "no preference",
      },
      budget: {
        minRent: budget.minRent || 0,
        maxRent: budget.maxRent,
      },
    };
    const updateResult = await User.updateOne(
      { _id: user.id },
      { $set: { roommateProfile: updatedRoommateInfo } }
    );
    return res.status(200).json({
      message: "Roommate Information Added Successfully",
      roommates: updatedRoommateInfo,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Add Roommate Information: " + error.message,
    });
  }
};

const addFavoriteAppartment = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const { apartmentId } = req.body;
    if (!apartmentId) {
      return res.status(400).json({
        message: "Apartment ID is required.",
      });
    }
    const appartment = await Apartment.findOne({ _id: apartmentId });

    if (
      user.favorites
        .map((favorite) => favorite.appartmentId)
        .includes(apartmentId)
    ) {
      return res.status(400).json({
        message: "Apartment already added to favorites.",
      });
    }
    user.favorites.push({
      appartmentId: apartmentId,
      title: appartment.title,
      description: appartment.description,
      address: appartment.location.address,
      rent: appartment.rent,
      image: appartment.images[0],
    });
    await user.save();
    return res.status(200).json({
      message: "Apartment added to favorites successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to add apartment to favorites: " + error.message,
    });
  }
};

const removeFromFavorites = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const { apartmentId } = req.body;
    if (!apartmentId) {
      return res.status(400).json({
        message: "Apartment ID is required.",
      });
    }
    const appartment = await Apartment.findOne({
      _id: apartmentId,
    });
    if (!appartment) {
      return res.status(400).json({
        message: "Apartment not found.",
      });
    }
    if (
      !user.favorites
        .map((favorite) => favorite.appartmentId.toString())
        .includes(apartmentId)
    ) {
      return res.status(400).json({
        message: "Apartment not in favorites.",
      });
    }
    user.favorites = user.favorites.filter(
      (favorite) => favorite.appartmentId.toString() !== apartmentId
    );
    await user.save();
    return res.status(200).json({
      message: "Apartment removed from favorites successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to remove apartment from favorites: " + error.message,
    });
  }
};

const getUserById = async (userID) => {
  try {
    const user = await User.findOne({ _id: userID }).select(
      "-password -otp -otpType"
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
};

const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch user: " + error.message,
    });
  }
};

const fetchNotificationCount = async (req, res) => {
  try {
    const notifications = await NotificationHelper.getNotificationCount(
      req.user.id
    );
    return res.status(200).json(notifications);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch notifications: " + error.message,
    });
  }
};

const findRoommates = async (req, res) => {
  try {
    const { preferences, budget, search } = req.body;

    if (!preferences || !budget) {
      return res.status(400).json({
        message:
          "All roommate attributes (preferences, location, budget, moveInDate) are required.",
      });
    }

    const roommates = await User.find({
      username: { $regex: search, $options: "i" },
      userType: "student",
      "roommateProfile.budget.maxRent": { $gte: budget.minRent },
      "roommateProfile.budget.minRent": { $lte: budget.maxRent },
    });

    const calculateJaccardSimilarity = (setA, setB) => {
      const intersection = new Set([...setA].filter((x) => setB.has(x)));
      const union = new Set([...setA, ...setB]);
      return intersection.size / union.size;
    };

    const matches = roommates.map((roommate) => {
      const roommatePreferences = roommate.roommateProfile?.preferences || {};
      const inputPreferences = {
        gender: preferences.gender || "no preference",
        lifestyle: preferences.lifestyle || "no preference",
        cleanliness: preferences.cleanliness || "no preference",
      };

      const preferenceKeys = Object.keys(inputPreferences);
      const setA = new Set(preferenceKeys.map((key) => inputPreferences[key]));
      const setB = new Set(
        preferenceKeys.map((key) => roommatePreferences[key])
      );

      const similarity = calculateJaccardSimilarity(setA, setB);

      return {
        roommate: omit(roommate.toJSON(), ["password", "otp", "otpType"]),
        similarity,
      };
    });

    const topMatches = matches
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6);

    return res.status(200).json({
      topRoommates: topMatches.map(({ roommate, similarity }) => ({
        ...roommate,
        similarity,
      })),
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to find roommates: " + error.message,
    });
  }
};

module.exports = {
  addProfilePicture,
  changePassword,
  roommateInformation,
  addFavoriteAppartment,
  getUserById,
  updateProfile,
  removeFromFavorites,
  getUser,
  fetchNotificationCount,
  findRoommates,
};
