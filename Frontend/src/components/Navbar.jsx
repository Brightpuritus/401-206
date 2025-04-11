"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

const Navbar = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/assets/yamaha-logo.png" alt="Yamaha Social" className="logo" />
          </Link>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search profiles or posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <i className="fa-solid fa-search"></i>
          </button>
        </form>

        <div className="navbar-menu">
          <Link to="/" className="nav-item">
            <i className="fa-solid fa-house"></i>
          </Link>
          <Link to="/messages" className="nav-item">
            <i className="fa-solid fa-message"></i>
          </Link>
          <Link to="/create" className="nav-item">
            <i className="fa-solid fa-plus-square"></i>
          </Link>
          <Link to="/notifications" className="nav-item">
            <i className="fa-solid fa-bell"></i>
          </Link>
          <Link to={`/profile/${currentUser.username}`} className="nav-item profile-pic">
            <img src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.username} />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
