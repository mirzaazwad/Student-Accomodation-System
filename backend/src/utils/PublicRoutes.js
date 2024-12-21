const UNPREOTECTED_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/verify",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/refresh",
  "/health",
];

const isPublicRoute = (path) => UNPREOTECTED_ROUTES.includes(path);

module.exports = {
  isPublicRoute,
};
