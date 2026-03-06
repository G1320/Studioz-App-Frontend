import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as metaApi from '../services/metaService';
import type {
  CreateCampaignPayload,
  CreateAdSetPayload,
  CreateAdPayload,
  CreateAudiencePayload
} from '../types/meta.types';

export const useCreateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignPayload) => metaApi.createCampaign(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaCampaigns'] }); }
  });
};

export const useUpdateCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCampaignPayload> }) =>
      metaApi.updateCampaign(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['metaCampaigns'] });
      qc.invalidateQueries({ queryKey: ['metaCampaign'] });
    }
  });
};

export const useUpdateCampaignStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      metaApi.updateCampaignStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaCampaigns'] }); }
  });
};

export const useDeleteCampaign = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => metaApi.deleteCampaign(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaCampaigns'] }); }
  });
};

export const useCreateAdSet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdSetPayload) => metaApi.createAdSet(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAdSets'] }); }
  });
};

export const useUpdateAdSetStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      metaApi.updateAdSetStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAdSets'] }); }
  });
};

export const useCreateAd = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdPayload) => metaApi.createAd(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAds'] }); }
  });
};

export const useUpdateAdStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      metaApi.updateAdStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAds'] }); }
  });
};

export const useCreateAudience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAudiencePayload) => metaApi.createAudience(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAudiences'] }); }
  });
};

export const useDeleteAudience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => metaApi.deleteAudience(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['metaAudiences'] }); }
  });
};
