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
    // Simulate fetching conversations
    setTimeout(() => {
      const mockConversations = [
        {
          id: 1,
          user: {
            id: 2,
            username: "yamaha_official",
            fullName: "Yamaha Official",
            avatar: "/assets/yamaha-profile.jpg",
            isOnline: true,
            lastActive: null,
          },
          messages: [
            {
              id: 101,
              sender: 2,
              text: "Hello! Thanks for your interest in Yamaha products.",
              timestamp: "2023-04-10T14:30:00Z",
            },
            {
              id: 102,
              sender: 1,
              text: "Hi! I'm looking for information about the new R1M.",
              timestamp: "2023-04-10T14:32:00Z",
            },
            {
              id: 103,
              sender: 2,
              text: "Of course! The new R1M features advanced electronic racing technology, including GPS data logging, carbon fiber bodywork, and Öhlins Electronic Racing Suspension.",
              timestamp: "2023-04-10T14:35:00Z",
            },
            {
              id: 104,
              sender: 1,
              text: "That sounds amazing! What's the price range?",
              timestamp: "2023-04-10T14:37:00Z",
            },
            {
              id: 105,
              sender: 2,
              text: "The R1M is priced at $26,999 MSRP. Would you like me to connect you with a dealer in your area?",
              timestamp: "2023-04-10T14:40:00Z",
            },
          ],
          unreadCount: 0,
        },
        {
          id: 2,
          user: {
            id: 3,
            username: "yamaha_music",
            fullName: "Yamaha Music",
            avatar: "/assets/yamaha-music.jpg",
            isOnline: false,
            lastActive: "2023-04-10T10:15:00Z",
          },
          messages: [
            {
              id: 201,
              sender: 3,
              text: "Welcome to Yamaha Music! How can we help you today?",
              timestamp: "2023-04-09T09:00:00Z",
            },
          ],
          unreadCount: 1,
        },
        {
          id: 3,
          user: {
            id: 4,
            username: "yamaha_marine",
            fullName: "Yamaha Marine",
            avatar: "/assets/yamaha-marine.jpg",
            isOnline: false,
            lastActive: "2023-04-09T16:45:00Z",
          },
          messages: [
            {
              id: 301,
              sender: 4,
              text: "Thank you for your interest in Yamaha Marine products!",
              timestamp: "2023-04-08T11:20:00Z",
            },
          ],
          unreadCount: 1,
        },
      ]

      setConversations(mockConversations)
      setActiveConversation(mockConversations[0])
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeConversation])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim() && activeConversation) {
      const newMessage = {
        id: Date.now(),
        sender: currentUser.id,
        text: message,
        timestamp: new Date().toISOString(),
      }

      const updatedConversation = {
        ...activeConversation,
        messages: [...activeConversation.messages, newMessage],
      }

      setActiveConversation(updatedConversation)
      setConversations(conversations.map((conv) => (conv.id === updatedConversation.id ? updatedConversation : conv)))
      setMessage("")
    }
  }

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
                <div className="conversation-name">{conversation.user.username}</div>
                <div className="conversation-last-message">
                  {conversation.messages[conversation.messages.length - 1]?.text.substring(0, 30)}
                  {conversation.messages[conversation.messages.length - 1]?.text.length > 30 ? "..." : ""}
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
                  className={`message ${msg.sender === currentUser.id ? "message-sent" : "message-received"}`}
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