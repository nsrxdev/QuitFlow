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

  const user = data?.user

  if (user?.id) {
    const { error: profileError } = await createUser(
      user.id, // MUST match auth.uid()
      email,
      dailyCigarettes,
      symptoms,
      photoUrl ?? null
    )

    if (profileError) {
      return { error: profileError }
    }
  } else {
    return { error: { message: "User creation failed or user ID missing." } }
  }

  return { data }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error }
  }

  return { data }
}

export async function signOut() {
  return await supabase.auth.signOut()
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  return data?.user
}
