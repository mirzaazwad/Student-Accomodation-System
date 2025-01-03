const UNPREOTECTED_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/verify-access-token",
  "/auth/logout",
  "/health",
  "/upload",
  "/transaction/success",
  "/transaction/fail",
  "/transaction/cancel",
  "/transaction/ipn",
];

const isPublicRoute = (path) => {
  for (const route of UNPREOTECTED_ROUTES) {
    if (path.includes(route)) {
      return true;
    }
  }
  return false;
};

module.exports = {
  isPublicRoute,
};
