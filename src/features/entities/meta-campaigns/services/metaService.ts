import { httpService } from '@shared/services/http-service';
import type {
  MetaCampaign,
  MetaAdSet,
  MetaAd,
  MetaAudience,
  MetaInsight,
  MetaAdImage,
  MetaAdVideo,
  CreateCampaignPayload,
  CreateAdSetPayload,
  CreateAdPayload,
  CreateAudiencePayload,
  InsightsParams
} from '../types/meta.types';

const BASE = '/meta';

// --- Campaigns ---

export const getCampaigns = (params?: { status?: string; limit?: number }) =>
  httpService.get<MetaCampaign[]>(`${BASE}/campaigns`, params);

export const getCampaignById = (id: string) =>
  httpService.get<MetaCampaign>(`${BASE}/campaigns/${id}`);

export const createCampaign = (data: CreateCampaignPayload) =>
  httpService.post<MetaCampaign>(`${BASE}/campaigns`, data);

export const updateCampaign = (id: string, data: Partial<CreateCampaignPayload>) =>
  httpService.put<MetaCampaign>(`${BASE}/campaigns/${id}`, data);

export const updateCampaignStatus = (id: string, status: string) =>
  httpService.patch<MetaCampaign>(`${BASE}/campaigns/${id}/status`, { status });

export const deleteCampaign = (id: string) =>
  httpService.delete<void>(`${BASE}/campaigns/${id}`);

// --- Ad Sets ---

export const getAdSets = (campaignId: string) =>
  httpService.get<MetaAdSet[]>(`${BASE}/campaigns/${campaignId}/adsets`);

export const getAdSetById = (id: string) =>
  httpService.get<MetaAdSet>(`${BASE}/adsets/${id}`);

export const createAdSet = (data: CreateAdSetPayload) =>
  httpService.post<MetaAdSet>(`${BASE}/adsets`, data);

export const updateAdSet = (id: string, data: Partial<CreateAdSetPayload>) =>
  httpService.put<MetaAdSet>(`${BASE}/adsets/${id}`, data);

export const updateAdSetStatus = (id: string, status: string) =>
  httpService.patch<MetaAdSet>(`${BASE}/adsets/${id}/status`, { status });

// --- Ads ---

export const getAds = (adSetId: string) =>
  httpService.get<MetaAd[]>(`${BASE}/adsets/${adSetId}/ads`);

export const getAdById = (id: string) =>
  httpService.get<MetaAd>(`${BASE}/ads/${id}`);

export const createAd = (data: CreateAdPayload) =>
  httpService.post<MetaAd>(`${BASE}/ads`, data);

export const updateAd = (id: string, data: Partial<CreateAdPayload>) =>
  httpService.put<MetaAd>(`${BASE}/ads/${id}`, data);

export const updateAdStatus = (id: string, status: string) =>
  httpService.patch<MetaAd>(`${BASE}/ads/${id}/status`, { status });

// --- Creatives & Media ---

export const getAdImages = () =>
  httpService.get<MetaAdImage[]>(`${BASE}/media/images`);

export const getAdVideos = () =>
  httpService.get<MetaAdVideo[]>(`${BASE}/media/videos`);

export const uploadImage = (filePath: string, fileName: string) =>
  httpService.post<MetaAdImage>(`${BASE}/media/upload-image`, { filePath, fileName });

export const uploadVideo = (filePath: string, title: string) =>
  httpService.post<MetaAdVideo>(`${BASE}/media/upload-video`, { filePath, title });

export const createCreative = (data: Record<string, unknown>) =>
  httpService.post<Record<string, unknown>>(`${BASE}/creatives`, data);

// --- Audiences ---

export const getAudiences = () =>
  httpService.get<MetaAudience[]>(`${BASE}/audiences`);

export const getAudienceById = (id: string) =>
  httpService.get<MetaAudience>(`${BASE}/audiences/${id}`);

export const createAudience = (data: CreateAudiencePayload) =>
  httpService.post<MetaAudience>(`${BASE}/audiences`, data);

export const updateAudience = (id: string, data: Partial<CreateAudiencePayload>) =>
  httpService.put<MetaAudience>(`${BASE}/audiences/${id}`, data);

export const deleteAudience = (id: string) =>
  httpService.delete<void>(`${BASE}/audiences/${id}`);

// --- Insights ---

export const getAccountInsights = (params?: InsightsParams) =>
  httpService.get<MetaInsight[]>(`${BASE}/insights/account`, params);

export const getCampaignInsights = (id: string, params?: InsightsParams) =>
  httpService.get<MetaInsight[]>(`${BASE}/insights/campaigns/${id}`, params);

export const getAdSetInsights = (id: string, params?: InsightsParams) =>
  httpService.get<MetaInsight[]>(`${BASE}/insights/adsets/${id}`, params);

export const getAdInsights = (id: string, params?: InsightsParams) =>
  httpService.get<MetaInsight[]>(`${BASE}/insights/ads/${id}`, params);
