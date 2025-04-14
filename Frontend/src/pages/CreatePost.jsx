"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./CreatePost.css"

const CreatePost = ({ currentUser }) => {
  const [step, setStep] = useState(1)
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [caption, setCaption] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
      setStep(2)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!selectedImage || !caption.trim()) {
      alert("Please select an image and write a caption.");
      return;
    }
  
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("username", currentUser.username);
    formData.append("caption", caption);
  
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
  
      const data = await response.json();
      console.log("Post created:", data);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <div className="create-post-header">
          {step === 1 ? (
            <h2>Create New Post</h2>
          ) : (
            <>
              <button className="back-btn" onClick={() => setStep(1)}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
              <h2>Create New Post</h2>
              {caption.trim() ? (
                <button className="share-btn" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Sharing..." : "Share"}
                </button>
              ) : (
                <button className="share-btn" disabled>
                  Share
                </button>
              )}
            </>
          )}
        </div>

        <div className="create-post-content">
          {step === 1 ? (
            <div
              className="upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <i className="fa-solid fa-image"></i>
              <h3>Drag photos and videos here</h3>
              <button className="btn btn-primary">Select from computer</button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <div className="create-post-editor">
              <div className="post-preview">
                <img src={previewUrl || "/placeholder.svg"} alt="Preview" />
              </div>
              <div className="post-details">
                <div className="post-author">
                  <img src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.username} />
                  <span>{currentUser.username}</span>
                </div>
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={2200}
                ></textarea>
                <div className="caption-length">{caption.length}/2,200</div>
                <div className="post-options">
                  <div className="post-option">
                    <input
                      type="text"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div className="post-option">
                    <label>
                      <input type="checkbox" /> Turn off commenting
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreatePost
