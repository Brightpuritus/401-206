"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Bell, Home, LogOut, MessageSquare, PlusSquare, Search, Settings, User } from "lucide-react"
import { CreatePostModal } from "./create-post-modal"
import { YamahaLogo } from "./yamaha-logo"
import "../styles/components/layout.css"

export function MainLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const handleLogout = () => {
    // In a real app, you would handle logout here
    console.log("Logging out")
    navigate("/")
  }

  const isActive = (path) => {
    return location.pathname === path || (path !== "/home" && location.pathname.startsWith(path))
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <YamahaLogo />
        </div>
        <nav className="sidebar-nav">
          <Link to="/home" className={`nav-link ${isActive("/home") ? "active" : ""}`}>
            <Home className="nav-link-icon" size={20} />
            Home
          </Link>
          <Link to="/search" className={`nav-link ${isActive("/search") ? "active" : ""}`}>
            <Search className="nav-link-icon" size={20} />
            Search
          </Link>
          <Link to="/messages" className={`nav-link ${isActive("/messages") ? "active" : ""}`}>
            <MessageSquare className="nav-link-icon" size={20} />
            Messages
          </Link>
          <Link to="/notifications" className={`nav-link ${isActive("/notifications") ? "active" : ""}`}>
            <Bell className="nav-link-icon" size={20} />
            Notifications
          </Link>
          <button className="nav-link" onClick={() => setIsCreateModalOpen(true)}>
            <PlusSquare className="nav-link-icon" size={20} />
            Create
          </button>
          <Link to="/profile/me" className={`nav-link ${isActive("/profile") ? "active" : ""}`}>
            <User className="nav-link-icon" size={20} />
            Profile
          </Link>
          <Link to="/settings" className={`nav-link ${isActive("/settings") ? "active" : ""}`}>
            <Settings className="nav-link-icon" size={20} />
            Settings
          </Link>
        </nav>
        <div className="sidebar-footer">
          <div className="dropdown">
            <button className="user-menu" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              <div className="avatar avatar-sm">
                <img src="/placeholder.svg?height=32&width=32" alt="@user" className="avatar-image" />
              </div>
              <div className="user-info">
                <span className="user-name">Yamaha Rider</span>
                <span className="user-username">@yamaha_rider</span>
              </div>
            </button>
            {isUserMenuOpen && (
              <div className="dropdown-content">
                <Link to="/profile/me" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                  <User size={16} style={{ marginRight: "0.5rem" }} />
                  <span>Profile</span>
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                  <Settings size={16} style={{ marginRight: "0.5rem" }} />
                  <span>Settings</span>
                </Link>
                <div className="dropdown-separator"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={16} style={{ marginRight: "0.5rem" }} />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">{children}</div>

      {/* Create post modal */}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </div>
  )
}
