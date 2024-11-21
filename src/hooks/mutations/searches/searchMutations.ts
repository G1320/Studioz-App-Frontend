import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { searchItems, searchStudios, searchUsers } from '@services/search-service';
import { Item, Studio, User } from '@models/index'; // Assuming all models are imported
import { useErrorHandling } from '@hooks/index';

export const useSearchItemsMutation = () => {
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<Item[], Error, string>({
    mutationFn: async (searchTerm: string) => {
      // Check if data is already cached
      const cachedData = queryClient.getQueryData<Item[]>(['items', searchTerm]);
      if (cachedData) {
        return cachedData; // Return cached data if it exists
      }

      // Otherwise, fetch data from the API
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
      toast.success(`Found ${data.length} results for items with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching items: ${error.message}`);
    }
  });
};

export const useSearchStudiosMutation = () => {
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<Studio[], Error, string>({
    mutationFn: async (searchTerm: string) => {
      // Check if data is already cached
      const cachedData = queryClient.getQueryData<Studio[]>(['studios', searchTerm]);
      if (cachedData) {
        return cachedData; // Return cached data if it exists
      }

      // Otherwise, fetch data from the API
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
      toast.success(`Found ${data.length} results for studios with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching studios: ${error.message}`);
    }
  });
};

export const useSearchUsersMutation = () => {
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();

  return useMutation<User[], Error, string>({
    mutationFn: async (searchTerm: string) => {
      // Check if data is already cached
      const cachedData = queryClient.getQueryData<User[]>(['users', searchTerm]);
      if (cachedData) {
        return cachedData; // Return cached data if it exists
      }

      // Otherwise, fetch data from the API
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
      toast.success(`Found ${data.length} results for users with "${searchTerm}"`);
    },
    onError: (error) => {
      toast.error(`Error occurred while searching users: ${error.message}`);
    }
  });
};
