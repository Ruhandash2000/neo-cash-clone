/**
 * Neo Cash AI â€” Database Query Library (Phase 1)
 *
 * This module is the single source of truth for all Supabase interactions.
 * - All reads  â†’ typed Supabase queries, usable with React Query
 * - All writes â†’ Supabase RPC calls (security-definer) or direct mutations
 * - No localStorage reads/writes here; that layer is being deprecated
 *
 * Usage:
 *   import { feeQueries, walletQueries, ... } from '@/lib/db'
 *   const { data } = useQuery(feeQueries.list())
 *
 * NOTE: The `db` constant below is an `any`-cast of the Supabase client.
 * It is used for tables that exist in the live Postgres schema but are not
 * yet reflected in the generated types.ts (run `supabase gen types` after
 * applying the Phase 1 migration to remove all `db` usages and switch back
 * to the fully-typed `supabase` client).
 */

import { supabase } from '@/integrations/supabase/client';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

import type {
  FeeStatus,
  FeeCategory,
  PartialApplicationStatus,
  AiMatchStatus,
  NotificationEventType,
  EscalationStatus,
} from '@/integrations/supabase/types';


// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PROFILE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const profileQueries = {
  /** Fetch the current authenticated user's full profile */
  me: () => ({
    queryKey: ['profile', 'me'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '')
        .single();
      if (error) throw error;
      return data;
    },
  }),
};

