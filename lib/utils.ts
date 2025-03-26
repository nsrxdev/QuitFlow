import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate time until next cigarette
export function getTimeUntilNextCigarette(lastCigaretteTime: string, allowedPerDay: number): number {
  if (allowedPerDay <= 0) return 0

  const now = new Date()
  const last = new Date(lastCigaretteTime)

  // Calculate hours in a day divided by allowed cigarettes
  const hoursPerCigarette = 24 / allowedPerDay

  // Convert to milliseconds
  const msPerCigarette = hoursPerCigarette * 60 * 60 * 1000

  // Calculate when the next cigarette is allowed
  const nextAllowedTime = new Date(last.getTime() + msPerCigarette)

  // If next allowed time is in the past, return 0
  if (nextAllowedTime <= now) {
    return 0
  }

  // Return milliseconds until next allowed cigarette
  return nextAllowedTime.getTime() - now.getTime()
}

// Format milliseconds to HH:MM:SS
export function formatTime(ms: number): string {
  if (ms <= 0) return "00:00:00"

  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
  const hours = Math.floor(ms / (1000 * 60 * 60))

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":")
}

// Calculate XP level based on total XP
export function calculateLevel(xp: number): number {
  // Simple formula: level = sqrt(xp / 10)
  return Math.floor(Math.sqrt(xp / 10)) + 1
}

// Calculate progress to next level
export function calculateLevelProgress(xp: number): number {
  const currentLevel = calculateLevel(xp)
  const xpForCurrentLevel = Math.pow(currentLevel - 1, 2) * 10
  const xpForNextLevel = Math.pow(currentLevel, 2) * 10

  const progress = (xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)
  return Math.min(Math.max(progress, 0), 1) // Ensure between 0 and 1
}

// Get week information
export function getWeekInfo(weekNumber: number): {
  title: string
  reduction: string
  benefits: string[]
} {
  const weekInfo = [
    {
      title: "Week 1",
      reduction: "Cut by ~25%",
      benefits: ["Heart rate & BP normalize", "Oxygen circulation improves", "Cravings begin"],
    },
    {
      title: "Week 2",
      reduction: "~50% of original",
      benefits: ["Taste and smell return", "Easier breathing", "More stable energy"],
    },
    {
      title: "Week 3",
      reduction: "~60–70% reduction",
      benefits: ["Improved lung function", "Less coughing", "Better circulation"],
    },
    {
      title: "Week 4",
      reduction: "Few cigarettes/day",
      benefits: ["Lung cilia healing", "Cravings weaken", "Skin looks fresher"],
    },
    {
      title: "Week 5",
      reduction: "1/day or every other day",
      benefits: ["Dopamine levels adjust", "Breathing improves", "Lower heart risk"],
    },
    {
      title: "Week 6",
      reduction: "🚫 0 Cigarettes (Quit Week)",
      benefits: ["Cough nearly gone", "Stronger immune system", "Better focus, mood, energy"],
    },
  ]

  return weekInfo[weekNumber - 1] || weekInfo[0]
}


// Calculates how many cigarettes are allowed today based on starting point and progress
export function calculateAllowedCigarettes(startingCigsPerDay: number, daysPassed: number): number {
  const totalDays = 42; // 6 weeks = 42 days
  const remaining = Math.max(0, startingCigsPerDay - Math.floor((startingCigsPerDay / totalDays) * daysPassed));
  return remaining;
}
