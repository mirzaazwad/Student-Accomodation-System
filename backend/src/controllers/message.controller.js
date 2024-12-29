const Message = require("../models/message.model");

const createMessage = async (req, res) => {
  try {
    const { message, receiverId } = req.body;
    const sender = req.user;
    const receiver = await User.findOne({ _id: receiverId });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    await Message.updateOne(
      {
        users: { $all: [sender.id, receiver.id] },
      },
      {
        $push: { messages: message },
        $setOnInsert: {
          sender: {
            id: sender.id,
            username: sender.username,
          },
          receiver: {
            id: receiver.id,
            username: receiver.username,
          },
          users: [sender.id, receiver.id],
        },
      },
      {
        upsert: true,
      }
    );

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to send message: " + error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      users: { $in: [req.user.id, userId] },
    }).sort({ createdAt: -1 });
    return res.status(200).json({
      messages,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch messages: " + error.message,
    });
  }
};

module.exports = { createMessage, getMessages };
