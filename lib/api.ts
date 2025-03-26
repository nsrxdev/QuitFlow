import { supabase } from "./supabase"

// Create user and initial data on signup
export async function createUser(
  email: string,
  dailyCigarettes: number,
  symptoms: string,
  photoUrl?: string,
) {
  return await supabase.from("users").insert({
    email,
    daily_cigarettes: dailyCigarettes,
    symptoms,
    photo_url: photoUrl,
  })
}




// Log smoking behavior
export async function logSmoking(userId: string, smoked: boolean) {
  const { data: userData, error: userError } = await supabase.from("users").select("xp").eq("id", userId).single()
  if (userError) return { error: userError }

  const xpToAdd = smoked ? 4 : 10
  const newXp = (userData?.xp || 0) + xpToAdd

  const updateData: any = { xp: newXp }
  if (smoked) updateData.last_cigarette_time = new Date().toISOString()

  const { error: updateError } = await supabase.from("users").update(updateData).eq("id", userId)
  if (updateError) return { error: updateError }

  return await supabase.from("smoke_logs").insert({
    user_id: userId,
    smoked,
  })
}

// Log breathing exercise completion
export async function logBreathingExercise(userId: string) {
  const { data: userData, error: userError } = await supabase.from("users").select("xp").eq("id", userId).single()
  if (userError) return { error: userError }

  const newXp = (userData?.xp || 0) + 5
  const { error: updateError } = await supabase.from("users").update({ xp: newXp }).eq("id", userId)
  if (updateError) return { error: updateError }

  return await supabase.from("breathing_logs").insert({
    user_id: userId,
    completed: true,
  })
}

// Fetch user data including XP and progress
export async function getUserData(userId: string) {
  return await supabase.from("users").select("*").eq("id", userId).single()
}

// Submit a review
export async function submitReview(userId: string, content: string) {
  return await supabase.from("reviews").insert({
    user_id: userId,
    content,
  })
}

// Fetch reviews with user info
export async function getReviews() {
  return await supabase
    .from("reviews")
    .select(`
      *,
      users (
        email,
        photo_url
      )
    `)
    .order("created_at", { ascending: false })
}

// Like a review
export async function likeReview(reviewId: string) {
  const { data, error } = await supabase.from("reviews").select("likes_count").eq("id", reviewId).single()
  if (error) return { error }

  return await supabase
    .from("reviews")
    .update({ likes_count: (data?.likes_count || 0) + 1 })
    .eq("id", reviewId)
}

// Submit a comment
export async function submitComment(reviewId: string, userId: string, content: string) {
  return await supabase.from("comments").insert({
    review_id: reviewId,
    user_id: userId,
    content,
  })
}

// Fetch comments for a review
export async function getComments(reviewId: string) {
  return await supabase
    .from("comments")
    .select(`
      *,
      users (
        email,
        photo_url
      )
    `)
    .eq("review_id", reviewId)
    .order("created_at", { ascending: true })
}

// Update user's daily cigarettes (for restart)
export async function updateDailyCigarettes(userId: string, dailyCigarettes: number) {
  return await supabase
    .from("users")
    .update({
      daily_cigarettes: dailyCigarettes,
      current_week: 1,
      start_date: new Date().toISOString(),
    })
    .eq("id", userId)
}

// Update user's current week
export async function updateUserWeek(userId: string, week: number) {
  return await supabase
    .from("users")
    .update({
      current_week: week,
    })
    .eq("id", userId)
}

// Calculate allowed cigarettes based on week and initial count
export function calculateAllowedCigarettes(initialCount: number, currentWeek: number): number {
  const reductionRates = [0.25, 0.5, 0.65, 0.8, 0.9, 1]
  const reduction = reductionRates[currentWeek - 1] || 0
  const allowed = Math.ceil(initialCount * (1 - reduction))
  return Math.max(allowed, 0)
}
