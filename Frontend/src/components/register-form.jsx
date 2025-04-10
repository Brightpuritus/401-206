"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { YamahaLogo } from "./yamaha-logo"

export function RegisterForm() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
    // In a real app, you would register the user here
    console.log("Register with:", formData)
    navigate("/home")
  }

  return (
    <div className="card shadow-lg" style={{ maxWidth: "28rem", width: "100%", border: "none" }}>
      <div className="card-header" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <YamahaLogo className="mb-4" style={{ height: "3rem" }} />
        <h3 className="card-title">Create an account</h3>
        <p className="card-description">Enter your information to create an account</p>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-group">
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username" className="label">
              Username
            </label>
            <input
              id="username"
              name="username"
              placeholder="johndoe"
              required
              value={formData.username}
              onChange={handleChange}
              className="input"
            />
          </div>
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
            <label htmlFor="password" className="label">
              Password
            </label>
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
          <div className="form-group">
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Create Account
          </button>
        </form>
      </div>
      <div className="card-footer" style={{ display: "flex", flexDirection: "column", textAlign: "center" }}>
        <div className="text-sm">
          Already have an account?{" "}
          <Link to="/" style={{ color: "var(--color-primary)" }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
