import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./components/pages/LoginPage.jsx"
import RegisterPage from "./components/pages/RegisterPage.jsx"
import HomePage from "./components/pages/HomePage.jsx"
import ProfilePage from "./components/pages/ProfilePage.jsx"
import MessagesPage from "./components/pages/MessagesPage.jsx"
import SearchPage from "./components/pages/SearchPage.jsx"
import NotificationsPage from "./components/pages/NotificationsPage.jsx"
import SettingsPage from "./components/pages/SettingsPage.jsx"
import "./index.css"
function App() {
  // In a real app, you would check if the user is authenticated
  const isAuthenticated = false

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/profile/:username" element={<ProfilePage />} />
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

export default App
