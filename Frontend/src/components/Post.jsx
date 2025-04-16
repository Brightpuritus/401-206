"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import "./Post.css";

const Post = ({ post, currentUser }) => {
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUser.username) || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(post.isSavedByCurrentUser || false);
  const [comments, setComments] = useState(post.comments || []);
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}/toggle-like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentUser.username }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle like");
      }
      const data = await response.json();
      setLikesCount(data.likes);
      setIsLiked(!isLiked); // สลับสถานะไลค์
    } catch (error) {
      console.error("Error toggling like:", error);
      alert(error.message);
    }
  };
  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: currentUser.username,
          text: comment,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add comment");
      }
      const data = await response.json();
      setComments(data.comments);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}/toggle-save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: currentUser.username }), // ตรวจสอบว่ามี username
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle save");
      }
  
      const data = await response.json();
      setIsSaved(data.isSaved);
    } catch (error) {
      console.error("Error toggling save:", error);
      alert(error.message);
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
  {/* ปุ่มด้านซ้าย */}
  <div className="post-actions-left">
    {/* ปุ่มไลค์ */}
    <button className={`post-action ${isLiked ? "liked" : ""}`} onClick={handleLike}>
      <i className={`fa-${isLiked ? "solid" : "regular"} fa-heart`}></i>
    </button>

    {/* ปุ่มคอมเมนต์ */}
    <button className="post-action">
      <i className="fa-regular fa-comment"></i>
    </button>

    {/* ปุ่มแชร์ (paper plane) */}
    <button className="post-action">
      <i className="fa-regular fa-paper-plane"></i>
    </button>
  </div>

  {/* ปุ่มด้านขวา */}
  <div className="post-actions-right">
    {/* ปุ่มบันทึกโพสต์ */}
    <button className={`post-action ${isSaved ? "saved" : ""}`} onClick={handleSave}>
  <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark`}></i>
</button>
  </div>
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
        <strong>{comment.username}</strong>: {comment.text}
      </div>
    ))}
  </div>
)}

      <form className="post-add-comment" onSubmit={handleComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default Post;