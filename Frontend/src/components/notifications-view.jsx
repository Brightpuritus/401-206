"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

// Mock data for notifications
const initialNotifications = [
  {
    id: 1,
    type: "like",
    user: {
      username: "yamaha_official",
      name: "Yamaha Official",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "liked your post",
    postImage: "/placeholder.svg?height=60&width=60",
    timestamp: "2h",
    isRead: false,
  },
  {
    id: 2,
    type: "follow",
    user: {
      username: "moto_enthusiast",
      name: "Moto Enthusiast",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "started following you",
    timestamp: "5h",
    isRead: false,
  },
  {
    id: 3,
    type: "comment",
    user: {
      username: "yamaha_music",
      name: "Yamaha Music",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: 'commented: "Great photo! Love the composition."',
    postImage: "/placeholder.svg?height=60&width=60",
    timestamp: "1d",
    isRead: true,
  },
  {
    id: 4,
    type: "ad",
    user: {
      username: "yamaha_motors",
      name: "Yamaha Motors",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: "New Yamaha R1 now available at your nearest dealership!",
    adImage: "/placeholder.svg?height=200&width=400",
    timestamp: "2d",
    isRead: true,
    isAd: true,
  },
  {
    id: 5,
    type: "mention",
    user: {
      username: "rider_club",
      name: "Rider Club",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    content: 'mentioned you in a comment: "@yamaha_rider would love this!"',
    postImage: "/placeholder.svg?height=60&width=60",
    timestamp: "3d",
    isRead: true,
  },
]

export function NotificationsView() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [followStatus, setFollowStatus] = useState({})

  const handleMarkAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
    )
  }

  const handleFollow = (username) => {
    setFollowStatus((prev) => ({
      ...prev,
      [username]: !prev[username],
    }))
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
          <TabsTrigger value="unread" className="flex-1">
            Unread
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${notification.isRead ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"} ${notification.isAd ? "border border-yamaha-red" : ""}`}
              >
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                    <AvatarFallback>{notification.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm">
                          <Link to={`/profile/${notification.user.username}`} className="font-medium">
                            {notification.user.name}
                          </Link>{" "}
                          {notification.content}
                        </p>
                        <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                      </div>
                      {notification.postImage && (
                        <div className="ml-2 flex-shrink-0">
                          <img
                            src={notification.postImage || "/placeholder.svg"}
                            alt="Post"
                            width={60}
                            height={60}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      {notification.type === "follow" && (
                        <Button
                          variant={followStatus[notification.user.username] ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleFollow(notification.user.username)}
                          className={
                            followStatus[notification.user.username] ? "" : "bg-yamaha-red hover:bg-yamaha-darkRed"
                          }
                        >
                          {followStatus[notification.user.username] ? "Following" : "Follow"}
                        </Button>
                      )}
                    </div>
                    {notification.adImage && (
                      <div className="mt-3">
                        <img
                          src={notification.adImage || "/placeholder.svg"}
                          alt="Advertisement"
                          width={400}
                          height={200}
                          className="rounded-md w-full h-auto"
                        />
                        <div className="mt-2 flex justify-end">
                          <Button size="sm" className="bg-yamaha-red hover:bg-yamaha-darkRed">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="unread">
          <div className="space-y-4">
            {notifications.filter((n) => !n.isRead).length > 0 ? (
              notifications
                .filter((n) => !n.isRead)
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg bg-gray-50 dark:bg-gray-800 ${notification.isAd ? "border border-yamaha-red" : ""}`}
                  >
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                        <AvatarFallback>{notification.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm">
                              <Link to={`/profile/${notification.user.username}`} className="font-medium">
                                {notification.user.name}
                              </Link>{" "}
                              {notification.content}
                            </p>
                            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                          </div>
                          {notification.postImage && (
                            <div className="ml-2 flex-shrink-0">
                              <img
                                src={notification.postImage || "/placeholder.svg"}
                                alt="Post"
                                width={60}
                                height={60}
                                className="rounded-md"
                              />
                            </div>
                          )}
                          {notification.type === "follow" && (
                            <Button
                              variant={followStatus[notification.user.username] ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleFollow(notification.user.username)}
                              className={
                                followStatus[notification.user.username] ? "" : "bg-yamaha-red hover:bg-yamaha-darkRed"
                              }
                            >
                              {followStatus[notification.user.username] ? "Following" : "Follow"}
                            </Button>
                          )}
                        </div>
                        {notification.adImage && (
                          <div className="mt-3">
                            <img
                              src={notification.adImage || "/placeholder.svg"}
                              alt="Advertisement"
                              width={400}
                              height={200}
                              className="rounded-md w-full h-auto"
                            />
                            <div className="mt-2 flex justify-end">
                              <Button size="sm" className="bg-yamaha-red hover:bg-yamaha-darkRed">
                                Learn More
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No unread notifications</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
