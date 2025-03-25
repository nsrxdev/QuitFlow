"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function LoadingAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()
  const logoSrc = resolvedTheme === "dark" ? "/logo-dark.png" : "/logo-light.png"

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 200
    canvas.height = 400

    // Cigarette properties
    const cigaretteLength = 300
    const cigaretteWidth = 20
    const filterLength = 80
    const burnRate = 0.5 // pixels per frame

    let burnPosition = 0
    let opacity = 1

    // Smoke particles
    const particles: { x: number; y: number; size: number; speed: number; opacity: number }[] = []

    function createParticle() {
      if (burnPosition < cigaretteLength - filterLength) {
        particles.push({
          x: canvas.width / 2,
          y: canvas.height - cigaretteLength + burnPosition,
          size: Math.random() * 5 + 2,
          speed: Math.random() * 1 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        })
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw cigarette
      // Filter (brown part)
      ctx.fillStyle = "#D4A76A"
      ctx.fillRect(canvas.width / 2 - cigaretteWidth / 2, canvas.height - filterLength, cigaretteWidth, filterLength)

      // White part
      ctx.fillStyle = "#FFFFFF"
      ctx.fillRect(
        canvas.width / 2 - cigaretteWidth / 2,
        canvas.height - cigaretteLength,
        cigaretteWidth,
        cigaretteLength - filterLength,
      )

      // Burning part
      if (burnPosition < cigaretteLength - filterLength) {
        // Red burning tip
        ctx.fillStyle = "#f97316" // Orange color from your logo
        ctx.beginPath()
        ctx.arc(canvas.width / 2, canvas.height - cigaretteLength + burnPosition, cigaretteWidth / 2, 0, Math.PI * 2)
        ctx.fill()

        // Update burn position
        burnPosition += burnRate

        // Create smoke particles
        if (Math.random() > 0.7) {
          createParticle()
        }
      } else {
        // Fade out when finished
        opacity -= 0.01
        if (opacity <= 0) {
          opacity = 0
          // Reset animation when completely faded
          if (particles.length === 0) {
            burnPosition = 0
            opacity = 1
          }
        }
      }

      // Update and draw smoke particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.y -= p.speed
        p.opacity -= 0.005

        // Draw smoke particle
        ctx.fillStyle = `rgba(200, 200, 200, ${p.opacity * opacity})`
        ctx.beginPath()
        ctx.arc(
          p.x + Math.sin(p.y * 0.05) * 10, // Add some waviness
          p.y,
          p.size,
          0,
          Math.PI * 2,
        )
        ctx.fill()

        // Remove faded particles
        if (p.opacity <= 0) {
          particles.splice(i, 1)
        }
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="mb-8">
        <Image src={logoSrc || "/placeholder.svg"} alt="QuitFlow Logo" width={150} height={150} priority />
      </div>
      <canvas ref={canvasRef} className="mx-auto" />
      <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-300">Loading...</p>
    </div>
  )
}

