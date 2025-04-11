"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "./theme-provider"
import { LogOut, Moon, Sun } from "lucide-react"
import "../styles/components/settings-view.css"

export function SettingsView() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  })

  const handleLogout = () => {
    // In a real app, you would handle logout here
    console.log("Logging out")
    navigate("/")
  }

  const handleThemeChange = (e) => {
    const newTheme = e.target.checked ? "dark" : "light"
    setTheme(newTheme)
    console.log("Theme changed to:", newTheme)
  }

  const handleNotificationChange = (type) => {
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  return (
    <div className="settings">
      <h1 className="settings-title">Settings</h1>

      <div className="settings-sections">
        <div className="settings-card">
          <div className="settings-card-header">
            <h2 className="settings-card-title">Appearance</h2>
            <p className="settings-card-description">Customize how Yamaha Social looks on your device</p>
          </div>
          <div className="settings-card-content">
            <div className="settings-item">
              <div className="settings-item-label">
                {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
                <span>Dark Mode</span>
              </div>
              <label className="switch">
                <input type="checkbox" checked={theme === "dark"} onChange={handleThemeChange} />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <h2 className="settings-card-title">Notifications</h2>
            <p className="settings-card-description">Configure how you want to be notified</p>
          </div>
          <div className="settings-card-content">
            <div className="settings-item">
              <label htmlFor="email-notifications" className="settings-item-label">
                Email Notifications
              </label>
              <label className="switch">
                <input
                  id="email-notifications"
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange("email")}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
            <div className="settings-item">
              <label htmlFor="push-notifications" className="settings-item-label">
                Push Notifications
              </label>
              <label className="switch">
                <input
                  id="push-notifications"
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange("push")}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
            <div className="settings-item">
              <label htmlFor="marketing-emails" className="settings-item-label">
                Marketing Emails
              </label>
              <label className="switch">
                <input
                  id="marketing-emails"
                  type="checkbox"
                  checked={notifications.marketing}
                  onChange={() => handleNotificationChange("marketing")}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <div className="settings-card-header">
            <h2 className="settings-card-title">Account</h2>
            <p className="settings-card-description">Manage your account settings</p>
          </div>
          <div className="settings-card-content">
            <button className="btn btn-destructive btn-full" onClick={handleLogout}>
              <LogOut size={16} className="btn-icon" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
