"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { CalendarDays, Grid, LinkIcon, MapPin, PlusIcon, Film, Bookmark, UserCircle, Play, Heart, MessageCircle, Send, MoreHorizontal } from "lucide-react"
import "../styles/profile.css";

// Mock user data
const users = {
  me: {
    username: "yamaha_rider",
    name: "Alex Johnson",
    avatar: "/images/avatars/yamaha-rider.jpg",
    bio: "Yamaha enthusiast. Rider. Music lover. 🏍️\nOfficial Yamaha Ambassador 🔰",
    location: "Tokyo, Japan",
    website: "yamaha-rider.com",
    joinDate: "January 2020",
    posts: 42,
    followers: 1250,
    following: 350,
    isCurrentUser: true,
    isFollowing: false,
    images: [
      { 
        id: 1,
        url: "/images/posts/r1-1.jpg",
        likes: 856,
        comments: 43,
        caption: "New R1M looking perfect 🔥",
        isVideo: false 
      },
      // ...more posts
    ],
    savedPosts: [],
    taggedPosts: [],
    highlights: [
      {
        id: 1,
        title: "R1M 🏍️",
        cover: "/images/stories/r1m-cover.jpg"
      },
      // ...more highlights
    ],
    stories: [
      {
        id: 1,
        url: "/images/stories/story-1.jpg",
        isVideo: false
      }
    ]
  },
  yamaha_official: {
    username: "yamaha_official",
    name: "Yamaha Official",
    avatar: "/placeholder.svg?height=150&width=150",
    bio: "Official Yamaha account. Revs your heart.",
    location: "Global",
    website: "yamaha.com",
    joinDate: "January 2010",
    posts: 1205,
    followers: 2500000,
    following: 150,
    isCurrentUser: false,
    isFollowing: true,
    images: Array(9).fill("/placeholder.svg?height=300&width=300"),
    headerImage: "/placeholder.svg?height=400&width=1200",
  },
}

