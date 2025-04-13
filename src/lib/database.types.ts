
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          mobile: string
          created_at: string
          invitation_code: string | null
          referred_by: string | null
        }
        Insert: {
          id?: string
          email: string
          mobile: string
          created_at?: string
          invitation_code?: string | null
          referred_by?: string | null
        }
        Update: {
          id?: string
          email?: string
          mobile?: string
          created_at?: string
          invitation_code?: string | null
          referred_by?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          deposit_wallet: number
          withdrawal_wallet: number
          total_withdrawn: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          deposit_wallet?: number
          withdrawal_wallet?: number
          total_withdrawn?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          deposit_wallet?: number
          withdrawal_wallet?: number
          total_withdrawn?: number
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price: number
          validity: number
          daily_earning: number
          description: string | null
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          validity: number
          daily_earning: number
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          validity?: number
          daily_earning?: number
          description?: string | null
          image_url?: string | null
          created_at?: string
        }
      }
      user_plans: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          purchase_date: string
          expiry_date: string
          last_claimed: string | null
          total_claimed: number
          active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          purchase_date?: string
          expiry_date: string
          last_claimed?: string | null
          total_claimed?: number
          active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          purchase_date?: string
          expiry_date?: string
          last_claimed?: string | null
          total_claimed?: number
          active?: boolean
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: string
          amount: number
          status: string
          created_at: string
          updated_at: string
          details: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          amount: number
          status: string
          created_at?: string
          updated_at?: string
          details?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          amount?: number
          status?: string
          created_at?: string
          updated_at?: string
          details?: Json | null
        }
      }
      deposit_methods: {
        Row: {
          id: string
          method: string
          details: Json
          active: boolean
        }
        Insert: {
          id?: string
          method: string
          details: Json
          active?: boolean
        }
        Update: {
          id?: string
          method?: string
          details?: Json
          active?: boolean
        }
      }
      announcements: {
        Row: {
          id: string
          title: string
          content: string
          created_at: string
          image_url: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          created_at?: string
          image_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          created_at?: string
          image_url?: string | null
        }
      }
    }
  }
}
