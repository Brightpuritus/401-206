"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Send } from "lucide-react"

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
    <div className="flex h-screen">
      {/* Conversations list */}
      <div className="w-1/3 border-r dark:border-gray-800">
        <div className="p-4 border-b dark:border-gray-800">
          <h2 className="font-bold text-lg">Messages</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-64px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 ${
                activeConversation.id === conversation.id ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <Avatar>
                <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                <AvatarFallback>{conversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate">{conversation.user.name}</p>
                  <p className="text-xs text-muted-foreground">{conversation.timestamp}</p>
                </div>
                <p className={`text-sm truncate ${conversation.unread ? "font-medium" : "text-muted-foreground"}`}>
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && <div className="w-2 h-2 rounded-full bg-yamaha-red"></div>}
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Active conversation */}
      <div className="flex-1 flex flex-col">
        {/* Conversation header */}
        <div className="p-4 border-b dark:border-gray-800 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={activeConversation.user.avatar} alt={activeConversation.user.name} />
            <AvatarFallback>{activeConversation.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{activeConversation.user.name}</p>
            <p className="text-xs text-muted-foreground">@{activeConversation.user.username}</p>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {activeMessages.map((message) => (
              <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isCurrentUser
                      ? "bg-yamaha-red text-white rounded-br-none"
                      : "bg-gray-100 dark:bg-gray-800 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isCurrentUser ? "text-white/70" : "text-muted-foreground"}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message input */}
        <div className="p-4 border-t dark:border-gray-800">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage()
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-yamaha-red hover:bg-yamaha-darkRed"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
