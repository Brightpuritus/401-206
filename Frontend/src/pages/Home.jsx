"use client"

import { useState, useEffect } from "react"
import Post from "../components/Post"
import "./Home.css"

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching posts from an API
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          user: {
            id: 2,
            username: "yamaha_official",
            avatar: "/assets/yamaha-profile.jpg",
          },
          image: "/assets/post-1.jpg",
          caption:
            "Introducing the all-new Yamaha R1M - Pushing the boundaries of what's possible on two wheels. #YamahaRacing #R1M",
          likes: 1245,
          timestamp: "2023-04-10T12:00:00Z",
          comments: [
            {
              id: 101,
              user: {
                id: 3,
                username: "moto_enthusiast",
                avatar: "/assets/user1.jpg",
              },
              text: "This bike is absolutely stunning! 😍",
              timestamp: "2023-04-10T12:30:00Z",
            },
            {
              id: 102,
              user: {
                id: 4,
                username: "speed_demon",
                avatar: "/assets/user2.jpg",
              },
              text: "Can't wait to test ride this beast!",
              timestamp: "2023-04-10T13:15:00Z",
            },
          ],
        },
        {
          id: 2,
          user: {
            id: 5,
            username: "yamaha_music",
            avatar: "/assets/yamaha-music.jpg",
          },
          image: "/assets/post-2.jpg",
          caption:
            "The new Yamaha Grand Piano - Where tradition meets innovation. Experience the perfect harmony. #YamahaMusic #GrandPiano",
          likes: 876,
          timestamp: "2023-04-09T15:30:00Z",
          comments: [
            {
              id: 201,
              user: {
                id: 6,
                username: "piano_maestro",
                avatar: "/assets/user3.jpg",
              },
              text: "The sound quality is unmatched!",
              timestamp: "2023-04-09T16:00:00Z",
            },
          ],
        },
        {
          id: 3,
          user: {
            id: 7,
            username: "yamaha_marine",
            avatar: "/assets/yamaha-marine.jpg",
          },
          image: "/assets/post-3.jpg",
          caption:
            "Explore the waters with confidence. The new Yamaha outboard motors are designed for ultimate reliability and performance. #YamahaMarine",
          likes: 543,
          timestamp: "2023-04-08T09:45:00Z",
          comments: [],
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

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
          <Post key={post.id} post={post} currentUser={currentUser} />
        ))}
      </div>

      <div className="sidebar">
        <div className="user-profile card">
          <div className="user-info">
            <img src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.username} />
            <div>
              <p className="username">{currentUser.username}</p>
              <p className="name">{currentUser.fullName}</p>
            </div>
          </div>
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

        <div className="yamaha-ad card">
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
