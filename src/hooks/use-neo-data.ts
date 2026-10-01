/**
 * Neo Cash AI — React Query Hooks (Phase 1)
 *
 * Drop-in hooks for all data domains. These wrap `@tanstack/react-query`
 * `useQuery` / `useMutation` with the db.ts query definitions.
 *
 * Usage:
 *   const { data: fees, isLoading } = useFees();
 *   const { mutate: payFee }        = usePayFeeFromWallet();
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import {
  profileQueries,
  profileMutations,
  institutionQueries,
  walletQueries,
  walletMutations,
  feeQueries,
  feeMutations,
  transactionQueries,
  partialApplicationQueries,
  partialApplicationMutations,
  notificationQueries,
  notificationMutations,
  studentDirectoryQueries,
  donationQueries,
  donationMutations,
  auditLogQueries,
  escalationQueries,
  escalationMutations,
  academicQueries,
  reminderRulesQueries,
  reminderRulesMutations,
  importLogQueries,
  subscribeToNotifications,
  subscribeToFees,
  subscribeToWallet,
  subscribeToPartialApplications,
} from '@/lib/db';

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export function useMyProfile() {
  return useQuery(profileQueries.me());
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileMutations.update,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUploadAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, file }: { userId: string; file: File }) =>
      profileMutations.uploadAvatar(userId, file),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated');
    },
    onError: (err: Error) => toast.error(`Avatar upload failed: ${err.message}`),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INSTITUTIONS
// ─────────────────────────────────────────────────────────────────────────────
export function useInstitutionSearch(query: string) {
  return useQuery(institutionQueries.search(query));
}

export function useAllInstitutions() {
  return useQuery(institutionQueries.all());
}

export function useInstitution(id: string) {
  return useQuery(institutionQueries.byId(id));
}

// ─────────────────────────────────────────────────────────────────────────────
// WALLET
// ─────────────────────────────────────────────────────────────────────────────
export function useMyWallet() {
  return useQuery(walletQueries.mine());
}

export function useEnsureWallet() {
  return useMutation({
    mutationFn: (institutionId: string) => walletMutations.ensureWallet(institutionId),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// FEES
// ─────────────────────────────────────────────────────────────────────────────
export function useMyFees() {
  return useQuery(feeQueries.mine());
}

export function useStudentFees(studentId: string) {
  return useQuery(feeQueries.forStudent(studentId));
}

export function usePayFeeFromWallet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ feeId, amount }: { feeId: string; amount: number }) =>
      feeMutations.payFromWallet(feeId, amount),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: ['fees'] });
      void qc.invalidateQueries({ queryKey: ['wallet'] });
      void qc.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(`Payment successful! Receipt: ${data.receipt_number}`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useAssignFeesToCohort() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: feeMutations.assignToCohort,
    onSuccess: (count) => {
      void qc.invalidateQueries({ queryKey: ['fees'] });
      void qc.invalidateQueries({ queryKey: ['student-directory'] });
      void qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success(`Fee assigned to ${count} students`);
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSACTIONS
// ─────────────────────────────────────────────────────────────────────────────
export function useMyTransactions(limit = 50) {
  return useQuery(transactionQueries.mine(limit));
}

export function useStudentTransactions(studentId: string) {
  return useQuery(transactionQueries.forStudent(studentId));
}

// ─────────────────────────────────────────────────────────────────────────────
// PARTIAL PAYMENT APPLICATIONS
// ─────────────────────────────────────────────────────────────────────────────
export function useMyPartialApplications() {
  return useQuery(partialApplicationQueries.mine());
}

export function useAdminApplicationQueue(institutionId: string) {
  return useQuery(partialApplicationQueries.adminQueue(institutionId));
}

export function useHeadApplicationQueue(institutionId: string) {
  return useQuery(partialApplicationQueries.headQueue(institutionId));
}

export function useSubmitPartialApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: partialApplicationMutations.submit,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['partial-applications'] });
      void qc.invalidateQueries({ queryKey: ['fees'] });
      toast.success('Application submitted successfully. Admin will review shortly.');
    },
    onError: (err: Error) => toast.error(`Submission failed: ${err.message}`),
  });
}

export function useForwardToHead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, adminNotes }: { applicationId: string; adminNotes?: string }) =>
      partialApplicationMutations.forwardToHead(applicationId, adminNotes),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['partial-applications'] });
      void qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Application forwarded to Head Executive');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useHeadApprovePartial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: partialApplicationMutations.headApprove,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['partial-applications'] });
      void qc.invalidateQueries({ queryKey: ['fees'] });
      void qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Application approved. Student has been notified.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useHeadRejectPartial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, reason }: { applicationId: string; reason: string }) =>
      partialApplicationMutations.headReject(applicationId, reason),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['partial-applications'] });
      void qc.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Application rejected. Student has been notified.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS (with Realtime)
// ─────────────────────────────────────────────────────────────────────────────
export function useMyNotifications(limit = 30) {
  return useQuery(notificationQueries.mine(limit));
}

export function useUnreadNotificationCount() {
  return useQuery(notificationQueries.unreadCount());
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationMutations.markRead(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationMutations.markAllRead,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

/**
 * Sets up Realtime subscriptions for a user session and auto-invalidates
 * React Query caches when server-side changes arrive.
 *
 * Call this once in your dashboard root component.
 */
export function useRealtimeSubscriptions(userId: string | null) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const notifChannel = subscribeToNotifications(userId, (notification) => {
      void qc.invalidateQueries({ queryKey: ['notifications'] });
      // Show a live toast for incoming notifications
      toast.info(notification.title, {
        description: notification.body.slice(0, 80),
      });
    });

    const feesChannel   = subscribeToFees(userId, () => {
      void qc.invalidateQueries({ queryKey: ['fees'] });
    });

    const walletChannel = subscribeToWallet(userId, () => {
      void qc.invalidateQueries({ queryKey: ['wallet'] });
    });

    const appsChannel   = subscribeToPartialApplications(userId, () => {
      void qc.invalidateQueries({ queryKey: ['partial-applications'] });
    });

    return () => {
      void supabase.removeChannel(notifChannel);
      void supabase.removeChannel(feesChannel);
      void supabase.removeChannel(walletChannel);
      void supabase.removeChannel(appsChannel);
    };
  }, [userId, qc]);
}

// ─────────────────────────────────────────────────────────────────────────────
// STUDENT DIRECTORY (admin)
// ─────────────────────────────────────────────────────────────────────────────
export function useStudentDirectory(params: {
  institutionId: string;
  search?: string;
  department?: string;
  classYear?: string;
  semester?: string;
  section?: string;
  feeStatus?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery(studentDirectoryQueries.list(params));
}

export function useEnrolStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: studentDirectoryQueries.enrol,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['student-directory'] });
      toast.success('Student enrolled successfully');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// DONATIONS & LEADERBOARD
// ─────────────────────────────────────────────────────────────────────────────
export function useMyDonations() {
  return useQuery(donationQueries.myDonations());
}

export function useMyDonationRanking(userId: string) {
  return useQuery(donationQueries.myRanking(userId));
}

export function useTopDonors(institutionId: string, scope: 'institution' | 'national' = 'institution') {
  return useQuery(donationQueries.topDonors(institutionId, scope));
}

export function useDonate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, message }: { amount: number; message?: string }) =>
      donationMutations.donate(amount, message),
    onSuccess: (data) => {
      void qc.invalidateQueries({ queryKey: ['donations'] });
      void qc.invalidateQueries({ queryKey: ['wallet'] });
      void qc.invalidateQueries({ queryKey: ['leaderboard'] });
      void qc.invalidateQueries({ queryKey: ['transactions'] });
      toast.success(`Donated! +${data.points_awarded} Impact Points earned 🎉`, {
        description: `Receipt: ${data.receipt}`,
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────
export function useAuditLogs(institutionId: string, limit = 100) {
  return useQuery(auditLogQueries.list(institutionId, limit));
}

// ─────────────────────────────────────────────────────────────────────────────
// ESCALATIONS
// ─────────────────────────────────────────────────────────────────────────────
export function useMyEscalations() {
  return useQuery(escalationQueries.mine());
}

export function useInstitutionEscalations(institutionId: string) {
  return useQuery(escalationQueries.institutionQueue(institutionId));
}

export function useCreateEscalation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ institutionId, subject, message }: {
      institutionId: string;
      subject: string;
      message: string;
    }) => escalationMutations.create(institutionId, subject, message),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['escalations'] });
      toast.success('Support ticket created. Our team will respond shortly.');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useReplyToEscalation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      ticketId: string;
      senderName: string;
      senderRole: string;
      text: string;
      actionType?: string;
    }) => escalationMutations.reply(params.ticketId, params.senderName, params.senderRole, params.text, params.actionType),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['escalations'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useResolveEscalation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ticketId: string) => escalationMutations.resolve(ticketId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['escalations'] });
      toast.success('Ticket resolved');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// ACADEMIC STRUCTURE
// ─────────────────────────────────────────────────────────────────────────────
export function useAcademicDepartments(institutionId: string) {
  return useQuery(academicQueries.departments(institutionId));
}

export function useAcademicClasses(institutionId: string) {
  return useQuery(academicQueries.classes(institutionId));
}

export function useAcademicSections(institutionId: string) {
  return useQuery(academicQueries.sections(institutionId));
}

// ─────────────────────────────────────────────────────────────────────────────
// REMINDER RULES
// ─────────────────────────────────────────────────────────────────────────────
export function useReminderRules(institutionId: string) {
  return useQuery(reminderRulesQueries.get(institutionId));
}

export function useUpdateReminderRules() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ institutionId, rules }: {
      institutionId: string;
      rules: {
        weeklyReminderEnabled: boolean;
        nearDeadlineDays: number;
        finalDayAlertEnabled: boolean;
        overduePenaltyNotice: boolean;
      };
    }) => reminderRulesMutations.upsert(institutionId, rules),
    onSuccess: (_, vars) => {
      void qc.invalidateQueries({ queryKey: ['reminder-rules', vars.institutionId] });
      toast.success('Reminder rules updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT LOGS
// ─────────────────────────────────────────────────────────────────────────────
export function useImportLogs(institutionId: string) {
  return useQuery(importLogQueries.list(institutionId));
}
