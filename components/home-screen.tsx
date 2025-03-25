"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getUserData, logSmoking } from "@/lib/api"
import { getTimeUntilNextCigarette, formatTime, calculateAllowedCigarettes } from "@/lib/utils"
import { useRouter } from "next/navigation"
import WeeklyPopup from "./weekly-popup"

export default function HomeScreen({ userId }: { userId: string }) {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [showTimer, setShowTimer] = useState(true)
  const [showWeeklyPopup, setShowWeeklyPopup] = useState(false)

  // Fetch user data
  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await getUserData(userId)
        if (error) throw error

        setUserData(data)

        // Check if we should show weekly popup
        const startDate = new Date(data.start_date)
        const now = new Date()
        const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

        // If it's been 7 days since start or last week change, show popup
        if (daysSinceStart > 0 && daysSinceStart % 7 === 0) {
          const newWeek = Math.min(Math.floor(daysSinceStart / 7) + 1, 6)

          // Only show popup if week has changed
          if (newWeek > data.current_week) {
            setShowWeeklyPopup(true)
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Update timer
  useEffect(() => {
    if (!userData) return

    const allowedCigarettes = calculateAllowedCigarettes(userData.daily_cigarettes, userData.current_week)

    // If no cigarettes allowed, don't show timer
    if (allowedCigarettes <= 0) {
      setShowTimer(false)
      return
    }

    const updateTimer = () => {
      const timeRemaining = getTimeUntilNextCigarette(userData.last_cigarette_time, allowedCigarettes)

      setTimeLeft(timeRemaining)
      setShowTimer(timeRemaining > 0)
    }

    // Initial update
    updateTimer()

    // Set interval to update timer
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [userData])

  const handleSmokeLog = async (smoked: boolean) => {
    if (!userData) return

    try {
      const { error } = await logSmoking(userId, smoked)
      if (error) throw error

      // Refresh user data
      const { data, error: fetchError } = await getUserData(userId)
      if (fetchError) throw fetchError

      setUserData(data)

      // Reset timer state
      setShowTimer(true)
    } catch (err) {
      console.error("Error logging smoking:", err)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!userData) {
    return <div className="flex justify-center items-center min-h-screen">Error loading data</div>
  }

  const allowedCigarettes = calculateAllowedCigarettes(userData.daily_cigarettes, userData.current_week)

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      {showWeeklyPopup && (
        <WeeklyPopup
          week={Math.min(userData.current_week + 1, 6)}
          onClose={() => setShowWeeklyPopup(false)}
          userId={userId}
        />
      )}

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">
          Day {Math.floor((new Date().getTime() - new Date(userData.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1}
        </h1>
        <p className="text-gray-600">
          Week {userData.current_week}: {allowedCigarettes} cigarettes allowed per day
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {showTimer ? (
            <>
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-700">Next cigarette in</h2>
                <div className="text-4xl font-bold my-4 font-mono">{formatTime(timeLeft)}</div>
                <p className="text-sm text-gray-500">Stay strong! You're doing great.</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <h2 className="text-lg font-medium text-gray-700">
                  {allowedCigarettes > 0 ? "You can smoke now" : "You've reached 0 cigarettes!"}
                </h2>
                <div className="my-4 text-6xl">{allowedCigarettes > 0 ? "🚬" : "🎉"}</div>
                <p className="text-sm text-gray-500 mb-4">
                  {allowedCigarettes > 0
                    ? "But you can earn extra XP by skipping it!"
                    : "Congratulations on your progress!"}
                </p>

                {allowedCigarettes > 0 && (
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => handleSmokeLog(true)} className="flex-1">
                      I Smoked (+4 XP)
                    </Button>
                    <Button onClick={() => handleSmokeLog(false)} className="flex-1">
                      Skip It! (+10 XP)
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">XP: {userData.xp}</h3>
          <span className="text-xs text-gray-500">Level {Math.floor(Math.sqrt(userData.xp / 10)) + 1}</span>
        </div>
        <Progress
          value={
            ((userData.xp - Math.pow(Math.floor(Math.sqrt(userData.xp / 10)), 2) * 10) /
              (Math.pow(Math.floor(Math.sqrt(userData.xp / 10)) + 1, 2) * 10 -
                Math.pow(Math.floor(Math.sqrt(userData.xp / 10)), 2) * 10)) *
            100
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="w-full" onClick={() => router.push("/breathing")}>
          Breathing Exercise
        </Button>
        <Button variant="outline" className="w-full" onClick={() => router.push("/reviews")}>
          Community
        </Button>
      </div>
    </div>
  )
}

