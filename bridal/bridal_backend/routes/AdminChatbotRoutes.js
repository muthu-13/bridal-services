import express from "express";
import { getAdminChatResponse } from "../controllers/AdminChatbotController.js";

const router = express.Router();

// POST /api/adminChatbot/chat
router.post("/chat", async (req, res) => {
  const { message, admin } = req.body;

  if (!message) return res.status(400).json({ reply: "Message is required." });
  if (!admin) return res.status(401).json({ reply: "Admin login required." });

  try {
    const response = await getAdminChatResponse(message, admin);
    res.json(response); // response already has { reply: "..." }
  } catch (err) {
    console.error("Admin Chatbot Error:", err);
    res.status(500).json({ reply: "Something went wrong." });
  }
});

export default router;
