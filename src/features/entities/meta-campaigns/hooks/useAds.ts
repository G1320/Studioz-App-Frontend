import { useQuery } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';

export const useAds = (adSetId: string | null) => {
  return useQuery({
    queryKey: ['metaAds', adSetId],
    queryFn: () => metaApi.getAds(adSetId!),
    enabled: !!adSetId,
    staleTime: 1000 * 60 * 2
  });
};

export const useAd = (id: string | null) => {
  return useQuery({
    queryKey: ['metaAd', id],
    queryFn: () => metaApi.getAdById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2
  });
};
