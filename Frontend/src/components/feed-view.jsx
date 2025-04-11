"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, MessageCircle, Bookmark, Send, ChevronUp, ChevronDown, Reply } from "lucide-react"
import "../styles/components/feed.css"

// Mock data for posts
const initialPosts = [
  {
    id: 1,
    user: {
      username: "yamaha_official",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Yamaha Official",
    },
    image: "/placeholder.svg?height=600&width=600",
    caption:
      "Experience the thrill of the new Yamaha R1. Engineered for the track, built for the streets. #YamahaR1 #RevYourHeart",
    likes: 1245,
    liked: false,
    saved: false,
    commentsVisible: true,
    comments: [
      {
        id: 101,
        user: "moto_enthusiast",
        text: "This is absolutely stunning! Can't wait to test ride one!",
        timestamp: "2 hours ago",
        likes: 24,
        liked: false,
        replies: [],
      },
      {
        id: 102,
        user: "speed_demon",
        text: "The best motorcycle in its class, hands down! 🏍️",
        timestamp: "1 hour ago",
        likes: 15,
        liked: false,
        replies: [],
      },
    ],
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: {
      username: "yamaha_music",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Yamaha Music",
    },
    image: "/placeholder.svg?height=600&width=600",
    caption: "Introducing the new Yamaha Grand Piano. Perfect harmony in every note. #YamahaMusic #GrandPiano",
    likes: 876,
    liked: false,
    saved: false,
    commentsVisible: true,
    comments: [
      {
        id: 201,
        user: "piano_lover",
        text: "The sound quality is unmatched! 🎹",
        timestamp: "5 hours ago",
        likes: 18,
        liked: false,
        replies: [],
      },
      {
        id: 202,
        user: "music_teacher",
        text: "My students would love this! Such beautiful craftsmanship.",
        timestamp: "4 hours ago",
        likes: 9,
        liked: false,
        replies: [],
      },
    ],
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    user: {
      username: "yamaha_marine",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Yamaha Marine",
    },
    image: "/placeholder.svg?height=600&width=600",
    caption:
      "Set sail with the new Yamaha outboard motors. Power and reliability for your adventures on water. #YamahaMarine #BoatingLife",
    likes: 543,
    liked: false,
    saved: false,
    commentsVisible: true,
    comments: [
      {
        id: 301,
        user: "sea_captain",
        text: "Best outboard motors I've ever used! Reliable in all conditions.",
        timestamp: "1 day ago",
        likes: 12,
        liked: false,
        replies: [],
      },
      {
        id: 302,
        user: "weekend_sailor",
        text: "Just upgraded my boat with one of these. Game changer! ⛵",
        timestamp: "23 hours ago",
        likes: 7,
        liked: false,
        replies: [],
      },
    ],
    timestamp: "1 day ago",
  },
]

