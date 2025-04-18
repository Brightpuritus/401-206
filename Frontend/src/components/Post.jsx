"use client";

import { useState, useEffect } from "react"; // เพิ่ม useEffect
import { Link } from "react-router-dom";
import "./Post.css";

const Post = ({ post, currentUser }) => {
  // เพิ่ม state สำหรับเก็บข้อมูล profile
  const [postUserProfile, setPostUserProfile] = useState(null);
  
  // เพิ่ม useEffect เพื่อดึงข้อมูล profile
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

const toggleMenu = () => {
  setShowMenu(!showMenu);
};

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
        body: JSON.stringify({ username: currentUser.username }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to toggle save");
      }
  
      const data = await response.json();
      setIsSaved(data.isSaved); // อัปเดตสถานะ Saved
    } catch (error) {
      console.error("Error toggling save:", error);
      alert(error.message);
    }
  };

  const handleEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("caption", editedCaption);
      if (editedImage) {
        formData.append("image", editedImage); // เพิ่มรูปภาพใหม่
      }
  
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: "PUT",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
  
      const data = await response.json();
      setIsEditing(false); // ปิดโหมดแก้ไข
      setEditedCaption(data.post.caption); // อัปเดตคำบรรยายใหม่
      if (data.post.image) {
        post.image = data.post.image; // อัปเดตรูปภาพใหม่
      }
  
      // รีเฟรชหน้า
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
  
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
  
      alert("Post deleted successfully");
      window.location.reload(); // รีเฟรชหน้าเพื่ออัปเดตโพสต์
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.message);
    }
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