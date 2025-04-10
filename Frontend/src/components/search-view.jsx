"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Search, User } from "lucide-react"

// Mock data for search results
const users = [
  {
    username: "yamaha_official",
    name: "Yamaha Official",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    isFollowing: true,
  },
  {
    username: "yamaha_music",
    name: "Yamaha Music",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    isFollowing: false,
  },
  {
    username: "yamaha_marine",
    name: "Yamaha Marine",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: true,
    isFollowing: false,
  },
  {
    username: "moto_enthusiast",
    name: "Moto Enthusiast",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    isFollowing: true,
  },
  {
    username: "yamaha_rider",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    isVerified: false,
    isFollowing: false,
  },
]

const posts = [
  {
    id: 1,
    user: {
      username: "yamaha_official",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=300&width=300",
    likes: 1245,
    comments: 89,
  },
  {
    id: 2,
    user: {
      username: "yamaha_music",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=300&width=300",
    likes: 876,
    comments: 42,
  },
  {
    id: 3,
    user: {
      username: "yamaha_marine",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=300&width=300",
    likes: 543,
    comments: 21,
  },
  {
    id: 4,
    user: {
      username: "moto_enthusiast",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=300&width=300",
    likes: 321,
    comments: 15,
  },
  {
    id: 5,
    user: {
      username: "yamaha_rider",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=300&width=300",
    likes: 210,
    comments: 8,
  },
  {
    id: 6,
    user: {
      username: "yamaha_official",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    image: "/placeholder.svg?height=300&width=300",
    likes: 987,
    comments: 56,
  },
]

export function SearchView() {
  const [searchQuery, setSearchQuery] = useState("")
  const [followStatus, setFollowStatus] = useState({})

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFollow = (username) => {
    setFollowStatus((prev) => ({
      ...prev,
      [username]: !getUserFollowStatus(username),
    }))
  }

  const getUserFollowStatus = (username) => {
    return followStatus[username] !== undefined
      ? followStatus[username]
      : users.find((user) => user.username === username)?.isFollowing || false
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users or posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="users" className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="posts" className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 mr-2"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M3 9h18" />
              <path d="M9 21V9" />
            </svg>
            Posts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user.username} className="flex items-center justify-between">
                  <Link to={`/profile/${user.username}`} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="font-medium">{user.name}</p>
                        {user.isVerified && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 text-yamaha-red"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                  </Link>
                  <Button
                    variant={getUserFollowStatus(user.username) ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleFollow(user.username)}
                    className={getUserFollowStatus(user.username) ? "" : "bg-yamaha-red hover:bg-yamaha-darkRed"}
                  >
                    {getUserFollowStatus(user.username) ? "Following" : "Follow"}
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No users found</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <div className="grid grid-cols-3 gap-1">
            {posts.map((post) => (
              <div key={post.id} className="aspect-square relative group cursor-pointer">
                <img
                  src={post.image || "/placeholder.svg"}
                  alt={`Post by ${post.user.username}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
