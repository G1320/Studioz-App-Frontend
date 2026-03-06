import { useQuery } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';

export const useCampaigns = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ['metaCampaigns', params?.status],
    queryFn: () => metaApi.getCampaigns(params),
    staleTime: 1000 * 60 * 2
  });
};

export const useCampaign = (id: string | null) => {
  return useQuery({
    queryKey: ['metaCampaign', id],
    queryFn: () => metaApi.getCampaignById(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 2
  });
};
