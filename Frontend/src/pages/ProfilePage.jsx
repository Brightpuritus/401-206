"use client"

import { useParams } from "react-router-dom"
import { MainLayout } from "../components/main-layout"
import { ProfileView } from "../components/profile-view"

function ProfilePage() {
  const { username } = useParams()

  return (
    <MainLayout>
      <ProfileView username={username} />
    </MainLayout>
  )
}

export default ProfilePage
