export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      daily_earnings: {
        Row: {
          amount: number
          claimed_at: string
          id: number
          plan_id: number
          user_id: string
        }
        Insert: {
          amount: number
          claimed_at?: string
          id?: number
          plan_id: number
          user_id: string
        }
        Update: {
          amount?: number
          claimed_at?: string
          id?: number
          plan_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_earnings_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "investment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_earnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_plans: {
        Row: {
          daily_earning: number
          description: string
          id: number
          image_url: string
          name: string
          price: number
          validity_days: number
        }
        Insert: {
          daily_earning: number
          description: string
          id?: number
          image_url: string
          name: string
          price: number
          validity_days: number
        }
        Update: {
          daily_earning?: number
          description?: string
          id?: number
          image_url?: string
          name?: string
          price?: number
          validity_days?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          deposit_balance: number
          email: string
          id: string
          is_admin: boolean | null
          name: string | null
          phone: string | null
          referral_code: string
          referred_by: string | null
          total_withdrawn: number
          withdrawal_balance: number
        }
        Insert: {
          created_at?: string
          deposit_balance?: number
          email: string
          id: string
          is_admin?: boolean | null
          name?: string | null
          phone?: string | null
          referral_code: string
          referred_by?: string | null
          total_withdrawn?: number
          withdrawal_balance?: number
        }
        Update: {
          created_at?: string
          deposit_balance?: number
          email?: string
          id?: string
          is_admin?: boolean | null
          name?: string | null
          phone?: string | null
          referral_code?: string
          referred_by?: string | null
          total_withdrawn?: number
          withdrawal_balance?: number
        }
        Relationships: []
      }
      purchased_plans: {
        Row: {
          expiry_date: string
          id: number
          plan_id: number
          purchase_date: string
          user_id: string
        }
        Insert: {
          expiry_date: string
          id?: number
          plan_id: number
          purchase_date?: string
          user_id: string
        }
        Update: {
          expiry_date?: string
          id?: number
          plan_id?: number
          purchase_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchased_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "investment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchased_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bank_details: Json | null
          created_at: string
          id: number
          status: string
          type: string
          user_id: string
          utr_number: string | null
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          created_at?: string
          id?: number
          status: string
          type: string
          user_id: string
          utr_number?: string | null
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          created_at?: string
          id?: number
          status?: string
          type?: string
          user_id?: string
          utr_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
