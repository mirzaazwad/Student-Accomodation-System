const { log } = require("../providers/logger");
const Message = require("../models/message.model");
const { User } = require("../models/user.model");
const NotificationHelper = require("../utils/NotificationClient");

/**
 * Handle incoming messages from a connected socket
 * @param {Object} socket - Socket instance
 * @param {Object} data - Message data
 */
const handleChatMessage = async (socket, data) => {
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

    socket.emit("chat:ack", { sessionId, status: "received" });
    const { message, receiverId, username, userType, id, profilePicture } =
      content;
    const receiver = await User.findOne({ _id: receiverId });
    const newMessage = {
      createdAt: new Date(),
      message,
      sender: {
        id,
        username: username,
        profilePicture: profilePicture,
        userType: userType,
      },
      receiver: {
        id: receiverId,
        username: receiver.username,
        profilePicture: receiver.profilePicture,
        userType: receiver.userType,
      },
    };
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    await Message.updateOne(
      {
        sessionId,
      },
      {
        $push: {
          messages: {
            ...newMessage,
          },
        },
      },
      {
        upsert: true,
      }
    );
    await NotificationHelper.addNotification({
      payload: message,
      receiver: receiverId,
      type: "Message",
    });
    socket.broadcast.emit("chat", { sessionId, content });
  } catch (error) {
    log("error", `⛔️ Error handling message: ${error.message}`);
  }
};

module.exports = {
  handleChatMessage,
};
