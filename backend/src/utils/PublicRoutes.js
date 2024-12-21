const UNPREOTECTED_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/auth/verify-access-token",
  "/health",
];

const isPublicRoute = (path) => UNPREOTECTED_ROUTES.includes(path);

module.exports = {
  isPublicRoute,
};
