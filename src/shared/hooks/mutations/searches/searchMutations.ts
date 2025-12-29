import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { searchItems, searchStudios, searchStudiosAndItems, searchUsers } from '@shared/services';
import { SearchResult, StudiosAndItemsSearchResults } from 'src/types/index';
import { useErrorHandling } from '@shared/hooks';
import { useSearchContext } from '@core/contexts';
import { setLocalSearchResults } from '@shared/services';
import { useTranslation } from 'react-i18next';

export const useSearchStudiosAndItemsMutation = () => {
  const { setSearchResults } = useSearchContext();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

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
        toast.error(t('toasts.error.noSearchResults', { term: searchTerm }));
        return;
      }
    },
    onError: (error) => {
      toast.error(t('toasts.error.searchFailed', { message: error.message }));
    }
  });
};

export const useSearchItemsMutation = () => {
  const { setSearchResults } = useSearchContext();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

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
      toast.success(t('toasts.success.searchResults', { count: data.length, term: searchTerm }));
    },
    onError: (error) => {
      toast.error(t('toasts.error.searchFailed', { message: error.message }));
    }
  });
};

export const useSearchStudiosMutation = () => {
  const { setSearchResults } = useSearchContext();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

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
      toast.success(t('toasts.success.searchResults', { count: data.length, term: searchTerm }));
    },
    onError: (error) => {
      toast.error(t('toasts.error.searchFailed', { message: error.message }));
    }
  });
};

export const useSearchUsersMutation = () => {
  const { setSearchResults } = useSearchContext();
  const handleError = useErrorHandling();
  const queryClient = useQueryClient();
  const { t } = useTranslation('common');

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
      toast.success(t('toasts.success.searchResults', { count: data.length, term: searchTerm }));
    },
    onError: (error) => {
      toast.error(t('toasts.error.searchFailed', { message: error.message }));
    }
  });
};