export function ProfileView({ username }) {
  const user = users[username] || users.yamaha_official
  const [isFollowing, setIsFollowing] = useState(user.isFollowing)
  const [followerCount, setFollowerCount] = useState(user.followers)
  const [profileData, setProfileData] = useState({
    name: user.name,
    username: user.username,
    bio: user.bio,
    location: user.location,
    website: user.website,
  })
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("posts")
  const [showStoryViewer, setShowStoryViewer] = useState(false)
  const [selectedStory, setSelectedStory] = useState(null)
  const [showPostModal, setShowPostModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)
  const [showFollowersModal, setShowFollowersModal] = useState(false)
  const [showFollowingModal, setShowFollowingModal] = useState(false)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1)
  }

  const handleProfileUpdate = () => {
    // Here you would typically update the profile data in your backend
    console.log("Updating profile:", profileData)
    setIsEditProfileOpen(false)
  }

  return (
    <div className="profile-container">
      {/* Header Image */}
      <div className="relative h-48 md:h-64 w-full">
        <img src={user.headerImage || "/placeholder.svg"} alt="Header" className="w-full h-full object-cover" />
      </div>

      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col relative">
          {/* Avatar */}
          <div className="absolute -top-16 left-4 border-4 border-white dark:border-gray-950 rounded-full">
            <Avatar className="w-32 h-32">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end mt-4 mb-8">
            {user.isCurrentUser ? (
              <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleProfileUpdate} className="bg-yamaha-red hover:bg-yamaha-darkRed">
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button
                onClick={handleFollow}
                variant={isFollowing ? "outline" : "default"}
                className={isFollowing ? "" : "bg-yamaha-red hover:bg-yamaha-darkRed"}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>

          {/* Profile Details */}
          <div className="mt-8">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>

            <p className="my-4">{user.bio}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
              )}
              {user.website && (
                <div className="flex items-center">
                  <LinkIcon className="h-4 w-4 mr-1" />
                  <a
                    href={`https://${user.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    {user.website}
                  </a>
                </div>
              )}
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" />
                Joined {user.joinDate}
              </div>
            </div>

            <div className="flex gap-4 text-sm mb-6">
              <Link to="#" className="hover:underline">
                <span className="font-bold">{user.following.toLocaleString()}</span> Following
              </Link>
              <Link to="#" className="hover:underline">
                <span className="font-bold">{followerCount.toLocaleString()}</span> Followers
              </Link>
            </div>
          </div>

          {/* Stories Highlights */}
          <div className="stories-highlights">
            {user.highlights?.map((highlight) => (
              <button 
                key={highlight.id}
                className="highlight-item"
                onClick={() => handleHighlightClick(highlight)}
              >
                <img src={highlight.cover} alt={highlight.title} />
                <span>{highlight.title}</span>
              </button>
            ))}
            {user.isCurrentUser && (
              <button className="add-highlight-btn">
                <PlusIcon />
                <span>New</span>
              </button>
            )}
          </div>

          {/* Profile Stats with Modals */}
          <div className="profile-stats">
            <button onClick={() => setShowPostModal(true)}>
              <span className="stat-value">{user.posts}</span>
              <span className="stat-label">posts</span>
            </button>
            <button onClick={() => setShowFollowersModal(true)}>
              <span className="stat-value">{followerCount.toLocaleString()}</span>
              <span className="stat-label">followers</span>
            </button>
            <button onClick={() => setShowFollowingModal(true)}>
              <span className="stat-value">{user.following.toLocaleString()}</span>
              <span className="stat-label">following</span>
            </button>
          </div>

          {/* Enhanced Tabs */}
          <Tabs defaultValue="posts" className="profile-tabs">
            <TabsList>
              <TabsTrigger value="posts">
                <Grid className="tab-icon" />
                POSTS
              </TabsTrigger>
              <TabsTrigger value="reels">
                <Film className="tab-icon" />
                REELS
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Bookmark className="tab-icon" />
                SAVED
              </TabsTrigger>
              <TabsTrigger value="tagged">
                <UserCircle className="tab-icon" />
                TAGGED
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="posts-grid">
              {user.images.map((post, index) => (
                <div 
                  key={post.id} 
                  className="post-item"
                  onClick={() => handlePostClick(post)}
                >
                  <img src={post.url} alt={`Post ${index + 1}`} />
                  {post.isVideo && <Play className="video-indicator" />}
                  <div className="post-overlay">
                    <div className="post-stats">
                      <span><Heart /> {post.likes}</span>
                      <span><MessageCircle /> {post.comments}</span>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* More TabsContent... */}
          </Tabs>

          {/* Post Modal */}
          {showPostModal && selectedPost && (
            <Dialog open={showPostModal} onOpenChange={setShowPostModal}>
              <DialogContent className="post-modal">
                <div className="post-modal-content">
                  <div className="post-modal-image">
                    <img src={selectedPost.url} alt="Post" />
                  </div>
                  <div className="post-modal-details">
                    {/* Post Header */}
                    <div className="post-modal-header">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="username">{user.username}</span>
                      <Button variant="ghost" className="more-options">
                        <MoreHorizontal />
                      </Button>
                    </div>

                    {/* Comments Section */}
                    <div className="post-modal-comments">
                      {/* Comments list */}
                    </div>

                    {/* Action Buttons */}
                    <div className="post-modal-actions">
                      <div className="action-buttons">
                        <Button variant="ghost"><Heart /></Button>
                        <Button variant="ghost"><MessageCircle /></Button>
                        <Button variant="ghost"><Send /></Button>
                        <Button variant="ghost" className="ml-auto"><Bookmark /></Button>
                      </div>
                      <div className="likes-count">{selectedPost.likes} likes</div>
                      <div className="post-timestamp">2 HOURS AGO</div>
                    </div>

                    {/* Add Comment */}
                    <div className="add-comment">
                      <Input 
                        placeholder="Add a comment..."
                        className="comment-input"
                      />
                      <Button variant="ghost">Post</Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Story Viewer */}
          {showStoryViewer && (
            <div className="story-viewer">
              {/* Story viewer implementation */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
