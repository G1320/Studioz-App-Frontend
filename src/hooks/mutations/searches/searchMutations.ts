import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { searchItems, searchStudios, searchUsers } from '@services/search-service';
import { SearchResult } from '@models/index'; // Assuming all models are imported
import { useErrorHandling } from '@hooks/index';
import { useSearchContext } from '@contexts/searchContext';

export const useSearchItemsMutation = () => {
  const { setSearchResults } = useSearchContext();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<SearchResult[], Error, string>({
    mutationFn: async (searchTerm: string) => {
      try {
        const data = await searchItems(searchTerm);
        // Cache the fetched data
        queryClient.setQueryData(['items', searchTerm], data);
        return data;
      } catch (error) {
        handleError(error);
        throw error; // Rethrow error to be handled by onError
      }
    },
    onSuccess: (data, searchTerm) => {
      setSearchResults(data);
      toast.success(`Found ${data.length} results for items with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching items: ${error.message}`);
    }
  });
};

export const useSearchStudiosMutation = () => {
  const { setSearchResults } = useSearchContext();

  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<SearchResult[], Error, string>({
    mutationFn: async (searchTerm: string) => {
      try {
        const data = await searchStudios(searchTerm);
        // Cache the fetched data
        queryClient.setQueryData(['studios', searchTerm], data);
        return data;
      } catch (error) {
        handleError(error);
        throw error; // Rethrow error to be handled by onError
      }
    },
    onSuccess: (data, searchTerm) => {
      setSearchResults(data);
      toast.success(`Found ${data.length} results for studios with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching studios: ${error.message}`);
    }
  });
};

export const useSearchUsersMutation = () => {
  const { setSearchResults } = useSearchContext();

  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<SearchResult[], Error, string>({
    mutationFn: async (searchTerm: string) => {
      try {
        const data = await searchUsers(searchTerm);
        // Cache the fetched data
        queryClient.setQueryData(['users', searchTerm], data);
        return data;
      } catch (error) {
        handleError(error);
        throw error; // Rethrow error to be handled by onError
      }
    },
    onSuccess: (data, searchTerm) => {
      setSearchResults(data);
      toast.success(`Found ${data.length} results for users with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching users: ${error.message}`);
    }
  });
};
