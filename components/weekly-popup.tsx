"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getWeekInfo } from "@/lib/utils"
import { updateUserWeek } from "@/lib/api"

interface WeeklyPopupProps {
  week: number
  onClose: () => void
  userId: string
}

export default function WeeklyPopup({ week, onClose, userId }: WeeklyPopupProps) {
  const [loading, setLoading] = useState(false)
  const weekInfo = getWeekInfo(week)

  const handleContinue = async () => {
    setLoading(true)

    try {
      await updateUserWeek(userId, week)
      onClose()
    } catch (error) {
      console.error("Error updating week:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {weekInfo.title} - {weekInfo.reduction}
          </DialogTitle>
          <DialogDescription className="text-center">Your body is healing! Here's what's happening:</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {weekInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2 text-green-500">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center text-sm text-gray-500">
            Keep going! Your journey continues with reduced cigarette intake.
          </div>
        </div>

        <Button onClick={handleContinue} className="w-full" disabled={loading}>
          {loading ? "Updating..." : "Continue My Journey"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}

