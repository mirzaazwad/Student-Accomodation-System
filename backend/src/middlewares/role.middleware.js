const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user.userType !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

module.exports = { roleMiddleware };
