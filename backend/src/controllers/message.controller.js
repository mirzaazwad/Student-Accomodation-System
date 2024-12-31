const Message = require("../models/message.model");
const { User } = require("../models/user.model");

const createMessage = async (req, res) => {
  try {
    const { message, receiverId } = req.body;
    const sender = req.user;
    const receiver = await User.findOne({ _id: receiverId });
    const ids = [sender.id, receiverId];
    const sessionId = ids.sort().join("-");
    const newMessage = {
      createdAt: new Date(),
      message,
      sender: {
        id: sender.id,
        username: sender.username,
        profilePicture: sender.profilePicture,
        userType: sender.userType,
        seen: true,
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

    return res.status(201).json({
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Failed to send message: " + error.message,
    });
  }
};

const fetchSession = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const sender = req.user;
    const receiver = await User.findOne({ _id: receiverId });
    const ids = [sender.id, receiverId];
    const sessionId = ids.sort().join("-");
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    const session = await Message.findOne({
      sessionId,
    });
    if (session) {
      return res.status(200).json({
        sessionId,
      });
    }
    await Message.create({
      sessionId,
      users: [
        {
          ...sender,
          id: req.user.id,
        },
        {
          ...receiver,
          id: receiverId,
        },
      ],
    });
    return res.status(201).json({
      sessionId,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create session: " + error.message,
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await Message.find({
      users: {
        $elemMatch: {
          id: req.user.id,
        },
      },
    });
    return res.status(200).json({
      message: "Successfully Fetched Sessions",
      sessions,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch sessions: " + error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.user;
    const ids = [user.id, userId];
    const sessionId = ids.sort().join("-");
    await Message.updateMany(
      {
        sessionId,
        "receiver.id": user.id,
      },
      {
        $set: {
          "receiver.seen": true,
        },
      }
    );
    console.log(sessionId);
    const messages = await Message.findOne({
      sessionId,
    }).sort({ createdAt: -1 });
    console.log(messages);
    return res.status(200).json(messages ? messages.messages : []);
  } catch (error) {
    return res.status(400).json({
      message: "Failed to fetch messages: " + error.message,
    });
  }
};

module.exports = { createMessage, getMessages, fetchSession, getSessions };
