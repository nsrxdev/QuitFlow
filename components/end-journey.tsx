"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateDailyCigarettes } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function EndJourney({ userId }: { userId: string }) {
  const router = useRouter()
  const [showFeedback, setShowFeedback] = useState(false)
  const [showRestart, setShowRestart] = useState(false)
  const [dailyCigarettes, setDailyCigarettes] = useState<number>(5)
  const [loading, setLoading] = useState(false)

  const handlePositiveFeedback = () => {
    setShowFeedback(true)
  }

  const handleNegativeFeedback = () => {
    setShowRestart(true)
  }

  const handleRestart = async () => {
    setLoading(true)

    try {
      await updateDailyCigarettes(userId, dailyCigarettes)
      router.push("/home")
    } catch (error) {
      console.error("Error restarting journey:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-md mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Congratulations!</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6 text-center">
          <div className="text-6xl">🎉</div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">You've Reached 0 Cigarettes</h2>
            <p className="text-gray-600">You've completed the 6-week journey to quit smoking. How do you feel?</p>
          </div>

          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex-1" onClick={handleNegativeFeedback}>
              👎 Not Great
            </Button>
            <Button className="flex-1" onClick={handlePositiveFeedback}>
              👍 Feeling Great!
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Positive Feedback Dialog */}
      <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Amazing Achievement!</DialogTitle>
            <DialogDescription>
              You've successfully quit smoking. This is a major milestone for your health!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Your Body Is Healing</h3>
              <ul className="space-y-1 text-sm">
                <li>• Your circulation has improved</li>
                <li>• Your lung function is increasing</li>
                <li>• Your risk of heart disease is decreasing</li>
                <li>• Your immune system is getting stronger</li>
                <li>• Your energy levels are improving</li>
              </ul>
            </div>

            <p className="text-center text-sm text-gray-600">
              Continue to stay smoke-free and enjoy the benefits of a healthier life!
            </p>
          </div>

          <Button
            onClick={() => {
              setShowFeedback(false)
              router.push("/home")
            }}
            className="w-full"
          >
            Continue My Smoke-Free Journey
          </Button>
        </DialogContent>
      </Dialog>

      {/* Restart Dialog */}
      <Dialog open={showRestart} onOpenChange={setShowRestart}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Restart Your Journey</DialogTitle>
            <DialogDescription>It's okay to have setbacks. Let's adjust your plan and try again.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="dailyCigarettes">How many cigarettes are you currently smoking per day?</Label>
              <Input
                id="dailyCigarettes"
                type="number"
                value={dailyCigarettes}
                onChange={(e) => setDailyCigarettes(Number.parseInt(e.target.value) || 0)}
                min={1}
                max={100}
              />
            </div>

            <p className="text-sm text-gray-600">
              We'll restart your 6-week journey with this new baseline. Remember, quitting is a process and it's normal
              to have ups and downs.
            </p>
          </div>

          <Button onClick={handleRestart} className="w-full" disabled={loading}>
            {loading ? "Restarting..." : "Restart My Journey"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

