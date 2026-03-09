import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification
} from "../models/notificationModel.js";

export const getUserNotificationsController = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await getUserNotifications(userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAsReadController = async (req, res) => {
  try {
    const { id } = req.params;
    await markAsRead(id);
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const markAllAsReadController = async (req, res) => {
  try {
    const { userId } = req.params;
    await markAllAsRead(userId);
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNotificationController = async (req, res) => {
  try {
    const { userId, message, type } = req.body;
    const id = await createNotification(userId, message, type);
    res.json({ message: "Notification created", id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
