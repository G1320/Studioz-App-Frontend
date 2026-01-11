import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 *
 * Strategy: "Stale-While-Revalidate"
 * - Show cached data immediately for instant load
 * - Fetch fresh data in background
 * - Update UI seamlessly when fresh data arrives
 *
 * Balance: Fast perceived performance + reasonably fresh data
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Default stale time - data considered stale after 1 minute
      // This triggers background refetch on mount while showing cached data
      staleTime: 1 * 60 * 1000, // 1 minute

      // Keep unused data in memory for 30 minutes before garbage collection
      gcTime: 30 * 60 * 1000, // 30 minutes

      // Retry failed requests twice
      retry: 2,

      // Don't refetch on every window focus (too aggressive)
      // But do refetch if data is stale when window regains focus
      refetchOnWindowFocus: 'always', // Will only refetch if stale

      // Refetch when network reconnects (user was offline)
      refetchOnReconnect: true,

      // Always refetch on mount if data is stale
      refetchOnMount: true
    }
  }
});
