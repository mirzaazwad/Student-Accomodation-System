const Notification = require("../models/notification.model");
const { User } = require("../models/user.model");
const EmailService = require("../providers/email");

class NotificationClient {
  async addNotification(data, isBulk = false) {
    try {
      const notification = new Notification(data);
      await notification.save();
      if (!isBulk) {
        const user = await User.findById(data.receiver);
        if (!user) {
          throw new Error("User not found");
        }
        await EmailService.sendEmail(
          user.email,
          "New Notification for " + data.type,
          data.payload
        );
      } else {
        const users = await User.find({});
        for (const user of users) {
          await EmailService.sendEmail(
            user.email,
            "New Notification for " + data.type,
            data.payload
          );
        }
      }
    } catch (error) {
      throw new Error("Failed to add notification: " + error.message);
    }
  }

  async getNotifications(userId) {
    try {
      const notifications = await Notification.find({
        receiver: userId,
        seen: false,
      });
      return notifications;
    } catch (error) {
      throw new Error("Failed to get notifications: " + error.message);
    }
  }

  async getNotificationCount(userId) {
    try {
      const count = await Notification.countDocuments({
        receiver: userId,
        seen: false,
      });
      return count;
    } catch (error) {
      throw new Error("Failed to get notification count: " + error.message);
    }
  }

  async markAllAsSeen(userId) {
    try {
      await Notification.updateMany({ receiver: userId }, { seen: true });
    } catch (error) {
      throw new Error(
        "Failed to mark all notifications as seen: " + error.message
      );
    }
  }
}

const NotificationHelper = new NotificationClient();
module.exports = NotificationHelper;
