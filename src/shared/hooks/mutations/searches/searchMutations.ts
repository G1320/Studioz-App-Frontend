import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { searchItems, searchStudios, searchStudiosAndItems, searchUsers } from '@shared/services';
import { SearchResult, StudiosAndItemsSearchResults } from 'src/types/index';
import { useErrorHandling } from '@shared/hooks';
import { useSearchContext } from '@core/contexts';
import { setLocalSearchResults } from '@shared/services';

export const useSearchStudiosAndItemsMutation = () => {
  const { setSearchResults } = useSearchContext();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<StudiosAndItemsSearchResults, Error, string>({
    mutationFn: async (searchTerm: string) => {
      try {
        const data = await searchStudiosAndItems(searchTerm);
        // Cache the fetched data
        queryClient.setQueryData(['items', searchTerm], data);
        queryClient.setQueryData(['studios', searchTerm], data);
        return data;
      } catch (error) {
        handleError(error);
        throw error; // Rethrow error to be handled by onError
      }
    },
    onSuccess: (data, searchTerm) => {
      setSearchResults(data);
      setLocalSearchResults(data);
      if (data.items.length === 0 && data.studios.length === 0) {
        toast.error(`No results found for items or studios with "${searchTerm}"`);
        return;
      }
      //   toast.success(`Found ${data.studios.length + data.items.length} results for items with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching: ${error.message}`);
    }
  });
};

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
        throw error;
      }
    },
    onSuccess: (data, searchTerm) => {
      setSearchResults(data);
      setLocalSearchResults(data);
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
      setLocalSearchResults(data);

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
      setLocalSearchResults(data);

      toast.success(`Found ${data.length} results for users with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching users: ${error.message}`);
    }
  });
};
