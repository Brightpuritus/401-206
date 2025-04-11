"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Notifications.css"

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching notifications
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: "like",
          user: {
            id: 2,
            username: "yamaha_official",
            avatar: "/assets/yamaha-profile.jpg",
          },
          content: "liked your photo",
          postId: 101,
          postImage: "/assets/post-1.jpg",
          timestamp: "2023-04-10T14:30:00Z",
          isRead: false,
        },
        {
          id: 2,
          type: "follow",
          user: {
            id: 3,
            username: "yamaha_music",
            avatar: "/assets/yamaha-music.jpg",
          },
          content: "started following you",
          timestamp: "2023-04-10T10:15:00Z",
          isRead: false,
        },
        {
          id: 3,
          type: "comment",
          user: {
            id: 4,
            username: "yamaha_marine",
            avatar: "/assets/yamaha-marine.jpg",
          },
          content: 'commented: "Great photo!"',
          postId: 102,
          postImage: "/assets/post-2.jpg",
          timestamp: "2023-04-09T16:45:00Z",
          isRead: true,
        },
        {
          id: 4,
          type: "mention",
          user: {
            id: 5,
            username: "moto_enthusiast",
            avatar: "/assets/user1.jpg",
          },
          content: "mentioned you in a comment",
          postId: 103,
          postImage: "/assets/post-3.jpg",
          timestamp: "2023-04-08T09:20:00Z",
          isRead: true,
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h`
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}d`
    } else {
      return date.toLocaleDateString()
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notification.isRead
    return notification.type === activeTab
  })

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, isRead: true })))
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {notifications.some((notification) => !notification.isRead) && (
          <button className="mark-read-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-tabs">
        <button
          className={`notification-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`notification-tab ${activeTab === "unread" ? "active" : ""}`}
          onClick={() => setActiveTab("unread")}
        >
          Unread
        </button>
        <button
          className={`notification-tab ${activeTab === "like" ? "active" : ""}`}
          onClick={() => setActiveTab("like")}
        >
          Likes
        </button>
        <button
          className={`notification-tab ${activeTab === "comment" ? "active" : ""}`}
          onClick={() => setActiveTab("comment")}
        >
          Comments
        </button>
        <button
          className={`notification-tab ${activeTab === "follow" ? "active" : ""}`}
          onClick={() => setActiveTab("follow")}
        >
          Follows
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.isRead ? "unread" : ""}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="notification-avatar">
                <img src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.username} />
              </div>
              <div className="notification-content">
                <div className="notification-text">
                  <Link to={`/profile/${notification.user.username}`} className="notification-username">
                    {notification.user.username}
                  </Link>{" "}
                  {notification.content}
                </div>
                <div className="notification-time">{formatTime(notification.timestamp)}</div>
              </div>
              {notification.postImage && (
                <div className="notification-post-image">
                  <img src={notification.postImage || "/placeholder.svg"} alt="Post" />
                </div>
              )}
              {!notification.isRead && <div className="unread-indicator"></div>}
            </div>
          ))
        ) : (
          <div className="no-notifications">
            <i className="fa-regular fa-bell"></i>
            <h3>No Notifications</h3>
            <p>When you have notifications, they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
