const User = require("../models/user");

getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "Failed to update profile" });
  }
};

module.exports = { getProfile, updateProfile };
