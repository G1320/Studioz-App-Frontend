import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getItems } from '@shared/services';
import { Item } from 'src/types/index';

/**
 * Hook to fetch all items
 * 
 * Strategy: Show cached data instantly, refetch in background
 * - staleTime: 30 seconds - cached data shown but considered stale quickly
 * - This ensures we always fetch fresh data on app load while showing cached UI
 * - gcTime: 1 hour - keep in memory for fast navigation
 */
export const useItems = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['items'],
    queryFn: () => getItems(),
    
    // Short stale time ensures fresh data is fetched on every visit
    // Cached data shows instantly, fresh data updates seamlessly
    staleTime: 30 * 1000, // 30 seconds - almost always refetch in background
    
    // Keep cached data for fast navigation between pages
    gcTime: 60 * 60 * 1000, // 1 hour
    
    // Show previous data while fetching new data (no loading flicker)
    placeholderData: keepPreviousData,
    
    // Use any existing cache as initial data for instant render
    initialData: () => queryClient.getQueryData<Item[]>(['items'])
  });

  return { 
    data, 
    isLoading, // True only on initial load with no cache
    isFetching, // True when refetching in background
    error, 
    refetch 
  };
};
