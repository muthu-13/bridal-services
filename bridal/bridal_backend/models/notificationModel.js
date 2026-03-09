import db from "../config/db.js";

export const getUserNotifications = async (userId) => {
  const [rows] = await db.promise().query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
};

export const markAsRead = async (notificationId) => {
  const [result] = await db
    .promise()
    .query("UPDATE notifications SET is_read = 1 WHERE id = ?", [notificationId]);
  return result;
};

export const markAllAsRead = async (userId) => {
  const [result] = await db
    .promise()
    .query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [userId]);
  return result;
};

export const createNotification = async (userId, message, type = "general") => {
  const [result] = await db
    .promise()
    .query(
      "INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)",
      [userId, message, type]
    );
  return result.insertId;
};
