const { log } = require("./logger");
const { Server } = require("socket.io");

class SocketClient {
  static instance;
  io;

  constructor() {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }

    this.initSocket();
    SocketClient.instance = this;
  }

  initSocket() {
    try {
      const port = process.env.SOCKET_PORT || 6000;
      const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

      this.io = new Server(port, {
        cors: {
          origin: clientUrl,
          methods: ["GET", "POST"],
        },
      });

      log("info", `✅ Socket server initialized on port ${port}`);

      this.io.on("connection", (socket) => {
        log("info", `✅ A user connected: ${socket.id}`);

        socket.on("message", (data) => {
          this.handleMessage(socket, data);
        });

        socket.on("disconnect", (reason) => {
          log(
            "error",
            `🟠 User disconnected: ${socket.id} - Reason: ${reason}`
          );
        });
      });
    } catch (error) {
      log("error", "⛔️ Failed to initialize socket server:", error);
    }
  }

  handleMessage(socket, data) {
    try {
      const { messageId, content } = data;

      if (!messageId || !content) {
        log("info", "⛔️ Invalid message received:" + JSON.stringify(data));
        return;
      }

      log(
        "info",
        `✅ Message received from ${socket.id} - ID: ${messageId}, Content: ${content}`
      );

      socket.emit("message:ack", { messageId, status: "received" });

      socket.broadcast.emit("message", { messageId, content });
    } catch (error) {
      log("error", "⛔️ Error handling message:" + JSON.stringify(error));
    }
  }

  static getInstance() {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }
}

module.exports = { SocketClient };
