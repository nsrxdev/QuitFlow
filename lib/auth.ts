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
    const { error: profileError } = await createUser(
      data.user.id,
      email,
      dailyCigarettes,
      symptoms,
      photoUrl // this can be undefined if not provided
    )

    if (profileError) {
      return { error: profileError }
    }
  }

  return { data }
}
