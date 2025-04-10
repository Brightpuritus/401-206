"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { YamahaLogo } from "./yamaha-logo"

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
    <div className="card auth-card shadow-lg">
      <div className="card-header auth-header">
        <YamahaLogo className="auth-logo" />
        <h3 className="card-title">Sign in to Yamaha Social</h3>
        <p className="card-description">Enter your credentials to access your account</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label htmlFor="password" className="label">
                Password
              </label>
              <Link to="#" className="text-sm auth-link">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Sign In
          </button>
        </form>
      </div>
      <div className="card-footer auth-footer">
        <div className="text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
