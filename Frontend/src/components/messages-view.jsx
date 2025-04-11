"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"
import "../styles/components/messages.css"

// Mock data for conversations
const conversationsData = [
  {
    id: 1,
    user: {
      username: "yamaha_official",
      name: "Yamaha Official",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Thank you for your interest in our new models!",
    timestamp: "2h",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "yamaha_official",
        text: "Hello! How can we help you today?",
        timestamp: "10:30 AM",
        isCurrentUser: false,
      },
      {
        id: 2,
        sender: "current_user",
        text: "Hi! I'm interested in the new Yamaha R1. Can you tell me more about it?",
        timestamp: "10:32 AM",
        isCurrentUser: true,
      },
      {
        id: 3,
        sender: "yamaha_official",
        text: "Of course! The new Yamaha R1 features a 998cc engine, advanced electronics, and a top speed of over 185 mph. It's our most advanced superbike yet.",
        timestamp: "10:35 AM",
        isCurrentUser: false,
      },
      {
        id: 4,
        sender: "current_user",
        text: "That sounds amazing! What about the price?",
        timestamp: "10:37 AM",
        isCurrentUser: true,
      },
      {
        id: 5,
        sender: "yamaha_official",
        text: "The new R1 starts at $17,399. Would you like to schedule a test ride at your nearest dealership?",
        timestamp: "10:40 AM",
        isCurrentUser: false,
      },
      {
        id: 6,
        sender: "current_user",
        text: "Yes, that would be great!",
        timestamp: "10:42 AM",
        isCurrentUser: true,
      },
      {
        id: 7,
        sender: "yamaha_official",
        text: "Thank you for your interest in our new models!",
        timestamp: "10:45 AM",
        isCurrentUser: false,
      },
    ],
  },
  {
    id: 2,
    user: {
      username: "moto_enthusiast",
      name: "Moto Enthusiast",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Did you see the new R1 model? It's amazing!",
    timestamp: "1d",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "moto_enthusiast",
        text: "Hey there! Did you see the new R1 model?",
        timestamp: "Yesterday",
        isCurrentUser: false,
      },
      {
        id: 2,
        sender: "current_user",
        text: "Not yet! Is it good?",
        timestamp: "Yesterday",
        isCurrentUser: true,
      },
      {
        id: 3,
        sender: "moto_enthusiast",
        text: "It's amazing! The design is incredible and the performance is next level.",
        timestamp: "Yesterday",
        isCurrentUser: false,
      },
      {
        id: 4,
        sender: "current_user",
        text: "I'll have to check it out. Thanks for letting me know!",
        timestamp: "Yesterday",
        isCurrentUser: true,
      },
      {
        id: 5,
        sender: "moto_enthusiast",
        text: "Did you see the new R1 model? It's amazing!",
        timestamp: "Today",
        isCurrentUser: false,
      },
    ],
  },
  {
    id: 3,
    user: {
      username: "yamaha_music",
      name: "Yamaha Music",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Your order has been shipped. Thank you!",
    timestamp: "3d",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "yamaha_music",
        text: "Thank you for your order of the Yamaha P-125 digital piano.",
        timestamp: "3 days ago",
        isCurrentUser: false,
      },
      {
        id: 2,
        sender: "current_user",
        text: "When can I expect it to be shipped?",
        timestamp: "3 days ago",
        isCurrentUser: true,
      },
      {
        id: 3,
        sender: "yamaha_music",
        text: "We're processing your order now. It should ship within 24 hours.",
        timestamp: "3 days ago",
        isCurrentUser: false,
      },
      {
        id: 4,
        sender: "current_user",
        text: "Great, thank you!",
        timestamp: "2 days ago",
        isCurrentUser: true,
      },
      {
        id: 5,
        sender: "yamaha_music",
        text: "Your order has been shipped. Thank you!",
        timestamp: "Today",
        isCurrentUser: false,
      },
    ],
  },
  {
    id: 4,
    user: {
      username: "rider_club",
      name: "Rider Club",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    lastMessage: "Join us for the weekend ride!",
    timestamp: "1w",
    unread: false,
    messages: [
      {
        id: 1,
        sender: "rider_club",
        text: "Hello Yamaha riders! We're organizing a group ride this weekend.",
        timestamp: "1 week ago",
        isCurrentUser: false,
      },
      {
        id: 2,
        sender: "current_user",
        text: "Sounds fun! Where are you planning to go?",
        timestamp: "1 week ago",
        isCurrentUser: true,
      },
      {
        id: 3,
        sender: "rider_club",
        text: "We're planning a coastal route, about 200 miles round trip. Starting at 8 AM on Saturday.",
        timestamp: "1 week ago",
        isCurrentUser: false,
      },
      {
        id: 4,
        sender: "current_user",
        text: "I'll check my schedule and let you know!",
        timestamp: "6 days ago",
        isCurrentUser: true,
      },
      {
        id: 5,
        sender: "rider_club",
        text: "Join us for the weekend ride!",
        timestamp: "Yesterday",
        isCurrentUser: false,
      },
    ],
  },
]

