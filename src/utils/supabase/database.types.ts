export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      chat_messages: {
        Row: {
          body: string;
          created_at: string;
          id: string;
          room_id: string;
          sender_id: string;
        };
        Insert: {
          body: string;
          created_at?: string;
          id?: string;
          room_id: string;
          sender_id: string;
        };
        Update: {
          body?: string;
          created_at?: string;
          id?: string;
          room_id?: string;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_messages_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "chat_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey";
            columns: ["sender_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      chat_rooms: {
        Row: {
          created_at: string;
          id: string;
          matches_id: string;
          post_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          matches_id: string;
          post_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          matches_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chat_rooms_matches_id_fkey";
            columns: ["matches_id"];
            isOneToOne: false;
            referencedRelation: "matches";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chat_rooms_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
        ];
      };
      matches: {
        Row: {
          created_at: string;
          id: string;
          matched_runner_id: string;
          message: string | null;
          post_id: string;
          status: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          matched_runner_id: string;
          message?: string | null;
          post_id: string;
          status?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          matched_runner_id?: string;
          message?: string | null;
          post_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "matches_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "posts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "matches_runner_id_fkey";
            columns: ["matched_runner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      posts: {
        Row: {
          author_id: string;
          created_at: string;
          description: string;
          goal_km: number;
          id: string;
          is_completed: boolean;
          is_expired: boolean;
          meeting_detail_place: string;
          meeting_place: string;
          meeting_time: string;
          pace: number;
          status: string;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          author_id: string;
          created_at?: string;
          description: string;
          goal_km: number;
          id?: string;
          is_completed?: boolean;
          is_expired?: boolean;
          meeting_detail_place: string;
          meeting_place: string;
          meeting_time: string;
          pace: number;
          status?: string;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          author_id?: string;
          created_at?: string;
          description?: string;
          goal_km?: number;
          id?: string;
          is_completed?: boolean;
          is_expired?: boolean;
          meeting_detail_place?: string;
          meeting_place?: string;
          meeting_time?: string;
          pace?: number;
          status?: string;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey";
            columns: ["author_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          is_verified: boolean | null;
          nickname: string;
          profile_image_url: string | null;
          runner_type: string;
          total_join: number | null;
          total_mileage: number | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string;
          id: string;
          is_verified?: boolean | null;
          nickname: string;
          profile_image_url?: string | null;
          runner_type: string;
          total_join?: number | null;
          total_mileage?: number | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_verified?: boolean | null;
          nickname?: string;
          profile_image_url?: string | null;
          runner_type?: string;
          total_join?: number | null;
          total_mileage?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      gbt_bit_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_bool_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_bool_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_bpchar_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_bytea_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_cash_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_cash_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_date_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_date_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_enum_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_enum_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_float4_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_float4_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_float8_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_float8_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_inet_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_int2_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_int2_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_int4_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_int4_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_int8_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_int8_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_intv_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_intv_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_intv_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_macad_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_macad_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_macad8_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_macad8_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_numeric_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_oid_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_oid_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_text_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_time_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_time_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_timetz_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_ts_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_ts_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_tstz_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_uuid_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_uuid_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_var_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbt_var_fetch: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey_var_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey_var_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey16_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey16_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey2_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey2_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey32_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey32_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey4_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey4_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey8_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      gbtreekey8_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      get_latest_messages_per_room: {
        Args: Record<PropertyKey, never>;
        Returns: {
          body: string;
          created_at: string;
          room_id: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
