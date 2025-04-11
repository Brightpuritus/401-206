"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { YamahaLogo } from "./yamaha-logo"
import "../styles/components/auth-forms.css"

export function LoginForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real app, you would authenticate the user here
    console.log("Login with:", formData)
    navigate("/home")
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <YamahaLogo className="auth-logo" />
        <h2 className="auth-title">Sign in to Yamaha Social</h2>
        <p className="auth-description">Enter your credentials to access your account</p>
      </div>
      <div className="auth-content">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-input"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Link to="#" className="forgot-password">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Sign In
          </button>
        </form>
      </div>
      <div className="auth-footer">
        <div className="auth-redirect">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
