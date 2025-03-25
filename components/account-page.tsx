"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getUserData } from "@/lib/api"
import { calculateLevel, calculateLevelProgress } from "@/lib/utils"
import { signOut } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function AccountPage({ userId }: { userId: string }) {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await getUserData(userId)
        if (error) throw error
        setUserData(data)
      } catch (err) {
        console.error("Error fetching user data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleContactSupport = () => {
    window.location.href = "mailto:nsrx.dev@hotmail.com?subject=Stop%20Smoking%20App%20Support"
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!userData) {
    return <div className="flex justify-center items-center min-h-screen">Error loading data</div>
  }

  const level = calculateLevel(userData.xp)
  const progress = calculateLevelProgress(userData.xp)
  const daysSinceStart = Math.floor(
    (new Date().getTime() - new Date(userData.start_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">My Account</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              {userData.photo_url ? (
                <AvatarImage src={userData.photo_url} alt="Profile" />
              ) : (
                <AvatarFallback className="text-2xl">{userData.email.charAt(0).toUpperCase()}</AvatarFallback>
              )}
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold">{userData.email}</h2>
              <p className="text-sm text-gray-500">Member for {daysSinceStart} days</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Level {level}</h3>
                <span className="text-xs text-gray-500">{userData.xp} XP</span>
              </div>
              <Progress value={progress * 100} />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold">{userData.current_week}/6</div>
                <div className="text-xs text-gray-500">Current Week</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold">{daysSinceStart}</div>
                <div className="text-xs text-gray-500">Days Smoke-Free</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full" onClick={handleContactSupport}>
              Contact Support
            </Button>
            <Button variant="outline" className="w-full text-red-500 hover:text-red-600" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

