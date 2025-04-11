"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Messages from "./pages/Messages"
import Notifications from "./pages/Notifications"
import CreatePost from "./pages/CreatePost"
import Search from "./pages/Search"
import "./App.css"

function App() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: "yamaha_rider",
    fullName: "Yamaha Rider",
    avatar: "/assets/profile-default.jpg",
    followers: 245,
    following: 123,
    bio: "Passionate about Yamaha motorcycles and music instruments!",
  })

  return (
    <Router>
      <div className="app">
        <Navbar currentUser={currentUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/profile/:username" element={<Profile currentUser={currentUser} />} />
            <Route path="/messages" element={<Messages currentUser={currentUser} />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/create" element={<CreatePost currentUser={currentUser} />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
