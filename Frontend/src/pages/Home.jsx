"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Post from "../components/Post"
import "./Home.css"


const Home = ({ currentUser }) => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const data = await response.json();
        const sortedPosts = data.sort((a, b) => b.id - a.id);
        setPosts(sortedPosts);
        console.log(data); // ตรวจสอบข้อมูลที่ได้รับ
        setPosts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();

        // เรียงลำดับอีเว้นท์ตามวันที่ (ล่าสุดอยู่ด้านบน)
        const sortedEvents = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        // เก็บเฉพาะ 3 อีเว้นท์ล่าสุด
        setEvents(sortedEvents.slice(0, 3));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    )
  }

  return (
    <div className="home-container">
      <div className="posts-container">
        {posts.map((post) => (
          <Post
          key={post.id}
          post={{
            ...post,
            isSavedByCurrentUser: post.savedBy?.includes(currentUser.username), // เพิ่มฟิลด์นี้
          }}
          currentUser={currentUser}
        />
        ))}
      </div>

      <div className="sidebar">
        <div className="user-profile">
          <Link to={`/profile/${currentUser.username}`} className="user-info">
            <img 
              src={currentUser.avatar ? `http://localhost:5000${currentUser.avatar}` : "/placeholder.svg"} 
              alt={currentUser.username}
            />
            <div className="profile-details">
              <p className="name">{currentUser.fullName}</p>
              <p className="username">{currentUser.username}</p>
            </div>
          </Link>
          <button className="switch-btn">Switch</button>
        </div>

        <div className="suggestions card">
          <div className="suggestions-header">
            <h4>Events</h4>
            <button onClick={() => navigate("/events")}>See All</button>
          </div>
          <div className="suggestion-list">
  {events.length > 0 ? (
    events.map((event) => (
      <div
        key={event.id}
        className="suggestion-item"
        onClick={() => navigate(`/events/${event.id}`)} // เพิ่มการนำทาง
      >
        <img
          src={`http://localhost:5000${event.image}`}
          alt={event.title}
          className="event-image"
        />
        <div className="event-details">
          <h5 className="event-title">{event.title}</h5>
          <p className="event-description">{event.description}</p>
          <p className="event-date">{event.date}</p>
        </div>
      </div>
    ))
  ) : (
    <p>No events available</p>
  )}
</div>
        </div>

        <div className="footer">
          <p>© 2023 Yamaha Social</p>
          <p>About · Help · Press · API · Jobs · Privacy · Terms · Locations</p>
        </div>
      </div>
    </div>
  )
}

export default Home
