"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import "./Messages.css"

const Messages = ({ currentUser }) => {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profiles")
        if (response.ok) {
          const data = await response.json()

          // กรองข้อมูลเพื่อไม่รวม currentUser
          const filteredProfiles = data.filter(
            (profile) => profile.username !== currentUser.username
          )

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
          )
        }
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [currentUser.username])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.user.username);
    }
  }, [activeConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() && activeConversation) {
      const newMessage = {
        sender: currentUser.username,
        recipient: activeConversation.user.username,
        text: message,
      };
  
      try {
        const response = await fetch("http://localhost:5000/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });
  
        if (response.ok) {
          const savedMessage = await response.json();
  
          setActiveConversation((prev) => ({
            ...prev,
            messages: [...prev.messages, savedMessage],
          }));
  
          setConversations((prevConversations) =>
            prevConversations.map((conv) =>
              conv.id === activeConversation.id
                ? {
                    ...conv,
                    messages: [...conv.messages, savedMessage],
                  }
                : conv
            )
          );
  
          setMessage("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
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

  const fetchMessages = async (recipient) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/chats/${currentUser.username}/${recipient}`
      );
      if (response.ok) {
        const messages = await response.json();
        setActiveConversation((prev) => ({
          ...prev,
          messages,
        }));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

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
              className={`conversation-item ${
                activeConversation?.id === conversation.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveConversation(conversation);
                fetchMessages(conversation.user.username); // ดึงข้อความจาก Backend
              }}
            >
              <div className="conversation-avatar">
                <img
                  src={conversation.user?.avatar || "/placeholder.svg"}
                  alt={conversation.user?.username || "Unknown User"}
                />
                {conversation.user?.isOnline && <div className="online-indicator"></div>}
              </div>
              <div className="conversation-info">
                <div className="conversation-name">
                  {conversation.user?.username || "Unknown User"}
                </div>
                <div className="conversation-last-message">
                  {conversation.messages.length > 0
                    ? conversation.messages[
                        conversation.messages.length - 1
                      ]?.text.substring(0, 30)
                    : "No messages yet"}
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
              <Link
                to={`/profile/${activeConversation.user.username}`}
                className="chat-user-info"
              >
                <img
                  src={activeConversation.user.avatar || "/placeholder.svg"}
                  alt={activeConversation.user.username}
                  className="chat-avatar"
                />
                <div>
                  <div className="chat-username">
                    {activeConversation.user.username}
                  </div>
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
                    msg.sender === currentUser.username ? "message-sent" : "message-received"
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
              <button
                type="submit"
                className="message-send"
                disabled={!message.trim()}
              >
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