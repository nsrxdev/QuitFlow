import { supabase } from "./supabase"
import { createUser } from "./api"

export async function signUp(
  email: string,
  password: string,
  dailyCigarettes: number,
  symptoms: string,
  photoUrl?: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error }
  }

  if (data.user) {
    // Create user profile
    const { error: profileError } = await createUser(data.user.id, email, dailyCigarettes, symptoms, photoUrl)

    if (profileError) {
      return { error: profileError }
    }
  }

  return { data }
}

export async function signIn(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user
}