export const profileMutations = {
  /** Update editable profile fields */
  update: async (fields: {
    full_name?: string;
    phone?: string;
    department?: string;
    class_year?: string;
    section?: string;
    semester?: string;
    session_year?: string;
    avatar_url?: string;
  }) => {
    // Profiles are mutated only via service-role RPCs; direct update is for
    // non-sensitive fields. We cast via `as unknown` since the RPC is
    // security-definer and won't be in the auto-generated type until re-generated.
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { error } = await db
      .from('profiles')
      .update(fields)
      .eq('id', user.id);
    if (error) throw error;
  },

  /** Upload and set avatar image */
  uploadAvatar: async (userId: string, file: File) => {
    const ext  = file.name.split('.').pop();
    const path = `${userId}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
    const { error } = await db
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);
    if (error) throw error;
    return publicUrl;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// INSTITUTIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const institutionQueries = {
  /** Search institutions by name prefix */
  search: (query: string) => ({
    queryKey: ['institutions', 'search', query],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('is_active', true)
        .ilike('name', `%${query}%`)
        .order('name')
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    enabled: query.length > 1,
  }),

  /** Get all active institutions */
  all: () => ({
    queryKey: ['institutions', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data ?? [];
    },
  }),

  /** Get one institution by ID */
  byId: (id: string) => ({
    queryKey: ['institutions', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  }),
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// WALLET
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const walletQueries = {
  /** Get the current user's wallet */
  mine: () => ({
    queryKey: ['wallet', 'mine'],
    queryFn: async () => {
      const { data, error } = await db
        .from('wallets')
        .select('*')
        .single();
      if (error) throw error;
      return data;
    },
  }),
};

export const walletMutations = {
  /** Ensure wallet exists after onboarding (safe to call multiple times) */
  ensureWallet: async (institutionId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)('ensure_student_wallet', {
      p_institution_id: institutionId,
    });
    if (error) throw error;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// FEES
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const feeQueries = {
  /** All fees for the current authenticated student */
  mine: () => ({
    queryKey: ['fees', 'mine'],
    queryFn: async () => {
      const { data, error } = await db
        .from('fees')
        .select('*')
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  }),

  /** Fees for a specific student (admin/head access) */
  forStudent: (studentId: string) => ({
    queryKey: ['fees', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await db
        .from('fees')
        .select('*')
        .eq('user_id', studentId)
        .order('due_date', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!studentId,
  }),
};

export const feeMutations = {
  /** Pay a fee using wallet balance */
  payFromWallet: async (feeId: string, amount: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('pay_fee_from_wallet', {
      p_fee_id: feeId,
      p_amount: amount,
    });
    if (error) throw error;
    return data as { receipt_number: string; reference_id: string; transaction_id: string };
  },

  /** Admin: assign fees to a cohort of students */
  assignToCohort: async (params: {
    institutionId: string;
    title: string;
    amount: number;
    dueDate: string;
    category: FeeCategory;
    description: string;
    department?: string;
    classYear?: string;
    semester?: string;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('assign_fees_to_cohort', {
      p_institution_id: params.institutionId,
      p_title:          params.title,
      p_amount:         params.amount,
      p_due_date:       params.dueDate,
      p_category:       params.category,
      p_description:    params.description,
      p_department:     params.department ?? null,
      p_class_year:     params.classYear ?? null,
      p_semester:       params.semester ?? null,
    });
    if (error) throw error;
    return data as number; // number of students assigned
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TRANSACTIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const transactionQueries = {
  /** Transaction history for current user */
  mine: (limit = 50) => ({
    queryKey: ['transactions', 'mine', limit],
    queryFn: async () => {
      const { data, error } = await db
        .from('transactions')
        .select('*')
        .order('occurred_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  }),

  /** Transactions for a specific student (admin/head) */
  forStudent: (studentId: string) => ({
    queryKey: ['transactions', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await db
        .from('transactions')
        .select('*')
        .eq('user_id', studentId)
        .order('occurred_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!studentId,
  }),
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PARTIAL PAYMENT APPLICATIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const partialApplicationQueries = {
  /** Current student's own applications */
  mine: () => ({
    queryKey: ['partial-applications', 'mine'],
    queryFn: async () => {
      const { data, error } = await db
        .from('partial_payment_applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  }),

  /** All pending applications for admin's institution */
  adminQueue: (institutionId: string) => ({
    queryKey: ['partial-applications', 'admin-queue', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('partial_payment_applications')
        .select('*')
        .eq('institution_id', institutionId)
        .in('status', ['pending_admin', 'submitted'] as PartialApplicationStatus[])
        .order('submitted_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),

  /** Applications forwarded to head */
  headQueue: (institutionId: string) => ({
    queryKey: ['partial-applications', 'head-queue', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('partial_payment_applications')
        .select('*')
        .eq('institution_id', institutionId)
        .eq('status', 'forwarded_head')
        .order('submitted_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),
};

export const partialApplicationMutations = {
  /** Submit a new partial payment application with uploaded docs */
  submit: async (params: {
    feeId: string;
    institutionId: string;
    studentName: string;
    studentCollegeId: string;
    feeTitle: string;
    originalAmount: number;
    requestedAmount: number;
    reason: string;
    hardshipStatement: string;
    guardianName: string;
    guardianPhone: string;
    guardianNidFile: File;
    guardianSignatureFile: File;
    studentSignatureFile: File;
    userId: string;
  }) => {
    // 1. Upload documents to Supabase Storage
    const basePath = `${params.userId}/${params.feeId}`;

    const uploadFile = async (file: File, name: string) => {
      const ext  = file.name.split('.').pop();
      const path = `${basePath}/${name}.${ext}`;
      const { error } = await supabase.storage
        .from('partial-applications')
        .upload(path, file, { upsert: true });
      if (error) throw new Error(`Upload failed for ${name}: ${error.message}`);
      return path;
    };

    const [nidPath, guardianSigPath, studentSigPath] = await Promise.all([
      uploadFile(params.guardianNidFile,        'guardian-nid'),
      uploadFile(params.guardianSignatureFile,  'guardian-signature'),
      uploadFile(params.studentSignatureFile,   'student-signature'),
    ]);

    // 2. Insert application record
    const { data, error } = await db
      .from('partial_payment_applications')
      .insert({
        fee_id:                  params.feeId,
        institution_id:          params.institutionId,
        user_id:                 params.userId,
        student_name:            params.studentName,
        student_college_id:      params.studentCollegeId,
        fee_title:               params.feeTitle,
        original_amount:         params.originalAmount,
        requested_amount:        params.requestedAmount,
        reason:                  params.reason,
        hardship_statement:      params.hardshipStatement,
        guardian_name:           params.guardianName,
        guardian_phone:          params.guardianPhone,
        guardian_nid_doc_path:   nidPath,
        guardian_signature_path: guardianSigPath,
        student_signature_path:  studentSigPath,
        status:                  'pending_admin' as PartialApplicationStatus,
        submitted_at:            new Date().toISOString(),
      })
      .select()
      .single();
    if (error) throw error;

    // 3. Update fee status to pending
    await db
      .from('fees')
      .update({ status: 'pending_partial' as FeeStatus })
      .eq('id', params.feeId);

    return data;
  },

  /** Admin: forward application to head */
  forwardToHead: async (applicationId: string, adminNotes?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)('forward_partial_to_head', {
      p_application_id: applicationId,
      p_admin_notes:    adminNotes ?? null,
    });
    if (error) throw error;
  },

  /** Head: approve partial payment */
  headApprove: async (params: {
    applicationId: string;
    approvedAmount: number;
    newDeadline: string;
    headNotes?: string;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)('head_approve_partial', {
      p_application_id:  params.applicationId,
      p_approved_amount: params.approvedAmount,
      p_new_deadline:    params.newDeadline,
      p_head_notes:      params.headNotes ?? null,
    });
    if (error) throw error;
  },

  /** Head: reject partial payment */
  headReject: async (applicationId: string, rejectionReason: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.rpc as any)('head_reject_partial', {
      p_application_id:   applicationId,
      p_rejection_reason: rejectionReason,
    });
    if (error) throw error;
  },
};

/** Get a short-lived signed URL for a private document */
export const getDocumentSignedUrl = async (storagePath: string, expiresIn = 3600) => {
  const { data, error } = await supabase.storage
    .from('partial-applications')
    .createSignedUrl(storagePath, expiresIn);
  if (error) throw error;
  return data.signedUrl;
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// NOTIFICATIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const notificationQueries = {
  mine: (limit = 30) => ({
    queryKey: ['notifications', 'mine', limit],
    queryFn: async () => {
      const { data, error } = await db
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  }),

  unreadCount: () => ({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { count, error } = await db
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);
      if (error) throw error;
      return count ?? 0;
    },
  }),
};

export const notificationMutations = {
  markRead: async (notificationId: string) => {
    const { error } = await db
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;
  },

  markAllRead: async () => {
    const { error } = await db
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);
    if (error) throw error;
  },

  send: async (params: {
    userId: string;
    title: string;
    body: string;
    eventType?: NotificationEventType;
    category?: string;
  }) => {
    const { error } = await db
      .from('notifications')
      .insert({
        user_id:    params.userId,
        title:      params.title,
        body:       params.body,
        event_type: params.eventType,
        category:   params.category ?? 'system',
      });
    if (error) throw error;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REALTIME SUBSCRIPTIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
/**
 * Subscribe to real-time notification inserts for the current user.
 *
 * @example
 *   useEffect(() => {
 *     const channel = subscribeToNotifications(userId, (n) => {
 *       queryClient.invalidateQueries({ queryKey: ['notifications'] });
 *       toast.info(n.title);
 *     });
 *     return () => { supabase.removeChannel(channel); };
 *   }, [userId]);
 */
export const subscribeToNotifications = (
  userId: string,
  onInsert: (notification: { id: string; title: string; body: string; event_type: string | null }) => void,
) => {
  return supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => onInsert(payload.new as never),
    )
    .subscribe();
};

/** Subscribe to real-time fee updates (e.g. when admin assigns or head approves) */
export const subscribeToFees = (
  userId: string,
  onUpdate: () => void,
) => {
  return supabase
    .channel(`fees:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'fees', filter: `user_id=eq.${userId}` }, onUpdate)
    .subscribe();
};

