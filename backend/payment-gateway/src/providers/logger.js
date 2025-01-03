const { Logger, transports, format } = require("winston");
const path = require("path");

const logger = new Logger({
  format: format.combine(
    format.timestamp(),
    format.json(),
    format.printf(
      (info) =>
        `${info.timestamp} ${info.level}: ${info.message}` +
        (info.splat !== undefined ? `${info.splat}` : " ")
    )
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      level: "error",
      filename: path.resolve(__dirname, "../../report/log/error.log"),
    }),
    new transports.File({
      level: "info",
      filename: path.resolve(__dirname, "../../report/log/activity.log"),
    }),
  ],
});

/**
 *
 * @param {*} level Can be 'info', 'error', 'warn', 'debug'
 * @param {*} message Any string message you want to log
 * @param {*} meta Any additional data you want to log
 */
const log = (level, message, meta) => {
  logger.log(level, message, meta);
};

module.exports = { log };
