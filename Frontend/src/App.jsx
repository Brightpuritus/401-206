"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Messages from "./pages/Messages"
import Notifications from "./pages/Notifications"
import CreatePost from "./pages/CreatePost"
import Search from "./pages/Search"
import Login from "./components/Login"
import Register from "./components/Register"
import "./App.css"
import "./styles/auth.css"  // ให้ import auth.css หลัง App.css

const App = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setIsLoading(false)
  }, [])

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
  };

  // Check if current path is login or register
  const isAuthPage = window.location.pathname === '/login' || window.location.pathname === '/register';

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        {!isAuthPage && currentUser && <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />}
        <main className={isAuthPage ? "auth-main" : "main-content"}>
          <Routes>
            <Route 
              path="/" 
              element={currentUser ? <Navigate to="/home" /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/home" /> : <Login setCurrentUser={setCurrentUser} />} 
            />
            <Route 
              path="/register" 
              element={currentUser ? <Navigate to="/home" /> : <Register />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/home" 
              element={currentUser ? <Home currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile/:username" 
              element={
                <Profile 
                  currentUser={currentUser} 
                  onUpdateUser={handleUpdateUser}
                />
              } 
            />
            <Route 
              path="/messages" 
              element={currentUser ? <Messages currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/notifications" 
              element={currentUser ? <Notifications currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/create" 
              element={currentUser ? <CreatePost currentUser={currentUser} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/search" 
              element={currentUser ? <Search /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
