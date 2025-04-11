"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import "./Search.css"

const Search = () => {
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeTab, setActiveTab] = useState("top")
  const [results, setResults] = useState({
    users: [],
    posts: [],
    tags: [],
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery)
    }
  }, [initialQuery])

  const performSearch = (query) => {
    if (!query.trim()) return

    setLoading(true)

    // Simulate API call for search results
    setTimeout(() => {
      const mockResults = {
        users: [
          {
            id: 2,
            username: "yamaha_official",
            fullName: "Yamaha Official",
            avatar: "/assets/yamaha-profile.jpg",
            isVerified: true,
            followers: 1500000,
          },
          {
            id: 3,
            username: "yamaha_music",
            fullName: "Yamaha Music",
            avatar: "/assets/yamaha-music.jpg",
            isVerified: true,
            followers: 800000,
          },
          {
            id: 4,
            username: "yamaha_marine",
            fullName: "Yamaha Marine",
            avatar: "/assets/yamaha-marine.jpg",
            isVerified: true,
            followers: 500000,
          },
        ],
        posts: [
          {
            id: 1,
            image: "/assets/post-1.jpg",
            likes: 1245,
            comments: 89,
            user: {
              id: 2,
              username: "yamaha_official",
              avatar: "/assets/yamaha-profile.jpg",
            },
          },
          {
            id: 2,
            image: "/assets/post-2.jpg",
            likes: 876,
            comments: 42,
            user: {
              id: 3,
              username: "yamaha_music",
              avatar: "/assets/yamaha-music.jpg",
            },
          },
          {
            id: 3,
            image: "/assets/post-3.jpg",
            likes: 543,
            comments: 21,
            user: {
              id: 4,
              username: "yamaha_marine",
              avatar: "/assets/yamaha-marine.jpg",
            },
          },
        ],
        tags: [
          {
            id: 1,
            name: "yamaharacing",
            postsCount: 25678,
          },
          {
            id: 2,
            name: "yamahamusic",
            postsCount: 18432,
          },
          {
            id: 3,
            name: "yamahamarine",
            postsCount: 9876,
          },
        ],
      }

      setResults(mockResults)
      setLoading(false)
    }, 1000)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    } else {
      return count
    }
  }

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

      {searchQuery && (
        <div className="search-tabs">
          <button className={`search-tab ${activeTab === "top" ? "active" : ""}`} onClick={() => setActiveTab("top")}>
            Top
          </button>
          <button
            className={`search-tab ${activeTab === "accounts" ? "active" : ""}`}
            onClick={() => setActiveTab("accounts")}
          >
            Accounts
          </button>
          <button
            className={`search-tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button className={`search-tab ${activeTab === "tags" ? "active" : ""}`} onClick={() => setActiveTab("tags")}>
            Tags
          </button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching...</p>
        </div>
      ) : searchQuery ? (
        <div className="search-results">
          {activeTab === "top" && (
            <>
              {results.users.length > 0 && (
                <div className="results-section">
                  <h3>Accounts</h3>
                  <div className="user-results">
                    {results.users.slice(0, 3).map((user) => (
                      <Link key={user.id} to={`/profile/${user.username}`} className="user-result-item">
                        <img src={user.avatar || "/placeholder.svg"} alt={user.username} />
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

              {results.tags.length > 0 && (
                <div className="results-section">
                  <h3>Tags</h3>
                  <div className="tag-results">
                    {results.tags.slice(0, 3).map((tag) => (
                      <div key={tag.id} className="tag-result-item">
                        <div className="tag-result-icon">
                          <i className="fa-solid fa-hashtag"></i>
                        </div>
                        <div className="tag-result-info">
                          <div className="tag-result-name">#{tag.name}</div>
                          <div className="tag-result-count">{formatCount(tag.postsCount)} posts</div>
                        </div>
                      </div>
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
                        <img src={post.image || "/placeholder.svg"} alt="Post" />
                        <div className="post-overlay">
                          <div className="post-stats">
                            <div className="post-stat">
                              <i className="fa-solid fa-heart"></i> {post.likes}
                            </div>
                            <div className="post-stat">
                              <i className="fa-solid fa-comment"></i> {post.comments}
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

          {activeTab === "accounts" && (
            <div className="user-results full">
              {results.users.length > 0 ? (
                results.users.map((user) => (
                  <Link key={user.id} to={`/profile/${user.username}`} className="user-result-item">
                    <img src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <div className="user-result-info">
                      <div className="user-result-username">
                        {user.username}
                        {user.isVerified && <i className="fa-solid fa-circle-check verified-badge"></i>}
                      </div>
                      <div className="user-result-name">{user.fullName}</div>
                      <div className="user-result-followers">{formatCount(user.followers)} followers</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="no-results">
                  <i className="fa-solid fa-user-slash"></i>
                  <h3>No Accounts Found</h3>
                  <p>Try searching for a different username.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "posts" && (
            <div className="posts-results">
              {results.posts.length > 0 ? (
                <div className="posts-grid full">
                  {results.posts.map((post) => (
                    <div key={post.id} className="post-grid-item">
                      <img src={post.image || "/placeholder.svg"} alt="Post" />
                      <div className="post-overlay">
                        <div className="post-stats">
                          <div className="post-stat">
                            <i className="fa-solid fa-heart"></i> {post.likes}
                          </div>
                          <div className="post-stat">
                            <i className="fa-solid fa-comment"></i> {post.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <i className="fa-solid fa-image-slash"></i>
                  <h3>No Posts Found</h3>
                  <p>Try searching for a different term.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "tags" && (
            <div className="tag-results full">
              {results.tags.length > 0 ? (
                results.tags.map((tag) => (
                  <div key={tag.id} className="tag-result-item">
                    <div className="tag-result-icon">
                      <i className="fa-solid fa-hashtag"></i>
                    </div>
                    <div className="tag-result-info">
                      <div className="tag-result-name">#{tag.name}</div>
                      <div className="tag-result-count">{formatCount(tag.postsCount)} posts</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <i className="fa-solid fa-hashtag"></i>
                  <h3>No Tags Found</h3>
                  <p>Try searching for a different hashtag.</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="search-placeholder">
          <i className="fa-solid fa-search"></i>
          <h3>Search Yamaha Social</h3>
          <p>Enter a search term to find accounts, posts, or hashtags.</p>
        </div>
      )}
    </div>
  )
}

export default Search
