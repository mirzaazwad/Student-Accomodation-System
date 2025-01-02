const { handleChatMessage } = require("../events/message.events");
const { log } = require("./logger");
const { Server } = require("socket.io");

class SocketClient {
  static instance = null;
  io = null;
  constructor() {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }

    this.initSocket();
    SocketClient.instance = this;
  }

  /**
   * Initialize the Socket.io server
   */
  initSocket() {
    try {
      const port = process.env.SOCKET_PORT || 6000;
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

      this.io = new Server({
        cors: {
          origin: clientUrl,
          methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        },
      });

      this.io.listen(port);

      const env = process.env.NODE_ENV;
      const version = process.env.npm_package_version;
      log(
        "info",
        `✅ Socket server is running on port: ${port} | env: ${env} | version: ${version}`
      );
      this.io.on("connect_error", (error) => {
        log("error", `⛔️ Socket connection error: ${error.message}`);
      });

      this.io.on("connection", (socket) => {
        log("info", `✅ A user connected: ${socket.id}`);

        socket.on("message", (data) => handleChatMessage(socket, data));

        socket.on("disconnect", (reason) => {
          log("warn", `🟠 User disconnected: ${socket.id} - Reason: ${reason}`);
        });
      });
    } catch (error) {
      log("error", `⛔️ Failed to initialize socket server: ${error.message}`);
    }
  }

  /**
   * Get or create the singleton instance of SocketClient
   * @returns {SocketClient} The SocketClient instance
   */
  static getInstance() {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  /**
   * Disconnect the Socket.io server
   */
  async disconnect() {
    try {
      if (this.io) {
        this.io.close();
        log("warn", `🟠 Socket server disconnected`);
      }
    } catch (error) {
      log("error", `⛔️ Socket server disconnection failed: ${error.message}`);
    }
  }

  /**
   * Get the Socket.io server instance
   * @returns {Server} The Socket.io server instance
   */
  getServer() {
    return this.io;
  }
}

module.exports = { SocketClient };
