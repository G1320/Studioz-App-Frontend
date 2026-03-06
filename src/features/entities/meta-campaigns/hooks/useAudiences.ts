import { useQuery } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';

export const useAudiences = () => {
  return useQuery({
    queryKey: ['metaAudiences'],
    queryFn: () => metaApi.getAudiences(),
    staleTime: 1000 * 60 * 5
  });
};

export const useAudience = (id: string | null) => {
  return useQuery({
    queryKey: ['metaAudience', id],
    queryFn: () => metaApi.getAudienceById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5
  });
};
