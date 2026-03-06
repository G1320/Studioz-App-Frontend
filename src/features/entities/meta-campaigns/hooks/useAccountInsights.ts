import { useQuery } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';
import type { InsightsParams } from '../types/meta.types';

export const useAccountInsights = (params?: InsightsParams) => {
  return useQuery({
    queryKey: ['metaAccountInsights', params],
    queryFn: () => metaApi.getAccountInsights(params),
    staleTime: 1000 * 60 * 5
  });
};
