import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// These would normally be environment variables, but we're hardcoding them for direct deployment
const supabaseUrl = "https://your-project-id.supabase.co"
const supabaseAnonKey = "your-anon-key"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

