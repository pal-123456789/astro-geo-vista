export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      anomaly_detections: {
        Row: {
          affected_regions: string[] | null
          altitude: number | null
          analysis_results: Json
          anomaly_type: string
          confidence_score: number
          created_at: string
          detection_time: string
          duration_estimate: unknown | null
          id: string
          latitude: number | null
          location: unknown | null
          longitude: number | null
          mitigation_suggestions: Json | null
          nasa_source: string
          predicted_impact_time: string | null
          raw_data: Json
          severity: string
          status: string
          updated_at: string
        }
        Insert: {
          affected_regions?: string[] | null
          altitude?: number | null
          analysis_results?: Json
          anomaly_type: string
          confidence_score: number
          created_at?: string
          detection_time?: string
          duration_estimate?: unknown | null
          id?: string
          latitude?: number | null
          location?: unknown | null
          longitude?: number | null
          mitigation_suggestions?: Json | null
          nasa_source: string
          predicted_impact_time?: string | null
          raw_data?: Json
          severity: string
          status?: string
          updated_at?: string
        }
        Update: {
          affected_regions?: string[] | null
          altitude?: number | null
          analysis_results?: Json
          anomaly_type?: string
          confidence_score?: number
          created_at?: string
          detection_time?: string
          duration_estimate?: unknown | null
          id?: string
          latitude?: number | null
          location?: unknown | null
          longitude?: number | null
          mitigation_suggestions?: Json | null
          nasa_source?: string
          predicted_impact_time?: string | null
          raw_data?: Json
          severity?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      environmental_alerts: {
        Row: {
          alert_type: string
          created_at: string
          id: string
          is_active: boolean
          is_read: boolean
          latitude: number | null
          location: unknown | null
          longitude: number | null
          message: string
          metadata: Json | null
          resolved_at: string | null
          severity: string
          title: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_read?: boolean
          latitude?: number | null
          location?: unknown | null
          longitude?: number | null
          message: string
          metadata?: Json | null
          resolved_at?: string | null
          severity: string
          title: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_read?: boolean
          latitude?: number | null
          location?: unknown | null
          longitude?: number | null
          message?: string
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alert_preferences: Json | null
          api_access_level: string
          avatar_url: string | null
          created_at: string
          dashboard_config: Json | null
          full_name: string | null
          id: string
          location_preferences: Json | null
          notification_settings: Json | null
          organization: string | null
          role: string
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_preferences?: Json | null
          api_access_level?: string
          avatar_url?: string | null
          created_at?: string
          dashboard_config?: Json | null
          full_name?: string | null
          id?: string
          location_preferences?: Json | null
          notification_settings?: Json | null
          organization?: string | null
          role?: string
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_preferences?: Json | null
          api_access_level?: string
          avatar_url?: string | null
          created_at?: string
          dashboard_config?: Json | null
          full_name?: string | null
          id?: string
          location_preferences?: Json | null
          notification_settings?: Json | null
          organization?: string | null
          role?: string
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      real_time_feeds: {
        Row: {
          anomaly_score: number | null
          created_at: string
          data_source: string
          feed_type: string
          id: string
          processed_data: Json | null
          raw_data: Json
          timestamp: string
        }
        Insert: {
          anomaly_score?: number | null
          created_at?: string
          data_source: string
          feed_type: string
          id?: string
          processed_data?: Json | null
          raw_data: Json
          timestamp: string
        }
        Update: {
          anomaly_score?: number | null
          created_at?: string
          data_source?: string
          feed_type?: string
          id?: string
          processed_data?: Json | null
          raw_data?: Json
          timestamp?: string
        }
        Relationships: []
      }
      risk_predictions: {
        Row: {
          confidence_score: number
          created_at: string
          id: string
          latitude: number
          longitude: number
          model_version: string
          prediction_data: Json
          region_name: string
          risk_level: string
          risk_type: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          confidence_score: number
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          model_version: string
          prediction_data?: Json
          region_name: string
          risk_level: string
          risk_type: string
          valid_from?: string
          valid_until: string
        }
        Update: {
          confidence_score?: number
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          model_version?: string
          prediction_data?: Json
          region_name?: string
          risk_level?: string
          risk_type?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          quality_score: number | null
          sensor_id: string
          timestamp: string
          unit: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          quality_score?: number | null
          sensor_id: string
          timestamp?: string
          unit: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          quality_score?: number | null
          sensor_id?: string
          timestamp?: string
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      sensors: {
        Row: {
          created_at: string
          id: string
          installation_date: string
          last_maintenance: string | null
          latitude: number
          location: unknown
          longitude: number
          name: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          installation_date?: string
          last_maintenance?: string | null
          latitude: number
          location: unknown
          longitude: number
          name: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          installation_date?: string
          last_maintenance?: string | null
          latitude?: number
          location?: unknown
          longitude?: number
          name?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          anomaly_id: string | null
          created_at: string
          delivery_status: string | null
          id: string
          message: string
          metadata: Json | null
          notification_type: string
          priority: string
          read_at: string | null
          sent_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          anomaly_id?: string | null
          created_at?: string
          delivery_status?: string | null
          id?: string
          message: string
          metadata?: Json | null
          notification_type: string
          priority?: string
          read_at?: string | null
          sent_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          anomaly_id?: string | null
          created_at?: string
          delivery_status?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          notification_type?: string
          priority?: string
          read_at?: string | null
          sent_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_anomaly_id_fkey"
            columns: ["anomaly_id"]
            isOneToOne: false
            referencedRelation: "anomaly_detections"
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
