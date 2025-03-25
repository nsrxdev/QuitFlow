export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          photo_url: string | null
          daily_cigarettes: number
          symptoms: string | null
          xp: number
          start_date: string
          current_week: number
          last_cigarette_time: string
        }
        Insert: {
          id: string
          email: string
          photo_url?: string | null
          daily_cigarettes: number
          symptoms?: string | null
          xp?: number
          start_date?: string
          current_week?: number
          last_cigarette_time?: string
        }
        Update: {
          id?: string
          email?: string
          photo_url?: string | null
          daily_cigarettes?: number
          symptoms?: string | null
          xp?: number
          start_date?: string
          current_week?: number
          last_cigarette_time?: string
        }
      }
      smoke_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          smoked: boolean
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          smoked: boolean
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          smoked?: boolean
        }
      }
      breathing_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          completed?: boolean
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string
          likes_count: number
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string
          likes_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string
          likes_count?: number
        }
      }
      comments: {
        Row: {
          id: string
          review_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          review_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          review_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}

