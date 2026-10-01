/**
 * Neo Cash AI — Supabase TypeScript Types (Phase 1 Full Schema)
 * Generated shape: manually maintained until `supabase gen types` is run
 * against the live project.
 *
 * Run after applying the migration:
 *   npx supabase gen types typescript --project-id <your-project-id> \
 *     > src/integrations/supabase/types.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─────────────────────────────────────────────
// Shared enums (kept as string literals for
// runtime safety — SQL CHECK constraints enforce
// the same set on the server side)
// ─────────────────────────────────────────────
export type FeeStatus =
  | 'due'
  | 'paid'
  | 'overdue'
  | 'pending_partial'
  | 'partial_approved';

export type FeeCategory =
  | 'Tuition'
  | 'Lab & Tech'
  | 'Library'
  | 'Exam'
  | 'Hostel'
  | 'Transport';

export type PartialApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'pending_admin'
  | 'forwarded_head'
  | 'approved_head'
  | 'rejected_admin'
  | 'rejected_head'
  | 'changes_requested'
  | 'paid';

export type AiMatchStatus = 'Signature Match' | 'Needs Review' | 'Mismatch';

export type TransactionType =
  | 'fee_payment'
  | 'wallet'
  | 'donation'
  | 'refund'
  | 'fee';

export type TransactionStatus = 'Success' | 'Pending' | 'Failed' | 'Refunded';
export type EscalationStatus  = 'open' | 'in_progress' | 'resolved';
export type ImportStatus      = 'Completed' | 'Partial Success' | 'Failed';
export type SslcommerzStatus  = 'initiated' | 'success' | 'failed' | 'cancelled';
export type UserRole          = 'student' | 'admin' | 'head' | 'demo_controller';

export type NotificationEventType =
  | 'login'
  | 'fee_assigned'
  | 'fee_reminder'
  | 'payment_success'
  | 'payment_failure'
  | 'deadline_approaching'
  | 'deadline_missed'
  | 'partial_payment_submitted'
  | 'admin_reviewed'
  | 'head_approved'
  | 'head_rejected'
  | 'donation_completed';

// ─────────────────────────────────────────────
// Database shape
// ─────────────────────────────────────────────
export type Database = {
  __InternalSupabase: { PostgrestVersion: '14.5' };
  public: {
    Tables: {
      // ── profiles ────────────────────────────
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string | null;
          role: UserRole;
          institution_id: string | null;
          student_id: string | null;
          cgpa: number | null;
          phone: string | null;
          avatar_url: string | null;
          department: string | null;
          class_year: string | null;
          section: string | null;
          semester: string | null;
          session_year: string | null;
          is_verified: boolean;
          is_demo_user: boolean;
          onboarding_completed: boolean;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name?: string | null;
          role?: UserRole;
          institution_id?: string | null;
          student_id?: string | null;
          cgpa?: number | null;
          phone?: string | null;
          avatar_url?: string | null;
          department?: string | null;
          class_year?: string | null;
          section?: string | null;
          semester?: string | null;
          session_year?: string | null;
          is_verified?: boolean;
          is_demo_user?: boolean;
          onboarding_completed?: boolean;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };

      // ── institutions ───────────────────────
      institutions: {
        Row: {
          id: string;
          name: string;
          short_name: string | null;
          type: string;
          location: string | null;
          logo_url: string | null;
          email_domains: string[];
          is_verified: boolean;
          is_active: boolean;
          contact_email: string | null;
          contact_phone: string | null;
          website_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['institutions']['Row']> & { id: string; name: string };
        Update: Partial<Database['public']['Tables']['institutions']['Row']>;
        Relationships: [];
      };

      // ── wallets ─────────────────────────────
      wallets: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          available_balance: number;
          wallet_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          available_balance?: number;
          wallet_balance?: number;
        };
        Update: Partial<Database['public']['Tables']['wallets']['Insert']>;
        Relationships: [{ foreignKeyName: 'wallets_user_id_fkey'; columns: ['user_id']; referencedRelation: 'profiles'; referencedColumns: ['id'] }];
      };

      // ── fees ────────────────────────────────
      fees: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          title: string;
          amount: number;
          original_amount: number | null;
          due_date: string | null;
          issued_date: string | null;
          paid_date: string | null;
          status: FeeStatus;
          category: FeeCategory;
          description: string | null;
          partial_allowed: boolean;
          approved_partial_amt: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          title: string;
          amount: number;
          original_amount?: number | null;
          due_date?: string | null;
          issued_date?: string | null;
          status?: FeeStatus;
          category?: FeeCategory;
          description?: string | null;
          partial_allowed?: boolean;
          approved_partial_amt?: number | null;
        };
        Update: Partial<Database['public']['Tables']['fees']['Insert']>;
        Relationships: [];
      };

      // ── transactions ────────────────────────
      transactions: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          title: string;
          amount: number;
          kind: string;
          status: TransactionStatus;
          type: TransactionType;
          reference_id: string | null;
          receipt_number: string | null;
          fee_id: string | null;
          payment_method: string | null;
          gateway_session: string | null;
          occurred_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          title: string;
          amount: number;
          kind: string;
          status: TransactionStatus;
          type?: TransactionType;
          reference_id?: string | null;
          receipt_number?: string | null;
          fee_id?: string | null;
          payment_method?: string | null;
          gateway_session?: string | null;
          occurred_at?: string;
        };
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>;
        Relationships: [];
      };

      // ── partial_payment_applications ────────
      partial_payment_applications: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          fee_id: string | null;
          status: PartialApplicationStatus;
          requested_amount: number;
          approved_amount: number | null;
          remaining_amount: number | null;
          new_deadline: string | null;
          student_name: string | null;
          student_college_id: string | null;
          fee_title: string | null;
          original_amount: number | null;
          reason: string | null;
          hardship_statement: string | null;
          guardian_name: string | null;
          guardian_phone: string | null;
          guardian_nid_doc_path: string | null;
          guardian_signature_path: string | null;
          student_signature_path: string | null;
          ai_match_score: number | null;
          ai_match_status: AiMatchStatus | null;
          admin_notes: string | null;
          head_notes: string | null;
          rejection_reason: string | null;
          change_request_notes: string | null;
          submitted_at: string | null;
          reviewed_by_admin_id: string | null;
          reviewed_by_head_id: string | null;
          details: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          fee_id?: string | null;
          requested_amount: number;
          status?: PartialApplicationStatus;
          student_name?: string | null;
          student_college_id?: string | null;
          fee_title?: string | null;
          original_amount?: number | null;
          reason?: string | null;
          hardship_statement?: string | null;
          guardian_name?: string | null;
          guardian_phone?: string | null;
          guardian_nid_doc_path?: string | null;
          guardian_signature_path?: string | null;
          student_signature_path?: string | null;
          ai_match_score?: number | null;
          ai_match_status?: AiMatchStatus | null;
          submitted_at?: string | null;
          details?: Json;
        };
        Update: Partial<Database['public']['Tables']['partial_payment_applications']['Insert']>;
        Relationships: [];
      };

      // ── notifications ───────────────────────
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          body: string;
          event_type: NotificationEventType | null;
          category: string | null;
          is_read: boolean;
          email_alert: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          body: string;
          event_type?: NotificationEventType | null;
          category?: string | null;
          is_read?: boolean;
          email_alert?: boolean;
        };
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>;
        Relationships: [];
      };

      // ── documents ───────────────────────────
      documents: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          storage_path: string;
          document_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          storage_path: string;
          document_type: string;
        };
        Update: Partial<Database['public']['Tables']['documents']['Insert']>;
        Relationships: [];
      };

      // ── donations ───────────────────────────
      donations: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          amount: number;
          points_awarded: number;
          message: string | null;
          transaction_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          amount: number;
          points_awarded?: number;
          message?: string | null;
          transaction_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['donations']['Insert']>;
        Relationships: [];
      };

      // ── audit_logs ──────────────────────────
      audit_logs: {
        Row: {
          id: string;
          institution_id: string;
          actor_user_id: string | null;
          actor_name: string;
          actor_role: string;
          action_type: string;
          action_description: string;
          target_student_id: string | null;
          target_student_name: string | null;
          target_student_college_id: string | null;
          financial_record_title: string | null;
          before_value: string | null;
          after_value: string | null;
          sha256_hash: string | null;
          created_at: string;
        };
        Insert: never; // Read-only: written via security-definer RPCs only
        Update: never;
        Relationships: [];
      };

      // ── escalation_tickets ──────────────────
      escalation_tickets: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          subject: string;
          status: EscalationStatus;
          created_at: string;
          updated_at: string;
          last_reply_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          subject: string;
          status?: EscalationStatus;
        };
        Update: Partial<Database['public']['Tables']['escalation_tickets']['Insert']>;
        Relationships: [];
      };

      // ── escalation_messages ─────────────────
      escalation_messages: {
        Row: {
          id: string;
          ticket_id: string;
          sender_id: string | null;
          sender_role: string;
          sender_name: string;
          text: string;
          action_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          sender_id?: string | null;
          sender_role?: string;
          sender_name: string;
          text: string;
          action_type?: string | null;
        };
        Update: Partial<Database['public']['Tables']['escalation_messages']['Insert']>;
        Relationships: [];
      };

      // ── academic_departments ─────────────────
      academic_departments: {
        Row: {
          id: string;
          institution_id: string;
          code: string;
          name: string;
          head_name: string | null;
          total_students: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          code: string;
          name: string;
          head_name?: string | null;
          total_students?: number;
        };
        Update: Partial<Database['public']['Tables']['academic_departments']['Insert']>;
        Relationships: [];
      };

      // ── academic_classes ─────────────────────
      academic_classes: {
        Row: {
          id: string;
          institution_id: string;
          department_code: string;
          name: string;
          year: string;
          semester: string;
          total_sections: number;
          total_students: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          department_code: string;
          name: string;
          year: string;
          semester: string;
          total_sections?: number;
          total_students?: number;
        };
        Update: Partial<Database['public']['Tables']['academic_classes']['Insert']>;
        Relationships: [];
      };

      // ── academic_sections ────────────────────
      academic_sections: {
        Row: {
          id: string;
          institution_id: string;
          department_code: string;
          class_year: string;
          name: string;
          capacity: number;
          current_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          department_code: string;
          class_year: string;
          name: string;
          capacity?: number;
          current_count?: number;
        };
        Update: Partial<Database['public']['Tables']['academic_sections']['Insert']>;
        Relationships: [];
      };

      // ── reminder_rules ───────────────────────
      reminder_rules: {
        Row: {
          id: string;
          institution_id: string;
          weekly_reminder_enabled: boolean;
          near_deadline_days: number;
          final_day_alert_enabled: boolean;
          overdue_penalty_notice: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          weekly_reminder_enabled?: boolean;
          near_deadline_days?: number;
          final_day_alert_enabled?: boolean;
          overdue_penalty_notice?: boolean;
        };
        Update: Partial<Database['public']['Tables']['reminder_rules']['Insert']>;
        Relationships: [];
      };

      // ── import_logs ──────────────────────────
      import_logs: {
        Row: {
          id: string;
          institution_id: string;
          admin_user_id: string;
          admin_name: string;
          file_name: string;
          imported_count: number;
          rejected_count: number;
          warning_count: number;
          status: ImportStatus;
          error_details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          institution_id: string;
          admin_user_id: string;
          admin_name: string;
          file_name: string;
          imported_count?: number;
          rejected_count?: number;
          warning_count?: number;
          status?: ImportStatus;
          error_details?: Json | null;
        };
        Update: Partial<Database['public']['Tables']['import_logs']['Insert']>;
        Relationships: [];
      };

      // ── sslcommerz_sessions ──────────────────
      sslcommerz_sessions: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          tran_id: string;
          purpose: string;
          fee_id: string | null;
          amount: number;
          currency: string;
          status: SslcommerzStatus;
          gateway_response: Json | null;
          val_id: string | null;
          bank_tran_id: string | null;
          card_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          tran_id: string;
          purpose: string;
          fee_id?: string | null;
          amount: number;
          currency?: string;
          status?: SslcommerzStatus;
        };
        Update: Partial<Database['public']['Tables']['sslcommerz_sessions']['Insert']>;
        Relationships: [];
      };

      // ── webauthn_credentials ─────────────────
      webauthn_credentials: {
        Row: {
          backed_up: boolean;
          counter: number;
          created_at: string;
          credential_id: string;
          device_type: string | null;
          id: string;
          last_used_at: string | null;
          public_key: string;
          transports: string[];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          backed_up?: boolean;
          counter?: number;
          created_at?: string;
          credential_id: string;
          device_type?: string | null;
          id?: string;
          last_used_at?: string | null;
          public_key: string;
          transports?: string[];
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database['public']['Tables']['webauthn_credentials']['Insert']>;
        Relationships: [];
      };

      // ── webauthn_challenges ──────────────────
      webauthn_challenges: {
        Row: {
          challenge: string;
          consumed: boolean;
          created_at: string;
          email: string | null;
          expires_at: string;
          id: string;
          purpose: string;
          user_id: string | null;
        };
        Insert: {
          challenge: string;
          consumed?: boolean;
          created_at?: string;
          email?: string | null;
          expires_at?: string;
          id?: string;
          purpose: string;
          user_id?: string | null;
        };
        Update: Partial<Database['public']['Tables']['webauthn_challenges']['Insert']>;
        Relationships: [];
      };

      // ── activity_history ─────────────────────
      activity_history: {
        Row: {
          id: string;
          user_id: string;
          institution_id: string;
          actor_user_id: string;
          action: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution_id: string;
          actor_user_id: string;
          action: string;
          details?: Json;
        };
        Update: Partial<Database['public']['Tables']['activity_history']['Insert']>;
        Relationships: [];
      };

      // ── payment_methods ──────────────────────
      payment_methods: {
        Row: {
          id: string;
          user_id: string;
          provider: string;
          masked_account: string;
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          provider: string;
          masked_account: string;
          is_default?: boolean;
        };
        Update: Partial<Database['public']['Tables']['payment_methods']['Insert']>;
        Relationships: [];
      };
    };

    Views: {
      student_directory: {
        Row: {
          id: string;
          name: string | null;
          student_id: string | null;
          department: string | null;
          class_year: string | null;
          section: string | null;
          semester: string | null;
          email: string;
          phone: string | null;
          institution_id: string | null;
          is_verified: boolean;
          onboarding_completed: boolean;
          wallet_balance: number;
          available_balance: number;
          total_dues: number;
          overdue_count: number;
          created_at: string;
        };
      };
      donation_leaderboard: {
        Row: {
          user_id: string;
          name: string | null;
          institution_id: string | null;
          department: string | null;
          class_year: string | null;
          section: string | null;
          total_donated: number;
          total_points: number;
          rank_class: number;
          rank_dept: number;
          rank_institution: number;
          rank_national: number;
        };
      };
    };

    Functions: {
      complete_student_onboarding: {
        Args: { selected_institution_id: string };
        Returns: undefined;
      };
      ensure_student_wallet: {
        Args: { p_institution_id: string };
        Returns: undefined;
      };
      pay_fee_from_wallet: {
        Args: { p_fee_id: string; p_amount: number };
        Returns: Json; // { receipt_number, reference_id, transaction_id }
      };
      assign_fees_to_cohort: {
        Args: {
          p_institution_id: string;
          p_title: string;
          p_amount: number;
          p_due_date: string;
          p_category: string;
          p_description: string;
          p_department?: string;
          p_class_year?: string;
          p_semester?: string;
        };
        Returns: number; // count of students assigned
      };
      forward_partial_to_head: {
        Args: { p_application_id: string; p_admin_notes?: string };
        Returns: undefined;
      };
      head_approve_partial: {
        Args: {
          p_application_id: string;
          p_approved_amount: number;
          p_new_deadline: string;
          p_head_notes?: string;
        };
        Returns: undefined;
      };
      head_reject_partial: {
        Args: { p_application_id: string; p_rejection_reason: string };
        Returns: undefined;
      };
      donate_to_welfare: {
        Args: { p_amount: number; p_message?: string };
        Returns: Json; // { points_awarded, receipt }
      };
      current_profile_role: { Args: Record<string, never>; Returns: string };
      current_profile_institution: { Args: Record<string, never>; Returns: string };
      can_access_institution: { Args: { target_institution: string }; Returns: boolean };
    };

    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

// ─────────────────────────────────────────────
// Convenience helper types
// ─────────────────────────────────────────────
type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  T extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']),
> = (DefaultSchema['Tables'] & DefaultSchema['Views'])[T] extends { Row: infer R } ? R : never;

export type TablesInsert<T extends keyof DefaultSchema['Tables']> =
  DefaultSchema['Tables'][T] extends { Insert: infer I } ? I : never;

export type TablesUpdate<T extends keyof DefaultSchema['Tables']> =
  DefaultSchema['Tables'][T] extends { Update: infer U } ? U : never;

export type Enums<T extends keyof DefaultSchema['Enums']> =
  DefaultSchema['Enums'][T];

export const Constants = {
  public: { Enums: {} },
} as const;
