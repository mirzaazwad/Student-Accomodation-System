const { User } = require("../models/user.model");
const Apartment = require("../models/appartment.model");
const bcrypt = require("bcrypt");

const addProfilePicture = async (req, res) => {
  try {
    const { user, file } = req;
    user.profilePicture = file.path;
    await User.updateOne({ _id: user.id }, { profilePicture: file.path });
    return res.status(200).json({
      message: "Profile Picture Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed To Add Profile Picture: " + error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findOne({ _id: req.user.id });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw Error("Invalid Old Password");
    }
    user.password = newPassword;
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
    const { preferences, location, budget, moveInDate } = req.body.roommates;

    if (!preferences || !location || !budget || !moveInDate) {
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
      location: {
        address: location.address,
        coordinates: location.coordinates,
      },
      budget: {
        minRent: budget.minRent || 0,
        maxRent: budget.maxRent,
      },
      moveInDate,
    };
    await User.updateOne(
      { _id: user._id },
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
    user.favoriteApartments.push(appartment);
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

module.exports = {
  addProfilePicture,
  changePassword,
  roommateInformation,
  addFavoriteAppartment,
  getUserById,
  getUser,
};
