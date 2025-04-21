"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "./Profile.css";

const Profile = ({ currentUser, onUpdateUser }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [followers, setFollowers] = useState([]); // <-- เพิ่ม
  const [following, setFollowing] = useState([]); // <-- เพิ่ม
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
  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

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
    const fetchProfileAndRelations = async () => {
      try {
        // Fetch profile
        const profileResponse = await fetch(`http://localhost:5000/api/profiles/${username}`);
        if (!profileResponse.ok) throw new Error("Profile not found");
        const profileData = await profileResponse.json();
        setProfile(profileData);
        setNewFullName(profileData.fullName);

        // Fetch followers
        const followersRes = await fetch(`http://localhost:5000/api/profiles/${username}/followers`);
        setFollowers(await followersRes.json());

        // Fetch following
        const followingRes = await fetch(`http://localhost:5000/api/profiles/${username}/following`);
        setFollowing(await followingRes.json());

        // Fetch all posts
        const postsResponse = await fetch(`http://localhost:5000/api/posts`);
        if (!postsResponse.ok) {
          throw new Error("Posts not found");
        }
        const allPosts = await postsResponse.json();

        // Filter posts by username and sort from newest to oldest
        const userPosts = allPosts
          .filter((post) => post.username === username)
          .sort((a, b) => b.id - a.id);
        setPosts(userPosts);

        // Sort saved posts as well
        const savedPosts = allPosts
          .filter((post) => post.savedBy?.includes(username))
          .sort((a, b) => b.id - a.id);
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
    fetchProfileAndRelations();
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: newFullName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditingFullName(false);
    } catch (error) {
      console.error("Error updating fullName:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profile.id}/avatar`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);

      // อัพเดท global state และ localStorage
      if (currentUser?.id === profile.id) {
        const updatedUser = {
          ...currentUser,
          avatar: updatedProfile.avatar,
        };
        onUpdateUser(updatedUser); // อัพเดท state ใน App component
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleToggleFollow = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/profiles/${profile.username}/toggle-follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUser: currentUser.username }),
      });
      if (!response.ok) throw new Error("Failed to toggle follow");
      // ดึง followers ใหม่หลังจาก follow/unfollow
      const followersRes = await fetch(`http://localhost:5000/api/profiles/${profile.username}/followers`);
      setFollowers(await followersRes.json());
    } catch (error) {
      alert("Failed to toggle follow. Please try again.");
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost({ ...post }); // สร้าง copy ของ post object
    setShowPostModal(true);
  };

  const handleClosePostModal = () => {
    const currentPost = posts.find((p) => p.id === selectedPost?.id);
    if (currentPost) {
      setSelectedPost({ ...currentPost }); // สร้าง copy ของ currentPost
    }
    setShowPostModal(false);
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/toggle-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentUser.username }),
      });

      if (!response.ok) throw new Error('Failed to like/unlike post');

      const updatedPost = await response.json();
      setPosts(
        posts.map((post) => ( post.id === postId ? { ...post, likes: updatedPost.likes, likedBy: updatedPost.likedBy } : post))
      );
      setSelectedPost(prev => prev?.id === postId ? { ...prev, likes: updatedPost.likes, likedBy: updatedPost.likedBy } : prev);

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSavePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/toggle-save`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser.username })
    });

    if (!response.ok) throw new Error('Failed to save/unsave post');

    const { isSaved } = await response.json();

    // อัปเดตสถานะของโพสต์ใน state
    setPosts(posts.map(post =>
        post.id === postId
            ? {
                ...post,
                savedBy: isSaved
                    ? [...post.savedBy, currentUser.username]
                    : post.savedBy.filter(user => user !== currentUser.username)
            }
            : post
    ));

    // อัปเดต selectedPost ถ้ากำลังดูโพสต์นี้อยู่
    setSelectedPost(prev =>
        prev?.id === postId
            ? {
                ...prev,
                savedBy: isSaved
                    ? [...prev.savedBy, currentUser.username]
                    : prev.savedBy.filter(user => user !== currentUser.username)
            }
            : prev
    );} catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser.username,
          text: comment,
        }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const updatedPost = await response.json();

      // อัพเดท posts และ selectedPost แบบ atomic
      setPosts((prevPosts) => {
        const newPosts = prevPosts.map((post) =>
          post.id === postId ? { ...post, ...updatedPost } : post
        );
        return newPosts;
      });

      setSelectedPost((prevPost) => ({
        ...prevPost,
        ...updatedPost,
      }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    const fetchProfilePosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        const allPosts = await response.json();
        // กรองโพสต์ตาม username และเรียงจากใหม่ไปเก่า
        const userPosts = allPosts
          .filter((post) => post.username === username)
          .sort((a, b) => {
            // เรียงตาม id จากมากไปน้อย (ใหม่ไปเก่า)
            return b.id - a.id;
          });
        setPosts(userPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchProfilePosts();
  }, [username]);

  // เพิ่ม useEffect เพื่อติดตามการเปลี่ยนแปลงของ posts
  useEffect(() => {
    if (selectedPost && posts.length > 0) {
      const updatedPost = posts.find((p) => p.id === selectedPost.id);
      if (updatedPost) {
        setSelectedPost(updatedPost);
      }
    }
  }, [posts]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Profile not found.</p>;
  }

  const isFollowing = followers.includes(currentUser.username);

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
              style={{ display: "none" }}
            />
          )}
          <div
            className={`avatar-container ${isOwnProfile ? "clickable" : ""}`}
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

            {isOwnProfile ? (
              <button className="profile-edit-btn" onClick={() => setIsEditingFullName(true)}>
                Edit Profile
              </button>
            ) : (
              <button
                className={`profile-follow-btn ${isFollowing ? "unfollow" : "follow"}`}
                onClick={handleToggleFollow}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
          <div className="profile-stats">
            <div className="stat-item" onClick={handleShowFollowers}>
              <span className="stat-value">{followers.length}</span> followers
            </div>
            <div className="stat-item" onClick={handleShowFollowing}>
              <span className="stat-value">{following.length}</span> following
            </div>
          </div>
          {showFollowingModal && (
            <>
              <div className="modal-overlay" onClick={handleCloseFollowingModal} />
              <div className="following-modal">
                <h3>Following</h3>
                <ul className="following-list">
                  {following.map((follow) => (
                    <li key={follow} className="following-item">
                      <span>{follow}</span>
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
                  {followers.map((follower) => (
                    <li key={follower} className="follower-item">
                      <span>{follower}</span>
                    </li>
                  ))}
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
              <a
                href={`https://${profile.website}`}
                className="profile-website"
                target="_blank"
                rel="noopener noreferrer"
              >
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
            <form
              className="edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleEditFullName();
              }}
            >
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
        {isOwnProfile && (
          <button
            className={`tab-button ${activeTab === "saved" ? "active" : ""}`}
            onClick={() => setActiveTab("saved")}
          >
            <i className="far fa-bookmark"></i> SAVED
          </button>
        )}
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
              <div key={post.id} className="post-grid-item" onClick={() => handlePostClick(post)}>
                <img src={`http://localhost:5000${post.image}`} alt={post.caption} />
                <div className="post-overlay">
                  <div className="post-stats">
                    <div className="post-stat">
                      <i className="fas fa-heart"></i>
                      {post.likes || 0}
                    </div>
                    <div className="post-stat">
                      <i className="fas fa-comment"></i>
                      {post.comments?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "saved" && (
          <div className="posts-grid">
            {savedPosts.map((post) => (
              <div key={post.id} className="post-grid-item" onClick={() => handlePostClick(post)}>
                <img src={`http://localhost:5000${post.image}`} alt={post.caption} />
                <div className="post-overlay">
                  <div className="post-stats">
                    <span>
                      <i className="fas fa-heart"></i> {post.likes}
                    </span>
                    <span>
                      <i className="fas fa-comment"></i> {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "tagged" && (
          <div className="posts-grid">
            {taggedPosts.map((post) => (
              <div key={post.id} className="post-grid-item" onClick={() => handlePostClick(post)}>
                <img src={post.image} alt={post.caption} />
              </div>
            ))}
          </div>
        )}
      </div>
      {showPostModal && selectedPost && (
        <>
          <div className="modal-overlay" onClick={handleClosePostModal} />
          <div className="post-modal">
            <div className="post-modal-content">
              <div className="post-modal-left">
                <img src={`http://localhost:5000${selectedPost.image}`} alt={selectedPost.caption} />
              </div>
              <div className="post-modal-right">
                <div className="post-modal-header">
                  <Link to={`/profile/${selectedPost.username}`} className="post-user-info">
                    <img
                      src={profile.avatar ? `http://localhost:5000${profile.avatar}` : "/placeholder.svg"}
                      alt={profile.username}
                    />
                    <span>{profile.username}</span>
                  </Link>
                  <button className="close-modal-btn" onClick={handleClosePostModal}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="post-modal-comments">
                  <div className="post-caption">
                    <span className="username">{selectedPost.username}</span>
                    {selectedPost.caption}
                  </div>
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <span className="username">{comment.username}</span>
                      {comment.text}
                    </div>
                  ))}
                </div>

                <div className="post-modal-actions">
                  <div className="post-actions">
                    <button className="action-btn" onClick={() => handleLikePost(selectedPost.id)}>
                      <i
                        className={`fas fa-heart ${
                          selectedPost.likedBy?.includes(currentUser.username) ? "liked" : ""
                        }`}
                      ></i>
                    </button>
                    <button className="action-btn">
                      <i className="fas fa-comment"></i>
                    </button>
                    <button className="action-btn" onClick={() => handleSavePost(selectedPost.id)}>
                      <i
                        className={`far fa-bookmark ${
                          selectedPost.savedBy?.includes(currentUser.username) ? "saved" : ""
                        }`}
                      ></i>
                    </button>
                  </div>
                  <div className="likes-count">{selectedPost.likes} likes</div>
                </div>

                <form
                  className="comment-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const comment = e.target.comment.value;
                    if (comment.trim()) {
                      handleAddComment(selectedPost.id, comment);
                      e.target.comment.value = "";
                    }
                  }}
                >
                  <textarea
                    name="comment"
                    className="comment-input"
                    placeholder="Add a comment..."
                    rows="1"
                  />
                  <button type="submit" className="post-comment-btn">
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
