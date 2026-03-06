import { useQuery } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';

export const useAdSets = (campaignId: string | null) => {
  return useQuery({
    queryKey: ['metaAdSets', campaignId],
    queryFn: () => metaApi.getAdSets(campaignId!),
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 2
  });
};

export const useAdSet = (id: string | null) => {
  return useQuery({
    queryKey: ['metaAdSet', id],
    queryFn: () => metaApi.getAdSetById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2
  });
};
