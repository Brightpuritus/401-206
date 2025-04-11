"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { CalendarDays, Grid, MapPin } from "lucide-react"
import "../styles/components/profile.css"

// Mock user data
const users = {
  me: {
    username: "yamaha_rider",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=150&width=150",
    bio: "Yamaha enthusiast. Rider. Music lover.",
    location: "Tokyo, Japan",
    website: "yamaha-rider.com",
    joinDate: "January 2020",
    posts: 42,
    followers: 1250,
    following: 350,
    isCurrentUser: true,
    isFollowing: false,
    images: Array(9).fill("/placeholder.svg?height=300&width=300"),
    headerImage: "/placeholder.svg?height=400&width=1200",
  },
  yamaha_official: {
    username: "yamaha_official",
    name: "Yamaha Official",
    avatar: "/placeholder.svg?height=150&width=150",
    bio: "Official Yamaha account. Revs your heart.",
    location: "Global",
    website: "yamaha.com",
    joinDate: "January 2010",
    posts: 1205,
    followers: 2500000,
    following: 150,
    isCurrentUser: false,
    isFollowing: true,
    images: Array(9).fill("/placeholder.svg?height=300&width=300"),
    headerImage: "/placeholder.svg?height=400&width=1200",
  },
}

export function ProfileView({ username }) {
  const user = users[username] || users.yamaha_official
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [followerCount, setFollowerCount] = useState(user.followers)
  const [profileData, setProfileData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    location: user.location,
    website: user.website,
  })
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1)
  }

  const handleProfileUpdate = () => {
    // Here you would typically update the profile data in your backend
    console.log("Updating profile:", profileData)
    setIsEditProfileOpen(false)
  }

  return (
    <div className="profile">
      {/* Header Image */}
      <div className="profile-header-image">
        <img src={user.headerImage || "/placeholder.svg"} alt="Header" />
      </div>

      {/* Profile Info */}
      <div className="profile-content">
        <div className="profile-info">
          {/* Avatar */}
          <div className="profile-avatar">
            <div className="avatar avatar-lg">
              <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="avatar-image" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            {user.isCurrentUser ? (
              <button className="btn btn-outline" onClick={() => setIsEditProfileOpen(true)}>
                Edit Profile
              </button>
            ) : (
              <button className={`btn ${isFollowing ? "btn-outline" : "btn-primary"}`} onClick={handleFollow}>
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-username">@{user.username}</p>

            <p className="profile-bio">{user.bio}</p>

            <div className="profile-meta">
              {user.location && (
                <div className="profile-meta-item">
                  <MapPin size={16} className="profile-meta-icon" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <div className="profile-meta-item">
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-website"
                  >
                    {user.website}
                  </a>
                </div>
              )}
              <div className="profile-meta-item">
                <CalendarDays size={16} className="profile-meta-icon" />
                Joined {user.joinDate}
              </div>
            </div>

            <div className="profile-stats">
              <Link to="#" className="profile-stat-link">
                <span className="profile-stat-count">{user.following.toLocaleString()}</span> Following
              </Link>
              <Link to="#" className="profile-stat-link">
                <span className="profile-stat-count">{followerCount.toLocaleString()}</span> Followers
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="profile-tabs">
            <div className="tabs">
              <div className="tabs-list">
                <button className="tabs-trigger active">
                  <Grid size={16} style={{ marginRight: "0.5rem" }} />
                  Posts
                </button>
              </div>
              <div className="tabs-content">
                <div className="profile-posts-grid">
                  {user.images.map((image, index) => (
                    <div key={index} className="profile-post">
                      <img src={image || "/placeholder.svg"} alt={`Post ${index + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="modal-overlay" onClick={() => setIsEditProfileOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Profile</h2>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  id="name"
                  className="form-input"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  className="form-input"
                  value={profileData.username}
                  onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio" className="form-label">
                  Bio
                </label>
                <textarea
                  id="bio"
                  className="form-textarea"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  id="location"
                  className="form-input"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="website" className="form-label">
                  Website
                </label>
                <input
                  id="website"
                  className="form-input"
                  value={profileData.website}
                  onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setIsEditProfileOpen(false)}>
                Cancel
              </button>

              <button onClick={handleProfileUpdate} className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
