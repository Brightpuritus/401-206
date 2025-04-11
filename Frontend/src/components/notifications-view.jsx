"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/components/notifications.css"

// Mock data for notifications
const initialNotifications = [
  {
    id: 1,
    type: "like",
    user: {
      username: "yamaha_official",
      name: "Yamaha Official",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "liked your post",
    postImage: "/placeholder.svg?height=60&width=60",
    timestamp: "2h",
    isRead: false,
  },
  {
    id: 2,
    type: "follow",
    user: {
      username: "moto_enthusiast",
      name: "Moto Enthusiast",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "started following you",
    timestamp: "5h",
    isRead: false,
  },
  {
    id: 3,
    type: "comment",
    user: {
      username: "yamaha_music",
      name: "Yamaha Music",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: 'commented: "Great photo! Love the composition."',
    postImage: "/placeholder.svg?height=60&width=60",
    timestamp: "1d",
    isRead: true,
  },
  {
    id: 4,
    type: "ad",
    user: {
      username: "yamaha_motors",
      name: "Yamaha Motors",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "New Yamaha R1 now available at your nearest dealership!",
    adImage: "/placeholder.svg?height=200&width=400",
    timestamp: "2d",
    isRead: true,
    isAd: true,
  },
  {
    id: 5,
    type: "mention",
    user: {
      username: "rider_club",
      name: "Rider Club",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: 'mentioned you in a comment: "@yamaha_rider would love this!"',
    postImage: "/placeholder.svg?height=60&width=60",
    timestamp: "3d",
    isRead: true,
  },
]

export function NotificationsView() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [followStatus, setFollowStatus] = useState({})
  const [activeTab, setActiveTab] = useState("all")

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  const handleFollow = (username) => {
    setFollowStatus((prev) => ({
      ...prev,
      [username]: !prev[username],
    }))
  }

  const displayedNotifications = activeTab === "all" ? notifications : notifications.filter((n) => !n.isRead)

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h1 className="notifications-title">Notifications</h1>
        <button className="btn btn-ghost" onClick={handleMarkAllAsRead}>
          Mark all as read
        </button>
      </div>

      <div className="tabs">
        <div className="tabs-list">
          <button className={`tabs-trigger ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
            All
          </button>
          <button
            className={`tabs-trigger ${activeTab === "unread" ? "active" : ""}`}
            onClick={() => setActiveTab("unread")}
          >
            Unread
          </button>
        </div>

        <div className="tabs-content">
          <div className="notifications-list">
            {displayedNotifications.length > 0 ? (
              displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.isRead ? "" : "unread"} ${notification.isAd ? "ad" : ""}`}
                >
                  <div className="notification-content">
                    <div className="avatar">
                      <img
                        src={notification.user.avatar || "/placeholder.svg"}
                        alt={notification.user.name}
                        className="avatar-image"
                      />
                    </div>
                    <div className="notification-body">
                      <div className="notification-header">
                        <div>
                          <p className="notification-text">
                            <Link to={`/profile/${notification.user.username}`} className="notification-username">
                              {notification.user.name}
                            </Link>{" "}
                            {notification.content}
                          </p>
                          <p className="notification-time">{notification.timestamp}</p>
                        </div>
                        {notification.postImage && (
                          <div className="notification-image">
                            <img src={notification.postImage || "/placeholder.svg"} alt="Post" width={60} height={60} />
                          </div>
                        )}
                        {notification.type === "follow" && (
                          <button
                            className={`btn ${followStatus[notification.user.username] ? "btn-outline" : "btn-primary"}`}
                            onClick={() => handleFollow(notification.user.username)}
                          >
                            {followStatus[notification.user.username] ? "Following" : "Follow"}
                          </button>
                        )}
                      </div>
                      {notification.adImage && (
                        <div className="notification-ad-image">
                          <img
                            src={notification.adImage || "/placeholder.svg"}
                            alt="Advertisement"
                            width={400}
                            height={200}
                          />
                          <div className="notification-ad-actions">
                            <button className="btn btn-primary">Learn More</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-notifications">No {activeTab === "unread" ? "unread " : ""}notifications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