export function MessagesView() {
  const [conversations, setConversations] = useState(conversationsData)
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const [activeMessages, setActiveMessages] = useState(conversations[0].messages)
  const [newMessage, setNewMessage] = useState("")

  // Update active messages when active conversation changes
  useEffect(() => {
    const conversation = conversations.find((c) => c.id === activeConversation.id)
    if (conversation) {
      setActiveMessages(conversation.messages)

      // Mark conversation as read when selected
      if (conversation.unread) {
        setConversations((prevConversations) =>
          prevConversations.map((c) => (c.id === conversation.id ? { ...c, unread: false } : c)),
        )
      }
    }
  }, [activeConversation, conversations])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: activeMessages.length + 1,
      sender: "current_user",
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isCurrentUser: true,
    }

    // Update the messages for the active conversation
    const updatedConversations = conversations.map((conversation) => {
      if (conversation.id === activeConversation.id) {
        return {
          ...conversation,
          messages: [...conversation.messages, newMsg],
          lastMessage: newMessage,
          timestamp: "Just now",
        }
      }
      return conversation
    })

    setConversations(updatedConversations)
    setActiveMessages([...activeMessages, newMsg])
    setNewMessage("")

    // Simulate a reply after 1 second
    setTimeout(() => {
      const reply = {
        id: activeMessages.length + 2,
        sender: activeConversation.user.username,
        text: "Thanks for your message! We'll get back to you soon.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCurrentUser: false,
      }

      const updatedWithReply = conversations.map((conversation) => {
        if (conversation.id === activeConversation.id) {
          return {
            ...conversation,
            messages: [...conversation.messages, newMsg, reply],
            lastMessage: reply.text,
            timestamp: "Just now",
          }
        }
        return conversation
      })

      setConversations(updatedWithReply)
      setActiveMessages((prev) => [...prev, reply])
    }, 1000)
  }

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation)
  }

  return (
    <div className="messages">
      {/* Conversations list */}
      <div className="conversations-list">
        <div className="conversations-header">
          <h2 className="conversations-title">Messages</h2>
        </div>
        <div className="conversations-scroll">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`conversation-item ${activeConversation.id === conversation.id ? "active" : ""}`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="avatar">
                <img
                  src={conversation.user.avatar || "/placeholder.svg"}
                  alt={conversation.user.name}
                  className="avatar-image"
                />
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <p className="conversation-name">{conversation.user.name}</p>
                  <p className="conversation-time">{conversation.timestamp}</p>
                </div>
                <p className={`conversation-last-message ${conversation.unread ? "unread" : ""}`}>
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && <div className="conversation-unread-indicator"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Active conversation */}
      <div className="chat">
        {/* Conversation header */}
        <div className="chat-header">
          <div className="avatar">
            <img
              src={activeConversation.user.avatar || "/placeholder.svg"}
              alt={activeConversation.user.name}
              className="avatar-image"
            />
          </div>
          <div className="chat-user-info">
            <p className="chat-user-name">{activeConversation.user.name}</p>
            <p className="chat-user-username">@{activeConversation.user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="chat-messages">
          <div className="messages-list">
            {activeMessages.map((message) => (
              <div key={message.id} className={`message ${message.isCurrentUser ? "outgoing" : "incoming"}`}>
                <div className="message-bubble">
                  <p className="message-text">{message.text}</p>
                  <p className="message-time">{message.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message input */}
        <div className="chat-input">
          <div className="chat-input-form">
            <input
              type="text"
              placeholder="Type a message..."
              className="form-input"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <button className="btn btn-primary" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
