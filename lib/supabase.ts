import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// These would normally be environment variables, but we're hardcoding them for direct deployment
const supabaseUrl = "https://vmieyhhewsyywgrylyyn.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtaWV5aGhld3N5eXdncnlseXluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5NDM4ODgsImV4cCI6MjA1ODUxOTg4OH0.ja6BCFg53XSaVMO2jPILlStNhqni4emddzQif5yLT4k"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

