const dotenv = require("dotenv");
const { SocketClient } = require("./providers/socket");
const { MongoDBClient } = require("./providers/mongodb");
const { log } = require("./providers/logger");
dotenv.config();

MongoDBClient.getInstance().connect(async () => {
  const socket = SocketClient.getInstance();
  socket.connect(process.env.PORT, process.env.ORIGIN, () => {
    const port = process.env.PORT;
    const env = process.env.NODE_ENV;
    const version = process.env.npm_package_version;
    const origin = process.env.ORIGIN;
    log(
      "info",
      `✅ Socket server is running on port: ${port} | env: ${env} | version: ${version} | origin: ${origin}`
    );
  });
});
