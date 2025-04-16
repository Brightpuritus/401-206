"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";

const Profile = ({ currentUser }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]); // โพสต์ที่บันทึก
  const [taggedPosts, setTaggedPosts] = useState([]); // โพสต์ที่ถูกแท็ก
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts"); // แท็บที่เลือก
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [newFullName, setNewFullName] = useState("");

  const isOwnProfile = currentUser?.id === profile?.id;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        // Fetch profile
        const profileResponse = await fetch(`http://localhost:5000/api/profiles/${username}`);
        if (!profileResponse.ok) {
          throw new Error("Profile not found");
        }
        const profileData = await profileResponse.json();
        setProfile(profileData);
        setNewFullName(profileData.fullName);
  
        // Fetch all posts
        const postsResponse = await fetch(`http://localhost:5000/api/posts`);
        if (!postsResponse.ok) {
          throw new Error("Posts not found");
        }
        const allPosts = await postsResponse.json();
  
        // Filter posts by username
        const userPosts = allPosts.filter((post) => post.username === username);
        setPosts(userPosts);
  
        // Fetch saved posts (mock data for now)
        const savedResponse = await fetch(`http://localhost:5000/api/saved/${username}`);
      if (!savedResponse.ok) {
        throw new Error("Failed to fetch saved posts");
      }
      const savedData = await savedResponse.json();
      setSavedPosts(savedData);
  
        // Fetch tagged posts (mock data for now)
        const taggedResponse = await fetch(`http://localhost:5000/api/tagged/${username}`);
        const taggedData = await taggedResponse.json();
        setTaggedPosts(taggedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfileAndPosts();
  }, [username]);

  const handleEditFullName = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: newFullName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditingFullName(false);
    } catch (error) {
      console.error('Error updating fullName:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={profile.avatar || "/placeholder.svg"} alt={profile.username} />
        </div>
        <div className="profile-info">
          <div className="profile-top">
            <h2 className="profile-username">{profile.username}</h2>
            {isOwnProfile && (
              <button className="profile-edit-btn" onClick={() => setIsEditingFullName(true)}>
                Edit Profile
              </button>
            )}
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{posts.length}</span> posts
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.followers}</span> followers
            </div>
            <div className="stat-item">
              <span className="stat-value">{profile.following}</span> following
            </div>
          </div>
          <div className="profile-bio">
            <div className="profile-fullname">{profile.fullName}</div>
            <p>{profile.bio}</p>
            {profile.website && (
              <a href={`https://${profile.website}`} className="profile-website" target="_blank" rel="noopener noreferrer">
                {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {isEditingFullName && (
        <>
          <div className="modal-overlay" onClick={() => setIsEditingFullName(false)} />
          <div className="edit-modal">
            <form className="edit-form" onSubmit={(e) => {
              e.preventDefault();
              handleEditFullName();
            }}>
              <h3>Edit Full Name</h3>
              <input
                type="text"
                className="edit-input"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                placeholder="Full Name"
                minLength={2}
                required
              />
              <div className="edit-buttons">
                <button type="button" className="cancel-btn" onClick={() => setIsEditingFullName(false)}>
                  Cancel
                </button>
                <button type="submit" className="save-btn" disabled={!newFullName.trim()}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* เมนูแท็บ */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          <i className="fas fa-th"></i> POSTS
        </button>
        <button
          className={`tab-button ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          <i className="far fa-bookmark"></i> SAVED
        </button>
        <button
          className={`tab-button ${activeTab === "tagged" ? "active" : ""}`}
          onClick={() => setActiveTab("tagged")}
        >
          <i className="fas fa-user-tag"></i> TAGGED
        </button>
      </div>

      {/* เนื้อหาของแท็บ */}
      <div className="profile-content">
      {activeTab === "posts" && (
  <div className="posts-grid">
    {posts.map((post) => (
      <div key={post.id} className="post-grid-item">
        <img src={`http://localhost:5000${post.image}`} alt={post.caption} />
        <div className="post-overlay">
          <div className="post-stats">
            <span><i className="fas fa-heart"></i> {post.likes}</span>
            <span><i className="fas fa-comment"></i> {post.comments.length}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
        {activeTab === "saved" && (
  <div className="posts-grid">
    {savedPosts.map((post) => (
      <div key={post.id} className="post-grid-item">
        <img src={`http://localhost:5000${post.image}`} alt={post.caption} />
        <div className="post-overlay">
          <div className="post-stats">
            <span><i className="fas fa-heart"></i> {post.likes}</span>
            <span><i className="fas fa-comment"></i> {post.comments.length}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
)}
        {activeTab === "tagged" && (
          <div className="posts-grid">
            {taggedPosts.map((post) => (
              <div key={post.id} className="post-grid-item">
                <img src={post.image} alt={post.caption} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
