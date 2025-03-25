"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { signUp } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export default function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [dailyCigarettes, setDailyCigarettes] = useState<number>(10)
  const [symptoms, setSymptoms] = useState("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState(1)

  const commonSymptoms = [
    "Coughing",
    "Shortness of breath",
    "Fatigue",
    "Chest pain",
    "Headaches",
    "Anxiety",
    "Insomnia",
  ]

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPhoto(null)
      setPhotoUrl(null)
      return
    }

    const file = e.target.files[0]
    setPhoto(file)

    // Create a preview
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setPhotoUrl(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let finalPhotoUrl = null

      // Upload photo if provided
      if (photo) {
        const fileExt = photo.name.split(".").pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `user-photos/${fileName}`

        const { error: uploadError, data } = await supabase.storage.from("photos").upload(filePath, photo)

        if (uploadError) {
          throw new Error(uploadError.message)
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("photos").getPublicUrl(filePath)

        finalPhotoUrl = publicUrl
      }

      // Combine selected symptoms with custom symptoms
      const allSymptoms = [...selectedSymptoms]
      if (symptoms.trim()) {
        allSymptoms.push(symptoms)
      }

      const { error } = await signUp(email, password, dailyCigarettes, allSymptoms.join(", "), finalPhotoUrl)

      if (error) {
        throw new Error(error.message)
      }

      // Redirect to home page or confirmation page
      router.push("/login?message=Check your email to confirm your account")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Your Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 ? "Step 1: Account Details" : step === 2 ? "Step 2: Smoking Habits" : "Step 3: Profile Setup"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a secure password"
                  minLength={6}
                />
                <p className="text-xs text-gray-500">Password must be at least 6 characters</p>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="dailyCigarettes">How many cigarettes do you smoke per day?</Label>
                <Input
                  id="dailyCigarettes"
                  type="number"
                  value={dailyCigarettes}
                  onChange={(e) => setDailyCigarettes(Number.parseInt(e.target.value) || 0)}
                  required
                  min={1}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <Label>Do you experience any of these symptoms?</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={`symptom-${symptom}`}
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <label
                        htmlFor={`symptom-${symptom}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Other symptoms or notes (optional)</Label>
                <Textarea
                  id="symptoms"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe any other symptoms or concerns..."
                  className="h-20"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo (optional)</Label>
                <div className="flex flex-col items-center space-y-4">
                  {photoUrl && (
                    <div className="relative w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={photoUrl || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="w-full" />
                </div>
                <p className="text-xs text-gray-500">Upload a profile photo to personalize your account</p>
              </div>
            </>
          )}

          {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

          <div className="flex justify-between">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)} disabled={loading}>
                Back
              </Button>
            )}
            <Button type="submit" className={step < 3 ? "ml-auto" : ""} disabled={loading}>
              {step < 3 ? "Next" : "Create Account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

