import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext.jsx";

export default function AdminChatbot() {
  const { user, role } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chatbot opens
    if (open && messages.length === 0) {
      const welcomeMessage = {
        sender: "bot", 
        text: `Hello Admin ${user?.name}! 👑 I'm your AI assistant. How can I help you manage the system today?`
      };
      setMessages([welcomeMessage]);
    }
  }, [open, user]);

  const sendMessage = async (msg = null) => {
    const messageToSend = msg || input.trim();
    if (!messageToSend) return;

    const userMsg = { sender: "admin", text: messageToSend };
    setMessages([...messages, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await axios.post("/api/adminChatbot/chat", {
        message: messageToSend,
        admin: user,
      });

      // Simulate typing delay for better UX
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: res.data.reply },
        ]);
        setIsTyping(false);
      }, 1000);

    } catch (err) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Server connection issue. Please try again." },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isTyping) sendMessage();
  };

  const quickActions = [
    "Show today's bookings",
    "Revenue summary",
    "Staff performance",
    "Pending reviews"
  ];

  const styles = {
    // 👑 Main Chat Wrapper
    chatWrapper: {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      zIndex: 10000,
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },

    // 💎 Floating Chat Icon
    chatIcon: {
      backgroundColor: "#667eea",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#FFFFFF",
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      fontSize: "28px",
      boxShadow: "0 8px 30px rgba(102, 126, 234, 0.4)",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "3px solid #FFFFFF",
      animation: "pulse 2s infinite",
    },

    // 🏢 Chat Box Container
    chatBox: {
      width: "400px",
      height: "550px",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      overflow: "hidden",
      background: "linear-gradient(165deg, #FFFFFF 0%, #F8FAFF 100%)",
      display: "flex",
      flexDirection: "column",
      animation: "slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      border: "1px solid rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(10px)",
    },

    // 👑 Chat Header
    chatHeader: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#FFFFFF",
      padding: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "700",
      fontSize: "16px",
      boxShadow: "0 2px 15px rgba(102, 126, 234, 0.2)",
    },

    closeButton: {
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      color: "#FFFFFF",
      fontSize: "16px",
      cursor: "pointer",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
    },

    // 💬 Messages Container
    messagesContainer: {
      flex: 1,
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      gap: "12px",
      background: "linear-gradient(180deg, #FBFCFE 0%, #F8FAFF 100%)",
    },

    // ✨ Message Bubbles
    message: {
      padding: "14px 18px",
      borderRadius: "20px",
      maxWidth: "85%",
      wordWrap: "break-word",
      lineHeight: "1.5",
      fontSize: "14px",
      position: "relative",
      animation: "messageSlide 0.3s ease-out",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    adminMessage: {
      alignSelf: "flex-end",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#FFFFFF",
      borderBottomRightRadius: "6px",
    },

    botMessage: {
      alignSelf: "flex-start",
      background: "rgba(255, 255, 255, 0.95)",
      color: "#2D3748",
      border: "1px solid rgba(102, 126, 234, 0.1)",
      borderBottomLeftRadius: "6px",
      boxShadow: "0 2px 12px rgba(102, 126, 234, 0.1)",
    },

    // ⏳ Typing Indicator
    typingIndicator: {
      alignSelf: "flex-start",
      background: "rgba(255, 255, 255, 0.95)",
      color: "#718096",
      padding: "14px 18px",
      borderRadius: "20px",
      borderBottomLeftRadius: "6px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      border: "1px solid rgba(102, 126, 234, 0.1)",
    },

    typingDots: {
      display: "flex",
      gap: "4px",
    },

    typingDot: {
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      background: "#667eea",
      animation: "typing 1.4s infinite ease-in-out",
    },

    // 🚀 Quick Actions
    quickActionsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      marginTop: "10px",
    },

    quickAction: {
      padding: "10px 16px",
      background: "rgba(102, 126, 234, 0.1)",
      border: "1px solid rgba(102, 126, 234, 0.2)",
      borderRadius: "16px",
      fontSize: "13px",
      color: "#667eea",
      cursor: "pointer",
      transition: "all 0.3s ease",
      textAlign: "left",
      fontWeight: "500",
    },

    // ⌨️ Input Area
    inputWrapper: {
      display: "flex",
      borderTop: "1px solid rgba(102, 126, 234, 0.1)",
      padding: "16px 20px",
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(10px)",
      gap: "10px",
    },

    input: {
      flex: 1,
      padding: "12px 16px",
      borderRadius: "16px",
      border: "2px solid rgba(102, 126, 234, 0.2)",
      fontSize: "14px",
      outline: "none",
      background: "#FFFFFF",
      transition: "all 0.3s ease",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },

    sendButton: {
      padding: "12px 20px",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "#FFFFFF",
      border: "none",
      borderRadius: "16px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
      minWidth: "70px",
    },

    // ✨ Hover Effects
    hoverEffects: {
      chatIconHover: {
        transform: "scale(1.1) rotate(5deg)",
        boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
      },
      closeButtonHover: {
        background: "rgba(255, 255, 255, 0.3)",
        transform: "scale(1.1)",
      },
      quickActionHover: {
        background: "rgba(102, 126, 234, 0.2)",
        transform: "translateX(5px)",
      },
      sendButtonHover: {
        transform: "translateY(-2px)",
        boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
      },
      inputFocus: {
        borderColor: "#667eea",
        boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
      }
    }
  };

  if (role !== "admin") return null;

  return (
    <div style={styles.chatWrapper}>
      {/* 💎 Floating Chat Icon */}
      {!open && (
        <div 
          style={styles.chatIcon}
          onClick={() => setOpen(true)}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.hoverEffects.chatIconHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.chatIcon)}
        >
          👑
        </div>
      )}

      {/* 🏢 Chat Window */}
      {open && (
        <div style={styles.chatBox}>
          {/* Header */}
          <div style={styles.chatHeader}>
            <span>👑 Admin Assistant</span>
            <button 
              style={styles.closeButton}
              onClick={() => setOpen(false)}
              onMouseEnter={(e) => Object.assign(e.target.style, styles.hoverEffects.closeButtonHover)}
              onMouseLeave={(e) => Object.assign(e.target.style, styles.closeButton)}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  ...(m.sender === "admin" ? styles.adminMessage : styles.botMessage),
                }}
              >
                {m.text}
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div style={styles.typingIndicator}>
                <span>AI Assistant is thinking</span>
                <div style={styles.typingDots}>
                  <div style={{...styles.typingDot, animationDelay: '0s'}}></div>
                  <div style={{...styles.typingDot, animationDelay: '0.2s'}}></div>
                  <div style={{...styles.typingDot, animationDelay: '0.4s'}}></div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div style={styles.quickActionsContainer}>
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    style={styles.quickAction}
                    onClick={() => sendMessage(action)}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.hoverEffects.quickActionHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, styles.quickAction)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div style={styles.inputWrapper}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about analytics, bookings, staff, or revenue... 📊"
              style={styles.input}
              onFocus={(e) => Object.assign(e.target.style, styles.hoverEffects.inputFocus)}
              onBlur={(e) => Object.assign(e.target.style, styles.input)}
              disabled={isTyping}
            />
            <button 
              onClick={() => sendMessage()} 
              style={{
                ...styles.sendButton,
                ...(isTyping && { opacity: 0.6, cursor: 'not-allowed' })
              }}
              onMouseEnter={(e) => !isTyping && Object.assign(e.target.style, styles.hoverEffects.sendButtonHover)}
              onMouseLeave={(e) => !isTyping && Object.assign(e.target.style, styles.sendButton)}
              disabled={isTyping}
            >
              {isTyping ? "⏳" : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Embedded CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to { 
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes messageSlide {
            from { 
              opacity: 0;
              transform: translateY(10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
          }
        `}
      </style>
    </div>
  );
}