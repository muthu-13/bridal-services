import express from "express";
import {
  getUserNotificationsController,
  markAsReadController,
  markAllAsReadController,
  createNotificationController
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/user/:userId", getUserNotificationsController);
router.patch("/read/:id", markAsReadController);
router.patch("/readall/:userId", markAllAsReadController);
router.post("/", createNotificationController);

export default router;
