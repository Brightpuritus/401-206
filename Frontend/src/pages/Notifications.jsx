"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Notifications.css"

const Notifications = ({ currentUser = { username: "" } }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notifications/${currentUser.username}`);
        const data = await response.json();
        // เพิ่ม isRead = false ให้ทุกอัน (ถ้า backend ยังไม่มี)
        setNotifications(data.map(n => ({ ...n, isRead: false })));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInSeconds = Math.floor((now - date) / 1000)
    if (diffInSeconds < 60) return `${diffInSeconds}s`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return date.toLocaleDateString()
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
                <img
                  src={
                    notification.sender
                      ? `http://localhost:5000/avatars/${notification.sender}.jpg`
                      : "/placeholder.svg"
                  }
                  alt={notification.sender}
                />
              </div>
              <div className="notification-content">
                <p className="notification-text">
                  <strong className="notification-username">{notification.sender}</strong>{" "}
                  {notification.type === "like"
                    ? "liked your post."
                    : notification.type === "comment"
                    ? `commented: "${notification.text}"`
                    : notification.type === "follow"
                    ? "started following you."
                    : ""}
                </p>
                <span className="notification-time">{formatTime(notification.timestamp)}</span>
              </div>
              {notification.type === "like" || notification.type === "comment" ? (
                <div className="notification-post-image">
                  <img
                    src={
                      notification.postId
                        ? `http://localhost:5000/uploads/posts/${notification.postId}.jpg`
                        : "/placeholder.svg"
                    }
                    alt="Post"
                  />
                </div>
              ) : null}
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


