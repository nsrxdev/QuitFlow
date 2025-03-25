"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { logBreathingExercise } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function BreathingExercise({ userId }: { userId: string }) {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "inhale" | "hold" | "exhale" | "complete">("idle")
  const [progress, setProgress] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const animationRef = useRef<number | null>(null)
  const circleRef = useRef<SVGCircleElement | null>(null)

  const startExercise = () => {
    setStatus("inhale")
    setTotalTime(60) // 1 minute total
    setSecondsLeft(60)
  }

  useEffect(() => {
    if (status === "idle" || status === "complete") return

    const startTime = performance.now()
    let lastUpdateTime = startTime

    const animate = (currentTime: number) => {
      // Calculate elapsed time since last update
      const deltaTime = currentTime - lastUpdateTime
      lastUpdateTime = currentTime

      // Update seconds left
      setSecondsLeft((prev) => {
        const newValue = Math.max(0, prev - deltaTime / 1000)

        // Update progress percentage
        setProgress(100 - (newValue / totalTime) * 100)

        // Check if we need to change status
        if (newValue <= 0) {
          if (status === "inhale") {
            setStatus("hold")
            return 4 // Hold for 4 seconds
          } else if (status === "hold") {
            setStatus("exhale")
            return 6 // Exhale for 6 seconds
          } else if (status === "exhale") {
            // Check if total time is up
            if ((currentTime - startTime) / 1000 >= totalTime) {
              setStatus("complete")
              return 0
            } else {
              setStatus("inhale")
              return 4 // Inhale for 4 seconds
            }
          }
        }

        return newValue
      })

      // Continue animation if not complete
      if (status !== "complete") {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // Start animation
    animationRef.current = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [status, totalTime])

  // Handle completion
  useEffect(() => {
    if (status === "complete") {
      const logExercise = async () => {
        try {
          await logBreathingExercise(userId)
        } catch (error) {
          console.error("Error logging breathing exercise:", error)
        }
      }

      logExercise()
    }
  }, [status, userId])

  // Animation for the circle
  useEffect(() => {
    if (!circleRef.current) return

    const circle = circleRef.current
    const radius = Number.parseInt(circle.getAttribute("r") || "50")
    const circumference = 2 * Math.PI * radius

    // Set initial state
    circle.style.strokeDasharray = `${circumference} ${circumference}`
    circle.style.strokeDashoffset = `${circumference}`

    // Animation based on status
    if (status === "inhale") {
      // Expand the circle
      circle.style.transition = "stroke-dashoffset 4s ease-in"
      circle.style.strokeDashoffset = "0"
    } else if (status === "hold") {
      // Keep the circle expanded
      circle.style.transition = "none"
    } else if (status === "exhale") {
      // Contract the circle
      circle.style.transition = "stroke-dashoffset 6s ease-out"
      circle.style.strokeDashoffset = `${circumference}`
    }
  }, [status])

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Breathing Exercise</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="2" />
                {/* Animated circle */}
                <circle
                  ref={circleRef}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-center">
                {status === "idle" ? (
                  <Button onClick={startExercise}>Start</Button>
                ) : status === "complete" ? (
                  <div className="space-y-2">
                    <div className="text-2xl">🎉</div>
                    <div className="text-lg font-medium">Complete!</div>
                    <div className="text-sm text-gray-500">+5 XP earned</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {status === "inhale" ? "Inhale" : status === "hold" ? "Hold" : "Exhale"}
                    </div>
                    <div className="text-lg">{Math.ceil(secondsLeft)}s</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {status !== "idle" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {status === "complete" && (
            <div className="flex justify-center">
              <Button onClick={() => router.push("/home")}>Return Home</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Benefits of Deep Breathing</h3>
        <ul className="space-y-1 text-sm">
          <li>• Reduces stress and anxiety</li>
          <li>• Helps manage cigarette cravings</li>
          <li>• Improves lung capacity</li>
          <li>• Increases oxygen to your body</li>
          <li>• Lowers blood pressure</li>
        </ul>
      </div>
    </div>
  )
}

