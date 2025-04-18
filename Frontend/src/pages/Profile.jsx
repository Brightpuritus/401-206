"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./Profile.css";

const Profile = ({ currentUser, onUpdateUser }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]); // โพสต์ที่บันทึก
  const [taggedPosts, setTaggedPosts] = useState([]); // โพสต์ที่ถูกแท็ก
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts"); // แท็บที่เลือก
  const [isEditingFullName, setIsEditingFullName] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [profiles, setProfiles] = useState([]);

  const isOwnProfile = currentUser?.id === profile?.id;

  const handleShowFollowers = () => {
    setShowFollowersModal(true);
  };
  
  const handleCloseFollowersModal = () => {
    setShowFollowersModal(false);
  };
  const handleShowFollowing = () => {
    setShowFollowingModal(true);
  };
  
  const handleCloseFollowingModal = () => {
    setShowFollowingModal(false);
  };
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
        const savedPosts = allPosts.filter((post) => post.savedBy?.includes(username));
        setSavedPosts(savedPosts);
  
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

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profiles");
        if (!response.ok) {
          throw new Error("Failed to fetch profiles");
        }
        const data = await response.json();
        setProfiles(data);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    fetchProfiles();
  }, []);

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

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
  
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profile.id}/avatar`, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload avatar');
      }
  
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
  
      // อัพเดท global state และ localStorage
      if (currentUser?.id === profile.id) {
        const updatedUser = {
          ...currentUser,
          avatar: updatedProfile.avatar
        };
        onUpdateUser(updatedUser); // อัพเดท state ใน App component
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleToggleFollow = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profile.username}/toggle-follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUser: currentUser.username }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to toggle follow");
      }
  
      const data = await response.json();
      setProfile((prev) => ({
        ...prev,
        followers: data.followers,
      }));
  
      if (currentUser.username === profile.username) {
        onUpdateUser((prev) => ({
          ...prev,
          following: data.following,
        }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      alert("Failed to toggle follow. Please try again.");
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
          {isOwnProfile && (
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/jpeg,image/png"
              style={{ display: 'none' }}
            />
          )}
          <div 
            className={`avatar-container ${isOwnProfile ? 'clickable' : ''}`}
            onClick={() => isOwnProfile && fileInputRef.current?.click()}
          >
            <img 
              src={profile.avatar ? `http://localhost:5000${profile.avatar}` : "/placeholder.svg"} 
              alt={profile.username} 
            />
            {isOwnProfile && !isUploadingAvatar && (
              <div className="avatar-overlay">
                <i className="fas fa-camera"></i>
              </div>
            )}
            {isUploadingAvatar && (
              <div className="upload-overlay">
                Uploading...
              </div>
            )}
          </div>
        </div>




        <div className="profile-info">
        <div className="profile-top">
            <h2 className="profile-username">{profile.username}</h2>
            
 <button className="profile-edit-btn" onClick={() => setIsEditingFullName(true)}>
                Edit Profile
              </button>
            {currentUser.username !== profile.username && (
              
              <button
                className={`profile-follow-btn ${
                  profile.followers.includes(currentUser.username) ? "unfollow" : "follow"
                }`}
                onClick={handleToggleFollow}
              >
                {profile.followers.includes(currentUser.username) ? "Unfollow" : "Follow"}
              </button>
            )}
        </div>
        <div className="profile-stats">
  <div className="stat-item" onClick={handleShowFollowers}>
    <span className="stat-value">{profile.followers.length}</span> followers
  </div>
  <div className="stat-item" onClick={handleShowFollowing}>
    <span className="stat-value">{profile.following.length}</span> following
  </div>
</div>
{showFollowingModal && (
  <>
    <div className="modal-overlay" onClick={handleCloseFollowingModal} />
    <div className="following-modal">
      <h3>Following</h3>
      <ul className="following-list">
        {profile.following.map((following) => (
          <li key={following} className="following-item">
            <img
              src={`http://localhost:5000/avatars/${following}.png`} // สมมติว่า avatar มีชื่อไฟล์ตาม username
              alt={following}
              className="following-avatar"
            />
            <span>{following}</span>
          </li>
        ))}
      </ul>
      <button className="close-modal-btn" onClick={handleCloseFollowingModal}>
        Close
      </button>
    </div>
  </>
)}
{showFollowersModal && (
  <>
    <div className="modal-overlay" onClick={handleCloseFollowersModal} />
    <div className="followers-modal">
  <h3>Followers</h3>
  <ul className="followers-list">
  {profile.followers.map((follower) => {
    // ค้นหาโปรไฟล์ของ follower
    const followerProfile = profiles.find((p) => p.username === follower);

    return (
      <li key={follower} className="follower-item">
        <img
          src={followerProfile?.avatar ? `http://localhost:5000${followerProfile.avatar}` : "/placeholder.svg"}
          onError={(e) => (e.target.src = "/placeholder.svg")} // ใช้ placeholder หากรูปภาพไม่พบ
          alt={follower}
          className="follower-avatar"
        />
        <span>{follower}</span>
      </li>
    );
  })}
</ul>
  <button className="close-modal-btn" onClick={handleCloseFollowersModal}>
    Close
  </button>
</div>
  </>
)}
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
