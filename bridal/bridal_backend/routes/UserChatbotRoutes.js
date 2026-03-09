import express from "express";
import { getUserChatResponse } from "../controllers/UserChatbotController.js";

const router = express.Router();

// POST /api/userChatbot/chat
router.post("/chat", async (req, res) => {
  const { message, user } = req.body; // send full user object from frontend

  if (!message) {
    return res.status(400).json({ reply: "Message is required." });
  }

  try {
    const response = await getUserChatResponse(message, user || null);
    res.json(response); // { reply: "...", buttons: [...] }
  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({ reply: "Something went wrong.", buttons: [] });
  }
});

export default router;
