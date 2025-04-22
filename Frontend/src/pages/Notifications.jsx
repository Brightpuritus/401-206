"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "./Notifications.css"

const Notifications = ({ currentUser = { username: "" } }) => {
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [profileMap, setProfileMap] = useState({});
  const [postImageMap, setPostImageMap] = useState({});

  useEffect(() => {
    if (!currentUser || !currentUser.username) return;
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/notifications/${currentUser.username}`);
        const data = await response.json();
        setNotifications(data.map(n => ({ ...n, isRead: false })));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentUser]);

  useEffect(() => {
    const fetchProfiles = async () => {
      if (notifications.length === 0) return;
      const uniqueSenders = [...new Set(notifications.map(n => n.sender).filter(Boolean))];
      if (uniqueSenders.length === 0) return;
      try {
        const response = await fetch("http://localhost:5000/api/profiles");
        const profiles = await response.json();
        const map = {};
        profiles.forEach((p) => {
          map[p.username] = p.avatar ? `http://localhost:5000${p.avatar}` : "/placeholder.svg";
        });
        setProfileMap(map);
      } catch (error) {
        // fallback: do nothing
      }
    };
    fetchProfiles();
  }, [notifications]);

  useEffect(() => {
    const fetchPostImages = async () => {
      const postIds = [
        ...new Set(
          notifications
            .filter((n) => n.postId)
            .map((n) => n.postId)
        ),
      ];
      if (postIds.length === 0) return;
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        const posts = await response.json();
        const map = {};
        postIds.forEach((id) => {
          const post = posts.find((p) => p.id === id);
          if (post && post.image) {
            map[id] = `http://localhost:5000${post.image}`;
          }
        });
        setPostImageMap(map);
      } catch (error) {
        // fallback: do nothing
      }
    };
    fetchPostImages();
  }, [notifications]);

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

  const handleDeleteNotification = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      // อาจแจ้งเตือน error ได้
    }
  };

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
      </div>

      <div className="notifications-tabs">
        <button
          className={`notification-tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All
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
              className="notification-item"
            >
              <div className="notification-avatar">
                <img
                  src={
                    profileMap[notification.sender] || "/placeholder.svg"
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
                      notification.postId && postImageMap[notification.postId]
                        ? postImageMap[notification.postId]
                        : "/placeholder.svg"
                    }
                    alt="Post"
                  />
                </div>
              ) : null}
              <button
                className="notification-delete-btn"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteNotification(notification.id);
                }}
                title="Delete notification"
              >
                <i className="fa fa-trash"></i>
              </button>
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


