"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import BreathingExercise from "@/components/breathing-exercise"
import LoadingAnimation from "@/components/loading-animation"
import { getCurrentUser } from "@/lib/auth"

export default function BreathingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
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

  return <BreathingExercise userId={user.id} />
}

