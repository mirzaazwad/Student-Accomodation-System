const { log } = require("../providers/logger");

/**
 * Handle incoming messages from a connected socket
 * @param {Object} socket - Socket instance
 * @param {Object} data - Message data
 */
const handleChatMessage = (socket, data) => {
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
};

module.exports = {
  handleChatMessage,
};
