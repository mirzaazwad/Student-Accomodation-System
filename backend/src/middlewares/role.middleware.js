const { getUserById } = require("../controllers/user.controller");
const roleMiddleware = (role) => {
  return async (req, res, next) => {
    const user = await getUserById(req.user.id);

    if (user.userType !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { roleMiddleware };
