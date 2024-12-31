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

      log("info", `✅ Socket server initialized on port ${port}`);
      this.io.on("connect_error", (error) => {
        log("error", `⛔️ Socket connection error: ${error.message}`);
      });

      this.io.on("connection", (socket) => {
        log("info", `✅ A user connected: ${socket.id}`);

        socket.on("message", (data) => this.handleMessage(socket, data));

        socket.on("disconnect", (reason) => {
          log("warn", `🟠 User disconnected: ${socket.id} - Reason: ${reason}`);
        });
      });
    } catch (error) {
      log("error", `⛔️ Failed to initialize socket server: ${error.message}`);
    }
  }

  /**
   * Handle incoming messages from a connected socket
   * @param {Object} socket - Socket instance
   * @param {Object} data - Message data
   */
  handleMessage(socket, data) {
    try {
      if (!data || typeof data !== "object") {
        log("warn", `⛔️ Invalid message format: ${JSON.stringify(data)}`);
        return;
      }

      const { sessionId, content } = data;
      if (!sessionId || !content) {
        log(
          "warn",
          `⛔️ Missing sessionId or content in message: ${JSON.stringify(data)}`
        );
        return;
      }

      log(
        "info",
        `✅ Message received from ${socket.id} - ID: ${sessionId}, Content: ${content}`
      );

      // Acknowledge the message
      socket.emit("message:ack", { sessionId, status: "received" });

      // Broadcast the message to other clients
      socket.broadcast.emit("message", { sessionId, content });
    } catch (error) {
      log("error", `⛔️ Error handling message: ${error.message}`);
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
