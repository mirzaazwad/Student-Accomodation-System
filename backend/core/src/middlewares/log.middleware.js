const morgan = require("morgan");

const logMiddleware = morgan("dev");

module.exports = logMiddleware;
