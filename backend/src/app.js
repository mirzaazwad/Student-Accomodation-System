const { log } = require("./providers/logger");
const { app } = require("./providers/server");
const { MongoDBClient } = require("./providers/mongodb");
const dotenv = require("dotenv");
const { SocketClient } = require("./providers/socket");
dotenv.config();

MongoDBClient.getInstance().connect(async () => {
  SocketClient.getInstance();
  app.listen(process.env.PORT, () => {
    const port = process.env.PORT;
    const env = process.env.NODE_ENV;
    const version = process.env.npm_package_version;
    log(
      "info",
      `✅ HTTP server is running on port: ${port} | env: ${env} | version: ${version}`
    );
  });
});

process.on("unhandledRejection", (reason, promise) => {
  log("info", "Unhandled Rejection:" + "reason:" + reason);
});

process.on("uncaughtException", (err) => {
  if (err.code === "ECONNRESET") {
    log("error", "Uncaught ECONNRESET error:" + JSON.stringify(err));
  } else {
    log("error", "Uncaught exception:" + JSON.stringify(err));
  }
});
