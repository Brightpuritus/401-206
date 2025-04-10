"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Input } from "./ui/input"
import { Bookmark, ChevronDown, ChevronUp, Heart, MessageCircle, Reply, Send } from "lucide-react"

// Mock data for posts
const initialPosts = [
  {
    id: 1,
    user: {
      username: "yamaha_official",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Yamaha Official",
    },
    image: "/placeholder.svg?height=600&width=600",
    caption:
      "Experience the thrill of the new Yamaha R1. Engineered for the track, built for the streets. #YamahaR1 #RevYourHeart",
    likes: 1245,
    liked: false,
    saved: false,
    commentsVisible: true,
    comments: [
      {
        id: 101,
        user: "moto_enthusiast",
        text: "This is absolutely stunning! Can't wait to test ride one!",
        timestamp: "2 hours ago",
        likes: 24,
        liked: false,
        replies: [],
      },
      {
        id: 102,
        user: "speed_demon",
        text: "The best motorcycle in its class, hands down! 🏍️",
        timestamp: "1 hour ago",
        likes: 15,
        liked: false,
        replies: [],
      },
    ],
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    user: {
      username: "yamaha_music",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Yamaha Music",
    },
    image: "/placeholder.svg?height=600&width=600",
    caption: "Introducing the new Yamaha Grand Piano. Perfect harmony in every note. #YamahaMusic #GrandPiano",
    likes: 876,
    liked: false,
    saved: false,
    commentsVisible: true,
    comments: [
      {
        id: 201,
        user: "piano_lover",
        text: "The sound quality is unmatched! 🎹",
        timestamp: "5 hours ago",
        likes: 18,
        liked: false,
        replies: [],
      },
      {
        id: 202,
        user: "music_teacher",
        text: "My students would love this! Such beautiful craftsmanship.",
        timestamp: "4 hours ago",
        likes: 9,
        liked: false,
        replies: [],
      },
    ],
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    user: {
      username: "yamaha_marine",
      avatar: "/placeholder.svg?height=40&width=40",
      name: "Yamaha Marine",
    },
    image: "/placeholder.svg?height=600&width=600",
    caption:
      "Set sail with the new Yamaha outboard motors. Power and reliability for your adventures on water. #YamahaMarine #BoatingLife",
    likes: 543,
    liked: false,
    saved: false,
    commentsVisible: true,
    comments: [
      {
        id: 301,
        user: "sea_captain",
        text: "Best outboard motors I've ever used! Reliable in all conditions.",
        timestamp: "1 day ago",
        likes: 12,
        liked: false,
        replies: [],
      },
      {
        id: 302,
        user: "weekend_sailor",
        text: "Just upgraded my boat with one of these. Game changer! ⛵",
        timestamp: "23 hours ago",
        likes: 7,
        liked: false,
        replies: [],
      },
    ],
    timestamp: "1 day ago",
  },
]

