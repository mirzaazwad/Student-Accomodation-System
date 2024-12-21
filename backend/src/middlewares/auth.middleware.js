const jwt = require("jsonwebtoken");
const { isPublicRoute } = require("../utils/PublicRoutes");

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
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  }
};

module.exports = { authMiddleware };
