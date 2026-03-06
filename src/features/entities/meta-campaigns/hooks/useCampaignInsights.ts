import { useQuery } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';
import type { InsightsParams } from '../types/meta.types';

export const useCampaignInsights = (campaignId: string | null, params?: InsightsParams) => {
  return useQuery({
    queryKey: ['metaCampaignInsights', campaignId, params],
    queryFn: () => metaApi.getCampaignInsights(campaignId!, params),
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 5
  });
};
