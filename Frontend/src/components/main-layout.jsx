"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Bell, Home, LogOut, MessageSquare, PlusSquare, Search, Settings, User } from "lucide-react"
import { CreatePostModal } from "./create-post-modal"
import { YamahaLogo } from "./yamaha-logo"

export function MainLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleLogout = () => {
    // In a real app, you would handle logout here
    console.log("Logging out")
    navigate("/")
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "var(--color-background)" }}>
      {/* Sidebar */}
      <div className="app-sidebar">
        <div className="app-sidebar-header">
          <YamahaLogo style={{ height: "2.5rem" }} />
        </div>
        <nav className="app-sidebar-content">
          <Link to="/home" className={`nav-item ${isActive("/home") ? "active" : ""}`}>
            <Home className="nav-item-icon" size={20} />
            Home
          </Link>
          <Link to="/search" className={`nav-item ${isActive("/search") ? "active" : ""}`}>
            <Search className="nav-item-icon" size={20} />
            Search
          </Link>
          <Link to="/messages" className={`nav-item ${isActive("/messages") ? "active" : ""}`}>
            <MessageSquare className="nav-item-icon" size={20} />
            Messages
          </Link>
          <Link to="/notifications" className={`nav-item ${isActive("/notifications") ? "active" : ""}`}>
            <Bell className="nav-item-icon" size={20} />
            Notifications
          </Link>
          <button
            className="nav-item"
            style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
            onClick={() => setIsCreateModalOpen(true)}
          >
            <PlusSquare className="nav-item-icon" size={20} />
            Create
          </button>
          <Link to="/profile/me" className={`nav-item ${location.pathname.startsWith("/profile") ? "active" : ""}`}>
            <User className="nav-item-icon" size={20} />
            Profile
          </Link>
          <Link to="/settings" className={`nav-item ${isActive("/settings") ? "active" : ""}`}>
            <Settings className="nav-item-icon" size={20} />
            Settings
          </Link>
        </nav>
        <div className="app-sidebar-footer">
          <div style={{ position: "relative" }}>
            <button
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start", padding: "0.5rem" }}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div className="avatar avatar-sm" style={{ marginRight: "0.5rem" }}>
                  <img src="/placeholder.svg?height=32&width=32" alt="@user" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Yamaha Rider</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>@yamaha_rider</span>
                </div>
              </div>
            </button>

            {isDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  bottom: "100%",
                  right: "0",
                  width: "14rem",
                  backgroundColor: "var(--color-card)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-md)",
                  border: "1px solid var(--color-border)",
                  zIndex: 50,
                }}
              >
                <Link to="/profile/me" className="nav-item" onClick={() => setIsDropdownOpen(false)}>
                  <User size={16} className="nav-item-icon" />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="nav-item" onClick={() => setIsDropdownOpen(false)}>
                  <Settings size={16} className="nav-item-icon" />
                  <span>Settings</span>
                </Link>
                <div style={{ height: "1px", backgroundColor: "var(--color-border)", margin: "0.25rem 0" }}></div>
                <button
                  className="nav-item"
                  style={{ width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
                  onClick={handleLogout}
                >
                  <LogOut size={16} className="nav-item-icon" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="app-main">{children}</div>

      {/* Create post modal */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
