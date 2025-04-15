"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Post.css"

const Post = ({ post, currentUser }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByCurrentUser || false);
  const [isSaved, setIsSaved] = useState(post.isSavedByCurrentUser || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        user: currentUser,
        text: comment,
        timestamp: new Date().toISOString(),
      };
      setComments([...comments, newComment]);
      setComment("");
    }
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <div className="post card">
      <div className="post-header">
        <Link to={`/profile/${post.username}`} className="post-user">
          <img src={post.avatar || "/placeholder.svg"} alt={post.username} className="post-avatar" />
          <span className="post-username">{post.username}</span>
        </Link>
        <button className="post-more">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <div className="post-image">
        <img src={`http://localhost:5000${post.image}`} alt="Post" />
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button className={`post-action ${isLiked ? "liked" : ""}`} onClick={handleLike}>
            <i className={`fa-${isLiked ? "solid" : "regular"} fa-heart`}></i>
          </button>
          <button className="post-action">
            <i className="fa-regular fa-comment"></i>
          </button>
          <button className="post-action">
            <i className="fa-regular fa-paper-plane"></i>
          </button>
        </div>
        <button className={`post-action ${isSaved ? "saved" : ""}`} onClick={handleSave}>
          <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark`}></i>
        </button>
      </div>

      <div className="post-likes">
        <span>{likesCount} likes</span>
      </div>

      <div className="post-caption">
        <Link to={`/profile/${post.username}`} className="post-username">
          {post.username}
        </Link>{" "}
        {post.caption}
      </div>

      {comments.length > 0 && (
        <div className="post-comments">
          {comments.length > 2 && !showAllComments && (
            <button className="view-comments" onClick={() => setShowAllComments(true)}>
              View all {comments.length} comments
            </button>
          )}

          {displayedComments.map((comment) => (
            <div key={comment.id} className="post-comment">
              <Link to={`/profile/${comment.user.username}`} className="post-username">
                {comment.user.username}
              </Link>{" "}
              {comment.text}
            </div>
          ))}
        </div>
      )}

      <div className="post-timestamp">
        {new Date(post.timestamp).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
        })}
      </div>

      <form className="post-add-comment" onSubmit={handleComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {comment.trim() && (
          <button type="submit" className="post-comment-button">
            Post
          </button>
        )}
      </form>
    </div>
  );
};

export default Post;