export function Feed() {
  const [posts, setPosts] = useState(initialPosts)
  const [newComments, setNewComments] = useState({})
  const [replyingTo, setReplyingTo] = useState({
    postId: null,
    commentId: null,
  })
  const [replyText, setReplyText] = useState("")

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        }
        return post
      }),
    )
  }

  const handleSave = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            saved: !post.saved,
          }
        }
        return post
      }),
    )
  }

  const toggleComments = (postId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsVisible: !post.commentsVisible,
          }
        }
        return post
      }),
    )
  }

  const handleCommentChange = (postId, value) => {
    setNewComments({
      ...newComments,
      [postId]: value,
    })
  }

  const handleCommentLike = (postId, commentId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  liked: !comment.liked,
                  likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )
  }

  const handleReplyLike = (postId, commentId, replyId) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.map((reply) => {
                    if (reply.id === replyId) {
                      return {
                        ...reply,
                        liked: !reply.liked,
                        likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                      }
                    }
                    return reply
                  }),
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )
  }

  const handleAddComment = (postId) => {
    if (!newComments[postId]?.trim()) return

    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          // Make sure comments are visible when adding a new comment
          return {
            ...post,
            commentsVisible: true,
            comments: [
              ...post.comments,
              {
                id: Date.now(),
                user: "current_user",
                text: newComments[postId],
                timestamp: "Just now",
                likes: 0,
                liked: false,
                replies: [],
              },
            ],
          }
        }
        return post
      }),
    )

    // Clear the comment input
    setNewComments({
      ...newComments,
      [postId]: "",
    })
  }

  const handleReplyClick = (postId, commentId) => {
    setReplyingTo({ postId, commentId })
    setReplyText("")
  }

  const handleReplyChange = (e) => {
    setReplyText(e.target.value)
  }

  const handleAddReply = () => {
    if (!replyText.trim() || !replyingTo.postId || !replyingTo.commentId) return

    setPosts(
      posts.map((post) => {
        if (post.id === replyingTo.postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === replyingTo.commentId) {
                return {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    {
                      id: Date.now(),
                      user: "current_user",
                      text: replyText,
                      timestamp: "Just now",
                      likes: 0,
                      liked: false,
                    },
                  ],
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )

    // Clear the reply input and reset replyingTo
    setReplyText("")
    setReplyingTo({ postId: null, commentId: null })
  }

  const cancelReply = () => {
    setReplyingTo({ postId: null, commentId: null })
    setReplyText("")
  }

  // Function to add a new post to the feed
  const addNewPost = (newPost) => {
    // Add commentsVisible property to new posts
    const postWithCommentsVisible = {
      ...newPost,
      commentsVisible: true,
    }
    setPosts([postWithCommentsVisible, ...posts])
  }

  // Make the addNewPost function available globally
  if (typeof window !== "undefined") {
    window.addNewPost = addNewPost
  }

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {posts.map((post) => (
        <Card key={post.id} className="mb-6 border-none shadow-sm dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center p-4 pb-2">
            <Link to={`/profile/${post.user.username}`} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={post.user.avatar} alt={post.user.name} />
                <AvatarFallback>{post.user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{post.user.name}</p>
                <p className="text-xs text-muted-foreground">@{post.user.username}</p>
              </div>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <img src={post.image || "/placeholder.svg"} alt="Post image" className="w-full h-auto" />
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4 pt-2 gap-2">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleLike(post.id)}
                  className={post.liked ? "text-yamaha-red" : ""}
                >
                  <Heart className={`h-6 w-6 ${post.liked ? "fill-yamaha-red" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toggleComments(post.id)} className="relative">
                  <MessageCircle className="h-6 w-6" />
                  {post.comments.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-yamaha-red text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {post.comments.length}
                    </span>
                  )}
                </Button>
                <Button variant="ghost" size="icon">
                  <Send className="h-6 w-6" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSave(post.id)}
                className={post.saved ? "text-yamaha-red" : ""}
              >
                <Bookmark className={`h-6 w-6 ${post.saved ? "fill-yamaha-red" : ""}`} />
              </Button>
            </div>
            <div className="font-medium text-sm">{post.likes} likes</div>
            <div className="text-sm">
              <Link to={`/profile/${post.user.username}`} className="font-medium mr-2">
                {post.user.username}
              </Link>
              {post.caption}
            </div>

            {/* Comments section with toggle */}
            {post.comments.length > 0 && (
              <div className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground p-0 h-auto mb-2"
                  onClick={() => toggleComments(post.id)}
                >
                  {post.commentsVisible ? (
                    <>
                      <ChevronUp className="h-4 w-4" /> Hide comments
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" /> View all {post.comments.length} comments
                    </>
                  )}
                </Button>

                {post.commentsVisible && (
                  <div className="space-y-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="space-y-1">
                        <div className="text-sm flex items-start justify-between">
                          <div className="flex-1">
                            <Link to={`/profile/${comment.user}`} className="font-medium mr-2">
                              {comment.user}
                            </Link>
                            {comment.text}
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs hover:text-yamaha-red"
                                  onClick={() => handleCommentLike(post.id, comment.id)}
                                >
                                  <Heart
                                    className={`h-3 w-3 mr-1 ${comment.liked ? "fill-yamaha-red text-yamaha-red" : ""}`}
                                  />
                                  <span className={`${comment.liked ? "text-yamaha-red" : "text-muted-foreground"}`}>
                                    {comment.likes}
                                  </span>
                                </Button>
                              </div>
                              <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                                onClick={() => handleReplyClick(post.id, comment.id)}
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleCommentLike(post.id, comment.id)}
                            >
                              <Heart className={`h-4 w-4 ${comment.liked ? "fill-yamaha-red text-yamaha-red" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => handleReplyClick(post.id, comment.id)}
                            >
                              <Reply className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="pl-6 border-l-2 border-muted space-y-2 mt-2">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="text-sm">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <Link to={`/profile/${reply.user}`} className="font-medium mr-2">
                                      {reply.user}
                                    </Link>
                                    {reply.text}
                                    <div className="flex items-center gap-2 mt-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-xs hover:text-yamaha-red"
                                        onClick={() => handleReplyLike(post.id, comment.id, reply.id)}
                                      >
                                        <Heart
                                          className={`h-3 w-3 mr-1 ${
                                            reply.liked ? "fill-yamaha-red text-yamaha-red" : ""
                                          }`}
                                        />
                                        <span
                                          className={`${reply.liked ? "text-yamaha-red" : "text-muted-foreground"}`}
                                        >
                                          {reply.likes || 0}
                                        </span>
                                      </Button>
                                      <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleReplyLike(post.id, comment.id, reply.id)}
                                  >
                                    <Heart
                                      className={`h-4 w-4 ${reply.liked ? "fill-yamaha-red text-yamaha-red" : ""}`}
                                    />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply input */}
                        {replyingTo.postId === post.id && replyingTo.commentId === comment.id && (
                          <div className="flex items-center gap-2 pl-6 mt-2">
                            <Input
                              placeholder={`Reply to ${comment.user}...`}
                              value={replyText}
                              onChange={handleReplyChange}
                              className="text-sm h-8"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleAddReply()
                                } else if (e.key === "Escape") {
                                  cancelReply()
                                }
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleAddReply}
                              disabled={!replyText.trim()}
                              className="h-8"
                            >
                              Post
                            </Button>
                            <Button variant="ghost" size="sm" onClick={cancelReply} className="h-8">
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="text-xs text-muted-foreground">{post.timestamp}</div>

            {/* Always show comment input, even when comments are hidden */}
            <div className="flex items-center w-full gap-2 mt-2">
              <Input
                placeholder="Add a comment..."
                className="text-sm h-8"
                value={newComments[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment(post.id)
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAddComment(post.id)}
                disabled={!newComments[post.id]?.trim()}
              >
                Post
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
