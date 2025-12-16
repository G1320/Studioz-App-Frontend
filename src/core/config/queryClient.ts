import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration
 * Centralized configuration for all queries
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes default
      gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
      retry: 2,
      refetchOnWindowFocus: false // Don't refetch on tab focus
    }
  }
});

