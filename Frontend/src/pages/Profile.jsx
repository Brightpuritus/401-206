"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]); // โพสต์ที่บันทึก
  const [taggedPosts, setTaggedPosts] = useState([]); // โพสต์ที่ถูกแท็ก
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts"); // แท็บที่เลือก

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

        // Fetch posts
        const postsResponse = await fetch(`http://localhost:5000/api/posts/${username}`);
        if (!postsResponse.ok) {
          throw new Error("Posts not found");
        }
        const postsData = await postsResponse.json();
        setPosts(postsData);

        // Fetch saved posts (mock data for now)
        const savedResponse = await fetch(`http://localhost:5000/api/saved/${username}`);
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
          <h2>{profile.username}</h2>
          <h3>followers : {profile.followers}</h3>
          <h3>following : {profile.following}</h3>
          <p>{profile.bio}</p>
          <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer">
            {profile.website}
          </a>
        </div>
      </div>

      {/* เมนูแท็บ */}
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          onClick={() => setActiveTab("posts")}
        >
          Posts
        </button>
        <button
          className={`tab-button ${activeTab === "saved" ? "active" : ""}`}
          onClick={() => setActiveTab("saved")}
        >
          Saved
        </button>
        <button
          className={`tab-button ${activeTab === "tagged" ? "active" : ""}`}
          onClick={() => setActiveTab("tagged")}
        >
          Tagged
        </button>
      </div>

      {/* เนื้อหาของแท็บ */}
      <div className="profile-content">
        {activeTab === "posts" && (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-grid-item">
                <img src={post.image} alt={post.caption} />
                <p>{post.caption}</p>
              </div>
            ))}
          </div>
        )}
        {activeTab === "saved" && (
          <div className="posts-grid">
            {savedPosts.map((post) => (
              <div key={post.id} className="post-grid-item">
                <img src={post.image} alt={post.caption} />
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
