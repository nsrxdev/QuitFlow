"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import HomeScreen from "@/components/home-screen"
import LoadingAnimation from "@/components/loading-animation"
import NotificationSetup from "@/components/notification-setup"
import { getCurrentUser } from "@/lib/auth"
import { getUserData } from "@/lib/api"
import EndJourney from "@/components/end-journey"

export default function HomePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
          router.push("/login")
          return
        }

        setUser(currentUser)

        // Get user data
        const { data, error } = await getUserData(currentUser.id)
        if (error) throw error

        setUserData(data)
      } catch (err) {
        console.error("Error checking auth:", err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return <LoadingAnimation />
  }

  if (!user) {
    return null // Will redirect to login
  }

  // Check if user has reached 0 cigarettes (Week 6)
  if (userData?.current_week === 6) {
    return <EndJourney userId={user.id} />
  }

  return (
    <>
      <HomeScreen userId={user.id} />
      <NotificationSetup />
    </>
  )
}

