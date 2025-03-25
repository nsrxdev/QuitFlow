"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export default function WelcomeScreen() {
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center mb-6">
          <Image src={logoSrc || "/placeholder.svg"} alt="QuitFlow Logo" width={200} height={200} priority />
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Begin Your Smoke-Free Journey
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300">
          Welcome to a 6-week program designed to help you gradually quit smoking and improve your health.
        </p>

        <div className="space-y-4 text-left bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">How It Works:</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2 text-orange-500">✓</span>
              <span>Gradually reduce cigarettes over 6 weeks</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-orange-500">✓</span>
              <span>Track your progress and earn XP</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-orange-500">✓</span>
              <span>Practice breathing exercises</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-orange-500">✓</span>
              <span>Connect with others on the same journey</span>
            </li>
          </ul>
        </div>

        <Button asChild className="w-full py-6 text-lg bg-orange-500 hover:bg-orange-600">
          <Link href="/signup">Start Now</Link>
        </Button>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:underline dark:text-orange-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}