/** Subscribe to wallet balance changes */
export const subscribeToWallet = (userId: string, onUpdate: () => void) => {
  return supabase
    .channel(`wallet:${userId}`)
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'wallets', filter: `user_id=eq.${userId}` }, onUpdate)
    .subscribe();
};

/** Subscribe to partial application status changes */
export const subscribeToPartialApplications = (userId: string, onUpdate: () => void) => {
  return supabase
    .channel(`partial_apps:${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'partial_payment_applications', filter: `user_id=eq.${userId}` }, onUpdate)
    .subscribe();
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STUDENT DIRECTORY (admin)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const studentDirectoryQueries = {
  list: (params: {
    institutionId: string;
    search?: string;
    department?: string;
    classYear?: string;
    semester?: string;
    section?: string;
    feeStatus?: string;
    page?: number;
    pageSize?: number;
  }) => ({
    queryKey: ['student-directory', params],
    queryFn: async () => {
      let query = db
        .from('student_directory')
        .select('*', { count: 'exact' })
        .eq('institution_id', params.institutionId);

      if (params.search) {
        query = query.or(
          `name.ilike.%${params.search}%,student_id.ilike.%${params.search}%,email.ilike.%${params.search}%`,
        );
      }
      if (params.department) query = query.eq('department', params.department);
      if (params.classYear)  query = query.eq('class_year', params.classYear);
      if (params.semester)   query = query.eq('semester',   params.semester);
      if (params.section)    query = query.eq('section',    params.section);

      const page     = params.page     ?? 0;
      const pageSize = params.pageSize ?? 20;
      const from     = page * pageSize;
      query = query.range(from, from + pageSize - 1).order('name');

      const { data, error, count } = await query;
      if (error) throw error;
      return { students: data ?? [], total: count ?? 0 };
    },
    enabled: !!params.institutionId,
  }),

  /** Manually enrol a new student (admin creates profile + wallet) */
  enrol: async (params: {
    institutionId: string;
    fullName: string;
    email: string;
    studentId: string;
    department: string;
    classYear: string;
    section: string;
    semester: string;
    phone?: string;
  }) => {
    // Call edge function or service-role to create auth user + profile
    // This must go through a Supabase Edge Function for security.
    const { data, error } = await supabase.functions.invoke('admin-enrol-student', {
      body: params,
    });
    if (error) throw error;
    return data;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DONATIONS & LEADERBOARD
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const donationQueries = {
  myDonations: () => ({
    queryKey: ['donations', 'mine'],
    queryFn: async () => {
      const { data, error } = await db
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  }),

  myRanking: (userId: string) => ({
    queryKey: ['leaderboard', 'mine', userId],
    queryFn: async () => {
      const { data, error } = await db
        .from('donation_leaderboard')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!userId,
  }),

  topDonors: (institutionId: string, scope: 'institution' | 'national' = 'institution', limit = 10) => ({
    queryKey: ['leaderboard', scope, institutionId, limit],
    queryFn: async () => {
      let query = db
        .from('donation_leaderboard')
        .select('*')
        .order(scope === 'institution' ? 'rank_institution' : 'rank_national')
        .limit(limit);

      if (scope === 'institution') {
        query = query.eq('institution_id', institutionId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),
};

export const donationMutations = {
  donate: async (amount: number, message?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('donate_to_welfare', {
      p_amount:  amount,
      p_message: message ?? null,
    });
    if (error) throw error;
    return data as { points_awarded: number; receipt: string };
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// AUDIT LOGS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const auditLogQueries = {
  list: (institutionId: string, limit = 100) => ({
    queryKey: ['audit-logs', institutionId, limit],
    queryFn: async () => {
      const { data, error } = await db
        .from('audit_logs')
        .select('*')
        .eq('institution_id', institutionId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ESCALATION TICKETS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const escalationQueries = {
  mine: () => ({
    queryKey: ['escalations', 'mine'],
    queryFn: async () => {
      const { data, error } = await db
        .from('escalation_tickets')
        .select('*, escalation_messages(*)')
        .order('last_reply_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  }),

  institutionQueue: (institutionId: string) => ({
    queryKey: ['escalations', 'admin', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('escalation_tickets')
        .select('*, escalation_messages(*)')
        .eq('institution_id', institutionId)
        .in('status', ['open', 'in_progress'] as EscalationStatus[])
        .order('last_reply_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),
};

export const escalationMutations = {
  create: async (institutionId: string, subject: string, firstMessage: string) => {
    const { data: ticket, error: ticketError } = await db
      .from('escalation_tickets')
      .insert({ institution_id: institutionId, subject, user_id: '' /* filled by RLS */ })
      .select()
      .single();
    if (ticketError) throw ticketError;

    const { error: msgError } = await db
      .from('escalation_messages')
      .insert({
        ticket_id:   ticket.id,
        sender_role: 'student',
        sender_name: 'Student',
        text:        firstMessage,
      });
    if (msgError) throw msgError;
    return ticket;
  },

  reply: async (ticketId: string, senderName: string, senderRole: string, text: string, actionType?: string) => {
    const { error } = await db
      .from('escalation_messages')
      .insert({ ticket_id: ticketId, sender_role: senderRole, sender_name: senderName, text, action_type: actionType });
    if (error) throw error;

    await db
      .from('escalation_tickets')
      .update({ last_reply_at: new Date().toISOString(), status: senderRole === 'admin' ? 'in_progress' : 'open' })
      .eq('id', ticketId);
  },

  resolve: async (ticketId: string) => {
    const { error } = await db
      .from('escalation_tickets')
      .update({ status: 'resolved' })
      .eq('id', ticketId);
    if (error) throw error;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ACADEMIC STRUCTURE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const academicQueries = {
  departments: (institutionId: string) => ({
    queryKey: ['academic', 'departments', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('academic_departments')
        .select('*')
        .eq('institution_id', institutionId)
        .order('name');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),

  classes: (institutionId: string) => ({
    queryKey: ['academic', 'classes', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('academic_classes')
        .select('*')
        .eq('institution_id', institutionId)
        .order('year');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),

  sections: (institutionId: string) => ({
    queryKey: ['academic', 'sections', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('academic_sections')
        .select('*')
        .eq('institution_id', institutionId)
        .order('name');
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// REMINDER RULES (admin)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const reminderRulesQueries = {
  get: (institutionId: string) => ({
    queryKey: ['reminder-rules', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('reminder_rules')
        .select('*')
        .eq('institution_id', institutionId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data ?? null;
    },
    enabled: !!institutionId,
  }),
};

export const reminderRulesMutations = {
  upsert: async (institutionId: string, rules: {
    weeklyReminderEnabled: boolean;
    nearDeadlineDays: number;
    finalDayAlertEnabled: boolean;
    overduePenaltyNotice: boolean;
  }) => {
    const { error } = await db
      .from('reminder_rules')
      .upsert({
        institution_id:          institutionId,
        weekly_reminder_enabled: rules.weeklyReminderEnabled,
        near_deadline_days:      rules.nearDeadlineDays,
        final_day_alert_enabled: rules.finalDayAlertEnabled,
        overdue_penalty_notice:  rules.overduePenaltyNotice,
      }, { onConflict: 'institution_id' });
    if (error) throw error;
  },
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// IMPORT LOGS (admin)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const importLogQueries = {
  list: (institutionId: string) => ({
    queryKey: ['import-logs', institutionId],
    queryFn: async () => {
      const { data, error } = await db
        .from('import_logs')
        .select('*')
        .eq('institution_id', institutionId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!institutionId,
  }),
};

export const importLogMutations = {
  record: async (params: {
    institutionId: string;
    adminUserId: string;
    adminName: string;
    fileName: string;
    importedCount: number;
    rejectedCount: number;
    warningCount: number;
    status: 'Completed' | 'Partial Success' | 'Failed';
    errorDetails?: unknown;
  }) => {
    const { error } = await db
      .from('import_logs')
      .insert({
        institution_id:  params.institutionId,
        admin_user_id:   params.adminUserId,
        admin_name:      params.adminName,
        file_name:       params.fileName,
        imported_count:  params.importedCount,
        rejected_count:  params.rejectedCount,
        warning_count:   params.warningCount,
        status:          params.status,
        error_details:   (params.errorDetails as never) ?? null,
      });
    if (error) throw error;
  },
};
