import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAddOns, getAddOnsByItemId } from '@shared/services';
import { AddOn } from 'src/types/index';

export const useAddOns = (itemId?: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: itemId ? ['addOns', 'item', itemId] : ['addOns'],
    staleTime: 5 * 60 * 1000,
    queryFn: () => (itemId ? getAddOnsByItemId(itemId) : getAddOns()),
    placeholderData: keepPreviousData,
    initialData: () => queryClient.getQueryData<AddOn[]>(itemId ? ['addOns', 'item', itemId] : ['addOns']),
    enabled: itemId ? !!itemId : true
  });

  return { data, isLoading, error, refetch };
};