export function Feed() {
  const [posts, setPosts] = useState(initialPosts)
  const [newComments, setNewComments] = useState({})
  const [replyingTo, setReplyingTo] = useState({
    postId: null,
    commentId: null,
  })
  const [replyText, setReplyText] = useState("")

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        }
        return post
      }),
    )
  }

  const handleSave = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            saved: !post.saved,
          }
        }
        return post
      }),
    )
  }

  const toggleComments = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsVisible: !post.commentsVisible,
          }
        }
        return post
      }),
    )
  }

  const handleCommentChange = (postId, value) => {
    setNewComments({
      ...newComments,
      [postId]: value,
    })
  }

  const handleCommentLike = (postId, commentId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  liked: !comment.liked,
                  likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )
  }

  const handleReplyLike = (postId, commentId, replyId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.map((reply) => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        liked: !reply.liked,
                        likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                      }
                    }
                    return reply
                  }),
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )
  }

  const handleAddComment = (postId) => {
    if (!newComments[postId]?.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          // Make sure comments are visible when adding a new comment
          return {
            ...post,
            commentsVisible: true,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                user: "current_user",
                text: newComments[postId],
                timestamp: "Just now",
                likes: 0,
                liked: false,
                replies: [],
              },
            ],
          }
        }
        return post
      }),
    )

    // Clear the comment input
    setNewComments({
      ...newComments,
      [postId]: "",
    })
  }

  const handleReplyClick = (postId, commentId) => {
    setReplyingTo({ postId, commentId })
    setReplyText("")
  }

  const handleReplyChange = (e) => {
    setReplyText(e.target.value)
  }

  const handleAddReply = () => {
    if (!replyText.trim() || !replyingTo.postId || !replyingTo.commentId) return

    setPosts(
      posts.map((post) => {
        if (post.id === replyingTo.postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === replyingTo.commentId) {
                return {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    {
                      id: Date.now(),
                      user: "current_user",
                      text: replyText,
                      timestamp: "Just now",
                      likes: 0,
                      liked: false,
                    },
                  ],
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )

    // Clear the reply input and reset replyingTo
    setReplyText("")
    setReplyingTo({ postId: null, commentId: null })
  }

  const cancelReply = () => {
    setReplyingTo({ postId: null, commentId: null })
    setReplyText("")
  }

  // Function to add a new post to the feed
  const addNewPost = (newPost) => {
    // Add commentsVisible property to new posts
    const postWithCommentsVisible = {
      ...newPost,
      commentsVisible: true,
    }
    setPosts([postWithCommentsVisible, ...posts])
  }

  // Make the addNewPost function available globally
  if (typeof window !== "undefined") {
    window.addNewPost = addNewPost
  }

  return (
    <div className="feed">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <div className="post-header">
            <Link to={`/profile/${post.user.username}`} className="post-user-link">
              <div className="avatar">
                <img src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} className="avatar-image" />
              </div>
              <div className="post-user-info">
                <p className="post-user-name">{post.user.name}</p>
                <p className="post-user-username">@{post.user.username}</p>
              </div>
            </Link>
          </div>
          <div className="post-image-container">
            <img src={post.image || "/placeholder.svg"} alt="Post image" className="post-image" />
          </div>
          <div className="post-footer">
            <div className="post-actions">
              <div className="post-action-buttons">
                <button className={`icon-button ${post.liked ? "active" : ""}`} onClick={() => handleLike(post.id)}>
                  <Heart className={post.liked ? "fill-current" : ""} />
                </button>
                <button className="icon-button" onClick={() => toggleComments(post.id)}>
                  <MessageCircle />
                  {post.comments.length > 0 && <span className="notification-badge">{post.comments.length}</span>}
                </button>
                <button className="icon-button">
                  <Send />
                </button>
              </div>
              <button className={`icon-button ${post.saved ? "active" : ""}`} onClick={() => handleSave(post.id)}>
                <Bookmark className={post.saved ? "fill-current" : ""} />
              </button>
            </div>
            <div className="post-likes">{post.likes} likes</div>
            <div className="post-caption">
              <Link to={`/profile/${post.user.username}`} className="post-caption-username">
                {post.user.username}
              </Link>{" "}
              {post.caption}
            </div>

            {/* Comments section with toggle */}
            {post.comments.length > 0 && (
              <div className="post-comments">
                <button className="post-comments-toggle" onClick={() => toggleComments(post.id)}>
                  {post.commentsVisible ? (
                    <>
                      <ChevronUp size={16} /> Hide comments
                    </>
                  ) : (
                    <>
                      <ChevronDown size={16} /> View all {post.comments.length} comments
                    </>
                  )}
                </button>

                {post.commentsVisible && (
                  <div className="comments-list">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="comment">
                        <div className="comment-content">
                          <div className="comment-text">
                            <Link to={`/profile/${comment.user}`} className="comment-username">
                              {comment.user}
                            </Link>{" "}
                            {comment.text}
                            <div className="comment-meta">
                              <button
                                className={`comment-like ${comment.liked ? "active" : ""}`}
                                onClick={() => handleCommentLike(post.id, comment.id)}
                              >
                                <Heart size={12} className={comment.liked ? "fill-current" : ""} />
                                <span>{comment.likes}</span>
                              </button>
                              <span className="comment-timestamp">{comment.timestamp}</span>
                              <button
                                className="comment-reply-button"
                                onClick={() => handleReplyClick(post.id, comment.id)}
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                          <div className="comment-actions">
                            <button
                              className={`icon-button ${comment.liked ? "active" : ""}`}
                              onClick={() => handleCommentLike(post.id, comment.id)}
                            >
                              <Heart size={16} className={comment.liked ? "fill-current" : ""} />
                            </button>
                            <button className="icon-button" onClick={() => handleReplyClick(post.id, comment.id)}>
                              <Reply size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="comment-replies">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="comment">
                                <div className="comment-content">
                                  <div className="comment-text">
                                    <Link to={`/profile/${reply.user}`} className="comment-username">
                                      {reply.user}
                                    </Link>{" "}
                                    {reply.text}
                                    <div className="comment-meta">
                                      <button
                                        className={`comment-like ${reply.liked ? "active" : ""}`}
                                        onClick={() => handleReplyLike(post.id, comment.id, reply.id)}
                                      >
                                        <Heart size={12} className={reply.liked ? "fill-current" : ""} />
                                        <span>{reply.likes || 0}</span>
                                      </button>
                                      <span className="comment-timestamp">{reply.timestamp}</span>
                                    </div>
                                  </div>
                                  <button
                                    className={`icon-button ${reply.liked ? "active" : ""}`}
                                    onClick={() => handleReplyLike(post.id, comment.id, reply.id)}
                                  >
                                    <Heart size={16} className={reply.liked ? "fill-current" : ""} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply input */}
                        {replyingTo.postId === post.id && replyingTo.commentId === comment.id && (
                          <div className="comment-reply-form">
                            <input
                              type="text"
                              placeholder={`Reply to ${comment.user}...`}
                              value={replyText}
                              onChange={handleReplyChange}
                              className="form-input"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddReply()
                                } else if (e.key === "Escape") {
                                  cancelReply()
                                }
                              }}
                            />
                            <button className="btn btn-ghost" onClick={handleAddReply} disabled={!replyText.trim()}>
                              Post
                            </button>
                            <button className="btn btn-ghost" onClick={cancelReply}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="post-timestamp">{post.timestamp}</div>

            {/* Always show comment input, even when comments are hidden */}
            <div className="comment-form">
              <input
                type="text"
                placeholder="Add a comment..."
                className="form-input"
                value={newComments[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(post.id)
                  }
                }}
              />
              <button
                className="btn btn-ghost"
                onClick={() => handleAddComment(post.id)}
                disabled={!newComments[post.id]?.trim()}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
