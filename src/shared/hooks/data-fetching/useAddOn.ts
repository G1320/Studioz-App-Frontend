import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAddOnById } from '@shared/services';
import { AddOn } from 'src/types/index';

export const useAddOn = (addOnId: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['addOn', addOnId],
    staleTime: 5 * 60 * 1000,
    queryFn: () => getAddOnById(addOnId),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<AddOn>(['addOn', addOnId]),
    enabled: !!addOnId
  });

  return { data, isLoading, error, refetch };
};

