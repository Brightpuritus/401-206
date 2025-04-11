"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "./Profile.css"

const Profile = ({ currentUser }) => {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [activeTab, setActiveTab] = useState("posts")
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching profile data
    setTimeout(() => {
      if (username === currentUser.username) {
        setProfile(currentUser)
      } else {
        setProfile({
          id: 2,
          username: username,
          fullName: "Yamaha Official",
          avatar: "/assets/yamaha-profile.jpg",
          followers: 1500000,
          following: 50,
          bio: "Official Yamaha account. Revs your heart with motorcycles, musical instruments, and marine products.",
          website: "www.yamaha.com",
        })
      }

      // Simulate fetching posts
      setPosts([
        {
          id: 1,
          user: {
            id: 2,
            username: username,
            avatar: "/assets/yamaha-profile.jpg",
          },
          image: "/assets/post-1.jpg",
          caption:
            "Introducing the all-new Yamaha R1M - Pushing the boundaries of what's possible on two wheels. #YamahaRacing #R1M",
          likes: 1245,
          timestamp: "2023-04-10T12:00:00Z",
          comments: [],
        },
        {
          id: 2,
          user: {
            id: 2,
            username: username,
            avatar: "/assets/yamaha-profile.jpg",
          },
          image: "/assets/post-2.jpg",
          caption:
            "The new Yamaha Grand Piano - Where tradition meets innovation. Experience the perfect harmony. #YamahaMusic #GrandPiano",
          likes: 876,
          timestamp: "2023-04-09T15:30:00Z",
          comments: [],
        },
        {
          id: 3,
          user: {
            id: 2,
            username: username,
            avatar: "/assets/yamaha-profile.jpg",
          },
          image: "/assets/post-3.jpg",
          caption:
            "Explore the waters with confidence. The new Yamaha outboard motors are designed for ultimate reliability and performance. #YamahaMarine",
          likes: 543,
          timestamp: "2023-04-08T09:45:00Z",
          comments: [],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [username, currentUser])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    if (isFollowing) {
      setProfile({ ...profile, followers: profile.followers - 1 })
    } else {
      setProfile({ ...profile, followers: profile.followers + 1 })
    }
  }

  if (loading || !profile) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  const isCurrentUser = profile.id === currentUser.id

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar || "/placeholder.svg"} alt={profile.username} />
        </div>
        <div className="profile-info">
          <div className="profile-top">
            <h2 className="profile-username">{profile.username}</h2>
            {isCurrentUser ? (
              <div className="profile-actions">
                <button className="btn btn-secondary">Edit Profile</button>
              </div>
            ) : (
              <div className="profile-actions">
                <button className={`btn ${isFollowing ? "btn-secondary" : "btn-primary"}`} onClick={handleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button className="btn btn-secondary">Message</button>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <div className="stat">
              <span className="stat-value">{posts.length}</span> posts
            </div>
            <div className="stat">
              <span className="stat-value">{profile.followers.toLocaleString()}</span> followers
            </div>
            <div className="stat">
              <span className="stat-value">{profile.following.toLocaleString()}</span> following
            </div>
          </div>

          <div className="profile-bio">
            <h3 className="profile-name">{profile.fullName}</h3>
            <p>{profile.bio}</p>
            {profile.website && (
              <a
                href={`https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="profile-website"
              >
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          <i className="fa-solid fa-table-cells"></i> Posts
        </button>
        <button
          className={`profile-tab ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          <i className="fa-regular fa-bookmark"></i> Saved
        </button>
        <button
          className={`profile-tab ${activeTab === "tagged" ? "active" : ""}`}
          onClick={() => setActiveTab("tagged")}
        >
          <i className="fa-solid fa-tag"></i> Tagged
        </button>
      </div>

      {activeTab === "posts" && (
        <div className="profile-posts">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post) => (
                <div key={post.id} className="post-grid-item">
                  <img src={post.image || "/placeholder.svg"} alt="Post" />
                  <div className="post-overlay">
                    <div className="post-stats">
                      <div className="post-stat">
                        <i className="fa-solid fa-heart"></i> {post.likes}
                      </div>
                      <div className="post-stat">
                        <i className="fa-solid fa-comment"></i> {post.comments.length}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <i className="fa-solid fa-camera"></i>
              <h3>No Posts Yet</h3>
              {isCurrentUser && <p>Start capturing and sharing your moments.</p>}
            </div>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div className="profile-saved">
          {isCurrentUser ? (
            <div className="no-posts">
              <i className="fa-regular fa-bookmark"></i>
              <h3>No Saved Posts</h3>
              <p>Save posts to view them later.</p>
            </div>
          ) : (
            <div className="private-content">
              <i className="fa-solid fa-lock"></i>
              <h3>This Tab is Private</h3>
              <p>Only {profile.username} can see what they've saved.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "tagged" && (
        <div className="profile-tagged">
          <div className="no-posts">
            <i className="fa-solid fa-tag"></i>
            <h3>No Tagged Posts</h3>
            <p>When people tag {profile.username} in posts, they'll appear here.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
