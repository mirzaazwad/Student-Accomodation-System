const { EventHandler } = require("../utils/EventHandler");
const { log } = require("./logger");
const { Server } = require("socket.io");

class SocketClient {
  static instance = null;
  io = null;
  socket = null;
  constructor() {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }
    SocketClient.instance = this;
  }

  /**
   * Initialize the Socket.io server
   * @param {number} port - The port number to listen on
   * @param {string} origin - The origin URL to allow connections from
   * @param {Function} callback - The callback function to execute after initialization
   * @returns {void}
   */
  connect(port, origin, callback = () => {}) {
    try {
      this.io = new Server({
        cors: {
          origin: [origin.split(",").map((url) => url.trim())],
          methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        },
      });

      this.io.listen(port);
      callback();

      this.io.on("connect_error", (error) => {
        log("error", `⛔️ Socket connection error: ${error.message}`);
      });

      this.io.on("connection", (socket) => {
        log("info", `✅ A user connected: ${socket.id}`);

        for (const handler of EventHandler) {
          socket.on(handler.event, (data) => handler.consumer(socket, data));
        }

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
