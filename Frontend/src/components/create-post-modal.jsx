"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ImagePlus, X } from "lucide-react"
import "../styles/components/create-post-modal.css"

export function CreatePostModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  if (!isOpen) return null

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!selectedImage || !caption.trim()) return

    setIsSubmitting(true)

    // Create a new post object
    const newPost = {
      id: Date.now(),
      user: {
        username: "yamaha_rider", // Current user
        avatar: "/placeholder.svg?height=40&width=40",
        name: "Alex Johnson",
      },
      image: selectedImage,
      caption: caption,
      timestamp: "Just now",
    }

    console.log("New post created:", newPost)

    // Reset form and close modal
    setCaption("")
    setSelectedImage(null)
    setIsSubmitting(false)
    onClose()

    // Refresh the page to show the new post
    navigate("/home")
  }

  const handleClose = () => {
    setCaption("")
    setSelectedImage(null)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create new post</h2>
          <p className="modal-description">Share your Yamaha experience with the community</p>
        </div>

        {!selectedImage ? (
          <div className="image-upload-area" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="upload-icon" />
            <p className="upload-text">Click to upload an image</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden-input"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        ) : (
          <div className="selected-image-container">
            <button className="remove-image-button" onClick={() => setSelectedImage(null)}>
              <X size={16} />
            </button>
            <img src={selectedImage || "/placeholder.svg"} alt="Selected image" className="selected-image" />
          </div>
        )}

        <textarea
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="caption-textarea"
          rows={3}
        />

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!selectedImage || !caption.trim() || isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  )
}
