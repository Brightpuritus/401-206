"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { ImagePlus, X } from "lucide-react"

export function CreatePostModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [caption, setCaption] = useState("")
  const [selectedImage, setSelectedImage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

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
      likes: 0,
      liked: false,
      saved: false,
      comments: [],
      timestamp: "Just now",
    }

    // Add the new post to the feed
    if (typeof window !== "undefined" && window.addNewPost) {
      window.addNewPost(newPost)
    }

    // Reset form and close modal
    setCaption("")
    setSelectedImage(null)
    setIsSubmitting(false)
    onClose()

    // Refresh the page to show the new post
    navigate("/home")
  }

  if (!isOpen) return null

  return (
    <div className="dialog-overlay">
      <div className="dialog-content" style={{ maxWidth: "28rem" }}>
        <div className="dialog-header">
          <h2 className="dialog-title">Create new post</h2>
          <p style={{ fontSize: "var(--font-sm)", color: "var(--color-muted)" }}>
            Share your Yamaha experience with the community
          </p>
          <button className="dialog-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="dialog-body">
          {!selectedImage ? (
            <div className="create-post-dropzone" onClick={() => fileInputRef.current?.click()}>
              <ImagePlus size={48} style={{ color: "var(--color-muted)", marginBottom: "1rem" }} />
              <p style={{ fontSize: "var(--font-sm)", color: "var(--color-muted)" }}>Click to upload an image</p>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          ) : (
            <div className="create-post-preview">
              <button className="create-post-remove" onClick={() => setSelectedImage(null)}>
                <X size={16} />
              </button>
              <img src={selectedImage || "/placeholder.svg"} alt="Selected image" />
            </div>
          )}

          <textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="textarea"
            style={{ marginTop: "1rem", resize: "none" }}
            rows={3}
          />
        </div>
        <div className="dialog-footer">
          <button className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
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
