const jwt = require("jsonwebtoken");
const { isPublicRoute } = require("../utils/PublicRoutes");
const { User } = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
  if (isPublicRoute(req.path)) {
    return next();
  } else {
    try {
      const token = req.header("Authorization");
      if (!token) {
        return res.status(401).json({
          message: "Unauthorized",
        });
      }
      const jwtToken = token.split(" ")[1];
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      const user = await User.findOne({ _id: decoded.id }).select(
        "-password -otp -otpType -favorites -roommates"
      );
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      req.user = {
        ...user,
        ...decoded,
      };
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
};

module.exports = { authMiddleware };
