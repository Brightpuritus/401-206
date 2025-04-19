"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

const Navbar = ({ currentUser, setCurrentUser }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setCurrentUser(null)
    navigate('/login')
  }

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    document.body.classList.toggle('dark-theme')
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
            onChange={handleSearchChange}
          />
          <button type="submit" className="search-button">
            <i className="fa-solid fa-search"></i>
          </button>
        </form>

        <div className="navbar-menu">
          <Link to="/home" className="nav-item">
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
          <div className="nav-item settings-menu">
            <button 
              className="settings-button"
              onClick={() => setShowSettings(!showSettings)}
            >
              <i className="fa-solid fa-gear"></i>
            </button>
            <div className={`settings-dropdown ${showSettings ? 'active' : ''}`}>
              <Link to={`/profile/${currentUser.username}`}>Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={toggleTheme}>
                {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
              </button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
          <Link to={`/profile/${currentUser.username}`} className="nav-item profile-pic">
            <img 
              src={currentUser.avatar ? `http://localhost:5000${currentUser.avatar}` : "/placeholder.svg"} 
              alt={currentUser.username} 
            />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
