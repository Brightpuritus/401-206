"use client";

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");
  const [activeTab, setActiveTab] = useState("top");
  const [results, setResults] = useState({
    users: [],
    posts: [],
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleOpenPostModal = (post) => {
    setSelectedPost(post);
    setShowPostModal(true);
  };
  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      // ดึงข้อมูลจาก API
      const [postsResponse, profilesResponse] = await Promise.all([
        fetch("http://localhost:5000/api/posts"),
        fetch("http://localhost:5000/api/profiles"),
      ]);

      const postsData = await postsResponse.json();
      const profilesData = await profilesResponse.json();

      // กรองข้อมูลตามคำค้นหา
      const filteredResults = {
        users: profilesData.filter((user) =>
          user.username.toLowerCase().includes(query.toLowerCase())
        ),
        posts: postsData.filter((post) =>
          post.username.toLowerCase().includes(query.toLowerCase()) // ใช้ post.username แทน post.user.username
        ),
        tags: [], // หากต้องการค้นหา tags ให้เพิ่ม logic ที่นี่
      };

      setResults(filteredResults);
    } catch (error) {
      console.error("Error fetching search data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    } else {
      return count;
    }
  };

  return (
    <div className="search-container">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      ) : (
        <div className="search-results">
          {activeTab === "top" && (
            <>
              {results.users.length > 0 && (
                <div className="results-section">
                  <h3>Accounts</h3>
                  <div className="user-results">
                    {results.users.map((user) => (
                      <Link key={user.id} to={`/profile/${user.username}`} className="user-result-item">
                        <img src={user.avatar ? `http://localhost:5000${user.avatar}` : "/placeholder.svg"} alt={user.username} />
                        <div className="user-result-info">
                          <div className="user-result-username">
                            {user.username}
                            {user.isVerified && <i className="fa-solid fa-circle-check verified-badge"></i>}
                          </div>
                          <div className="user-result-name">{user.fullName}</div>
                          <div className="user-result-followers">{formatCount(user.followers)} followers</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {results.posts.length > 0 && (
                <div className="results-section">
                  <h3>Posts</h3>
                  <div className="posts-grid">
                    {results.posts.map((post) => (
                      <div
                        key={post.id}
                        className="post-grid-item"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleOpenPostModal(post)}
                      >
                        <img src={post.image ? `http://localhost:5000${post.image}` : "/placeholder.svg"} alt="Post" />
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
                </div>
              )}
            </>
          )}
        </div>
      )}

      {showPostModal && selectedPost && (
        <>
          <div className="modal-overlay" onClick={handleClosePostModal} />
          <div className="post-modal">
            <div className="post-modal-content">
              <div className="post-modal-left">
                <img
                  src={`http://localhost:5000${selectedPost.image}`}
                  alt={selectedPost.caption}
                  className="post-image-hover"
                />
              </div>
              <div className="post-modal-right">
                <div className="post-modal-header">
                  <Link to={`/profile/${selectedPost.username}`} className="post-user-info">
                    <img
                      src={selectedPost.avatar ? `http://localhost:5000${selectedPost.avatar}` : "/placeholder.svg"}
                      alt={selectedPost.username}
                    />
                    <span>{selectedPost.username}</span>
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
                  {selectedPost.comments?.map((comment) => (
                    <div key={comment.id} className="comment">
                      <span className="username">{comment.username}</span>
                      {comment.text}
                    </div>
                  ))}
                </div>
                <div className="post-modal-actions">
                  <div className="post-actions">
                    <button className="action-btn">
                      <i className="fas fa-heart"></i>
                    </button>
                    <button className="action-btn">
                      <i className="fas fa-comment"></i>
                    </button>
                    <button className="action-btn">
                      <i className="far fa-bookmark"></i>
                    </button>
                  </div>
                  <div className="likes-count">{selectedPost.likes} likes</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Search;