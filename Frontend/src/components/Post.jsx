"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Post.css";

const Post = ({ post, currentUser }) => {
  const [postUserProfile, setPostUserProfile] = useState(null);
  const [isLiked, setIsLiked] = useState(post.likedBy?.includes(currentUser.username) || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isSaved, setIsSaved] = useState(post.isSavedByCurrentUser || false);
  const [comments, setComments] = useState(post.comments || []);
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [editedImage, setEditedImage] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const fetchPostUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profiles/${post.username}`);
        if (response.ok) {
          const profile = await response.json();
          setPostUserProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching post user profile:", error);
      }
    };
    fetchPostUserProfile();
  }, [post.username]);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}/toggle-like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle like");
      }
      const data = await response.json();
      setLikesCount(data.likes !== undefined ? data.likes : (isLiked ? likesCount - 1 : likesCount + 1));
      setIsLiked(!isLiked);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: currentUser.username,
          text: comment,
        }),
      });
      if (!response.ok) throw new Error("Failed to add comment");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: currentUser.username }),
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

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", editedCaption);
      if (editedImage) formData.append("image", editedImage);

      const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to update post");

      const data = await response.json();
      setIsEditing(false);
      setEditedCaption(data.post.caption);
      if (data.post.image) post.image = data.post.image;
      window.location.reload();
    } catch (error) {
      console.error("Error updating post:", error);
      alert(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete post");
      alert("Post deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
    }
  };

  const handleOpenPostModal = () => {
    setSelectedPost(post);
    setShowPostModal(true);
  };

  const handleClosePostModal = () => {
    setShowPostModal(false);
    setSelectedPost(null);
  };

  const displayedComments = showAllComments ? comments : comments.slice(0, 2);

  return (
    <div className="post card">
      <div className="post-header">
        <Link to={`/profile/${post.username}`} className="post-user">
          <img
            src={postUserProfile?.avatar ? `http://localhost:5000${postUserProfile.avatar}` : "/placeholder.svg"}
            alt={post.username}
            className="post-avatar"
          />
          <span className="post-username">{post.username}</span>
        </Link>
        <div className="post-more-container">
          <button className="post-more" onClick={toggleMenu}>
            <i className="fa-solid fa-ellipsis"></i>
          </button>
          {showMenu && (
            <div className="post-more-menu">
              {post.username === currentUser.username && (
                <>
                  <button onClick={() => setIsEditing(true)}>Edit Post</button>
                  <button onClick={handleDelete}>Delete Post</button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="post-image">
        <img
          src={`http://localhost:5000${post.image}`}
          alt="Post"
          className="post-image-hover"
          style={{ cursor: "pointer" }}
          onClick={handleOpenPostModal}
        />
      </div>

      <div className="post-actions">
        <div className="post-actions-left">
          <button className={`post-action ${isLiked ? "liked" : ""}`} onClick={handleLike}>
            <i className={`fa-${isLiked ? "solid" : "regular"} fa-heart`}></i>
          </button>
          <button className="post-action" onClick={() => setShowCommentForm(!showCommentForm)}>
            <i className="fa-regular fa-comment"></i>
          </button>
        </div>
        <div className="post-actions-right">
          <button className={`post-action ${isSaved ? "saved" : ""}`} onClick={handleSave}>
            <i className={`fa-${isSaved ? "solid" : "regular"} fa-bookmark`}></i>
          </button>
        </div>
      </div>

      <div className="post-likes">
        <span>{likesCount} likes</span>
      </div>

      <div className="post-caption">
        {isEditing ? (
          <div className="edit-caption">
            <input
              type="text"
              value={editedCaption}
              onChange={(e) => setEditedCaption(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditedImage(e.target.files[0])}
            />
            <button onClick={handleEdit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <Link to={`/profile/${post.username}`} className="post-username">
              {post.username}
            </Link>{" "}
            {post.caption}
          </>
        )}
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

      {showCommentForm && (
        <form className="post-add-comment" onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>
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
                      src={postUserProfile?.avatar ? `http://localhost:5000${postUserProfile.avatar}` : "/placeholder.svg"}
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
                  {selectedPost.comments.map((comment) => (
                    <div key={comment.id} className="comment">
                      <span className="username">{comment.username}</span>
                      {comment.text}
                    </div>
                  ))}
                </div>
                <div className="post-modal-actions">
                  <div className="post-actions">
                    <button className="action-btn" onClick={handleLike}>
                      <i className={`fas fa-heart ${isLiked ? "liked" : ""}`}></i>
                    </button>
                    <button className="action-btn" onClick={() => setShowCommentForm(!showCommentForm)}>
                      <i className="fas fa-comment"></i>
                    </button>
                    <button className="action-btn" onClick={handleSave}>
                      <i className={`far fa-bookmark ${isSaved ? "saved" : ""}`}></i>
                    </button>
                  </div>
                  <div className="likes-count">{likesCount} likes</div>
                </div>
                <form
                  className="comment-form"
                  onSubmit={handleComment}
                >
                  <textarea
                    name="comment"
                    className="comment-input"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
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

export default Post;