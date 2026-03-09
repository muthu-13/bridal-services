import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

export default function FloatingChatbot() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [buttons, setButtons] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async (msg = null) => {
    const messageToSend = msg || input.trim();
    if (!messageToSend) return;

    const userMsg = { sender: "user", text: messageToSend };
    setMessages([...messages, userMsg]);
    setInput("");
    setButtons([]);

    try {
      const res = await axios.post("/api/userChatbot/chat", {
        message: messageToSend,
        user,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: res.data.reply },
      ]);

      if (res.data.buttons) setButtons(res.data.buttons);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Server error." },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleButtonClick = (link) => navigate(link);

  return (
    <div style={styles.chatWrapper}>
      {!open && (
        <div style={styles.chatIcon} onClick={toggleChat}>
          💬
        </div>
      )}

      {open && (
        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <span>Chat with us 💖</span>
            <button style={styles.closeButton} onClick={toggleChat}>
              ✖
            </button>
          </div>

          <div style={styles.messagesContainer}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                  background: m.sender === "user" ? "#d1ffd6" : "#f1f1f1",
                }}
              >
                <b>{m.sender === "user" ? "You" : "Bot"}:</b> {m.text}
              </div>
            ))}
            {buttons.length > 0 && (
              <div style={styles.buttonContainer}>
                {buttons.map((b, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleButtonClick(b.link)}
                    style={styles.actionButton}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                user
                  ? "Ask about your bookings, offers, services..."
                  : "Ask about offers, services, workshops..."
              }
              style={styles.input}
            />
            <button onClick={() => sendMessage()} style={styles.sendButton}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  chatWrapper: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
    fontFamily: "Arial, sans-serif",
  },

  // 🌸 Floating round icon
  chatIcon: {
    backgroundColor: "#ff69b4",
    color: "#fff",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    fontSize: "26px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  },

  chatBox: {
    width: "320px",
    height: "430px",
    borderRadius: "20px",
    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
    overflow: "hidden",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    animation: "fadeIn 0.3s ease",
  },

  chatHeader: {
    background: "#ff69b4",
    color: "#fff",
    padding: "10px 15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "bold",
  },

  closeButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },

  messagesContainer: {
    flex: 1,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: "5px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "15px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "5px",
    marginTop: "5px",
  },
  actionButton: {
    padding: "6px 10px",
    backgroundColor: "#ff69b4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  inputWrapper: {
    display: "flex",
    borderTop: "1px solid #ccc",
    padding: "5px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  sendButton: {
    padding: "8px 12px",
    marginLeft: "5px",
    background: "#ff69b4",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
