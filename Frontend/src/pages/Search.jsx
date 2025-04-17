"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("top");
  const [results, setResults] = useState({
    users: [],
    posts: [],
    tags: [],
  });
  const [loading, setLoading] = useState(false);

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

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

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
      <div className="search-header">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="fa-solid fa-search"></i>
          </button>
        </form>
      </div>

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
                      <div key={post.id} className="post-grid-item">
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
    </div>
  );
};

export default Search;