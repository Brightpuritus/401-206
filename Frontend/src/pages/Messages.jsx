"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { io } from "socket.io-client"
import "./Messages.css"

const socket = io("http://localhost:5000"); // URL ของ Backend

const Messages = ({ currentUser }) => {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profiles");
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched profiles:", data); // ตรวจสอบข้อมูลที่ดึงมา

          // กรองข้อมูลเพื่อไม่รวม currentUser
          const filteredProfiles = data.filter(
            (profile) => profile.username !== currentUser.username
          );

          // ตั้งค่า conversations
          setConversations(
            filteredProfiles.map((profile) => ({
              id: profile.id,
              user: {
                id: profile.id,
                username: profile.username,
                avatar: profile.avatar || "/placeholder.svg",
                isOnline: profile.isOnline || false,
              },
              messages: [], // เริ่มต้นเป็นข้อความว่าง
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser.username]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("user_connected", currentUser.id);
    });
  
    socket.on("receive_message", (data) => {
      console.log("Message received:", data);
      const { senderId, text, timestamp } = data;
  
      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === senderId
            ? {
                ...conv,
                messages: [
                  ...conv.messages,
                  {
                    id: Date.now(),
                    sender: senderId,
                    text,
                    timestamp,
                  },
                ],
              }
            : conv
        )
      );
    });
  
    return () => {
      socket.disconnect();
      console.log("Socket disconnected");
    };
  }, [currentUser.id, activeConversation]);
  

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation])

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeConversation && activeConversation.user?.id) {
      const newMessage = {
        recipientId: activeConversation.user.id, // ตรวจสอบว่ามีค่า
        senderId: currentUser.id,
        text: message,
      };
  
      socket.emit("send_message", newMessage);
      console.log("Message sent:", newMessage);
  
      setActiveConversation((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: Date.now(),
            sender: currentUser.id,
            text: message,
            timestamp: new Date().toISOString(),
          },
        ],
      }));
      setMessage("");
    } else {
      console.error("Cannot send message: activeConversation or recipientId is undefined");
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatLastActive = (timestamp) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `Active ${diffInHours}h ago`
    } else {
      return `Active ${Math.floor(diffInHours / 24)}d ago`
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading messages...</p>
      </div>
    )
  }

  return (
    <div className="messages-container">
      <div className="conversations-sidebar">
        <div className="conversations-header">
          <h2>{currentUser.username}</h2>
          <button className="new-message-btn">
            <i className="fa-solid fa-pen-to-square"></i>
          </button>
        </div>

        <div className="conversations-list">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeConversation?.id === conversation.id ? "active" : ""}`}
              onClick={() => setActiveConversation(conversation)}
            >
              <div className="conversation-avatar">
                <img
                  src={conversation.user?.avatar || "/placeholder.svg"}
                  alt={conversation.user?.username || "Unknown User"}
                />
                {conversation.user?.isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="conversation-info">
                <div className="conversation-name">{conversation.user?.username || "Unknown User"}</div>
                <div className="conversation-last-message">
                  No messages yet
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-area">
        {activeConversation ? (
          <>
            <div className="chat-header">
              <Link to={`/profile/${activeConversation.user.username}`} className="chat-user-info">
                <img
                  src={activeConversation.user.avatar || "/placeholder.svg"}
                  alt={activeConversation.user.username}
                  className="chat-avatar"
                />
                <div>
                  <div className="chat-username">{activeConversation.user.username}</div>
                  <div className="chat-status">
                    {activeConversation.user.isOnline
                      ? "Active now"
                      : formatLastActive(activeConversation.user.lastActive)}
                  </div>
                </div>
              </Link>
              <div className="chat-actions">
                <button className="chat-action">
                  <i className="fa-solid fa-phone"></i>
                </button>
                <button className="chat-action">
                  <i className="fa-solid fa-video"></i>
                </button>
                <button className="chat-action">
                  <i className="fa-solid fa-circle-info"></i>
                </button>
              </div>
            </div>

            <div className="chat-messages">
              {activeConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender === currentUser.id ? "message-sent" : "message-received"
                  }`}
                >
                  <div className="message-content">
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input" onSubmit={handleSendMessage}>
              <button type="button" className="message-attachment">
                <i className="fa-solid fa-image"></i>
              </button>
              <input
                type="text"
                placeholder="Message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button type="submit" className="message-send" disabled={!message.trim()}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation">
            <div className="no-conversation-content">
              <i className="fa-solid fa-message"></i>
              <h3>Your Messages</h3>
              <p>Send private messages to a friend or group</p>
              <button className="btn btn-primary">Send Message</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages