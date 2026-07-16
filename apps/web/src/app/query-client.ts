import { QueryClient } from '@tanstack/react-query';

/**
 * Single shared QueryClient for the whole app. `retry: false` is
 * deliberate for now: with only auth mutations in play (no GET queries
 * yet), automatic retries would just resend failed login/register
 * attempts silently — the opposite of what a user submitting a form
 * wants. Revisit per-query once the first real `useQuery` (not
 * `useMutation`) call is added.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false, refetchOnWindowFocus: false },
    mutations: { retry: false },
  },
});
