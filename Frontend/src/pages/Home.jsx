"use client"

import { useState, useEffect } from "react"
import Post from "../components/Post"
import "./Home.css"
import { Link } from 'react-router-dom';

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

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
            <h4>Suggestions For You</h4>
            <button>See All</button>
          </div>

          <div className="suggestion-item">
            <div className="user-info">
              <img src="/assets/suggestion1.jpg" alt="User" />
              <div>
                <p className="username">moto_lover</p>
                <p className="suggestion-reason">Followed by yamaha_official</p>
              </div>
            </div>
            <button className="follow-btn">Follow</button>
          </div>

          <div className="suggestion-item">
            <div className="user-info">
              <img src="/assets/suggestion2.jpg" alt="User" />
              <div>
                <p className="username">music_pro</p>
                <p className="suggestion-reason">New to Yamaha Social</p>
              </div>
            </div>
            <button className="follow-btn">Follow</button>
          </div>

          <div className="suggestion-item">
            <div className="user-info">
              <img src="/assets/suggestion3.jpg" alt="User" />
              <div>
                <p className="username">boat_captain</p>
                <p className="suggestion-reason">Followed by 3 of your friends</p>
              </div>
            </div>
            <button className="follow-btn">Follow</button>
          </div>
        </div>

        <div className="yamaha-ad card">user-profile card
          <h4>Yamaha Special Offers</h4>
          <img src="/assets/yamaha-ad.jpg" alt="Yamaha Special Offers" />
          <p>Limited time offer on selected Yamaha products. Click to learn more!</p>
          <button className="btn btn-primary">Learn More</button>
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
