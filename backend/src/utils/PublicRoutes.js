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
