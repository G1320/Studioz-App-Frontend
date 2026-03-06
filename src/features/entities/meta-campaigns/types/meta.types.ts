// ---------------------------------------------------------------------------
// Campaign
// ---------------------------------------------------------------------------

export type CampaignObjective =
  | 'OUTCOME_AWARENESS'
  | 'OUTCOME_TRAFFIC'
  | 'OUTCOME_ENGAGEMENT'
  | 'OUTCOME_LEADS'
  | 'OUTCOME_APP_PROMOTION'
  | 'OUTCOME_SALES';

export type CampaignStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
export type EffectiveStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED' | 'DELETED' | 'IN_PROCESS' | 'WITH_ISSUES' | 'CAMPAIGN_PAUSED' | 'ADSET_PAUSED';

export interface MetaCampaign {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  effective_status: EffectiveStatus;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  start_time?: string;
  stop_time?: string;
  created_time: string;
  updated_time: string;
  bid_strategy?: string;
  special_ad_categories: string[];
  buying_type?: string;
}

export interface CreateCampaignPayload {
  name: string;
  objective: CampaignObjective;
  status?: CampaignStatus;
  special_ad_categories?: string[];
  daily_budget?: number;
  lifetime_budget?: number;
  bid_strategy?: string;
}

// ---------------------------------------------------------------------------
// Ad Set
// ---------------------------------------------------------------------------

export interface MetaAdSet {
  id: string;
  name: string;
  campaign_id: string;
  status: CampaignStatus;
  effective_status: EffectiveStatus;
  daily_budget?: string;
  lifetime_budget?: string;
  bid_amount?: string;
  bid_strategy?: string;
  billing_event: string;
  optimization_goal: string;
  targeting: MetaTargeting;
  start_time?: string;
  end_time?: string;
  created_time: string;
  updated_time: string;
}

export interface CreateAdSetPayload {
  name: string;
  campaign_id: string;
  daily_budget?: number;
  lifetime_budget?: number;
  bid_amount?: number;
  billing_event: string;
  optimization_goal: string;
  targeting: MetaTargeting;
  start_time?: string;
  end_time?: string;
  status?: CampaignStatus;
  promoted_object?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Ad
// ---------------------------------------------------------------------------

export interface MetaAd {
  id: string;
  name: string;
  adset_id: string;
  campaign_id: string;
  status: CampaignStatus;
  effective_status: EffectiveStatus;
  creative?: { id: string };
  created_time: string;
  updated_time: string;
  tracking_specs?: Record<string, unknown>[];
}

export interface CreateAdPayload {
  name: string;
  adset_id: string;
  creative: { creative_id: string } | Record<string, unknown>;
  status?: CampaignStatus;
  tracking_specs?: Record<string, unknown>[];
}

// ---------------------------------------------------------------------------
// Targeting
// ---------------------------------------------------------------------------

export interface MetaTargeting {
  geo_locations?: {
    countries?: string[];
    regions?: { key: string }[];
    cities?: { key: string; radius?: number; distance_unit?: string }[];
  };
  age_min?: number;
  age_max?: number;
  genders?: number[]; // 1=male, 2=female
  interests?: { id: string; name: string }[];
  behaviors?: { id: string; name: string }[];
  custom_audiences?: { id: string; name?: string }[];
  excluded_custom_audiences?: { id: string; name?: string }[];
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
  device_platforms?: string[];
  flexible_spec?: Record<string, unknown>[];
  exclusions?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Audience
// ---------------------------------------------------------------------------

export interface MetaAudience {
  id: string;
  name: string;
  subtype: string;
  description?: string;
  approximate_count?: number;
  delivery_status?: { status: string };
  operation_status?: { status: number; description: string };
  time_created?: string;
  time_updated?: string;
  lookalike_spec?: Record<string, unknown>;
  rule?: Record<string, unknown>;
}

export interface CreateAudiencePayload {
  name: string;
  subtype: 'CUSTOM' | 'LOOKALIKE' | 'WEBSITE';
  description?: string;
  customer_file_source?: string;
  rule?: Record<string, unknown>;
  lookalike_spec?: Record<string, unknown>;
  origin_audience_id?: string;
}

// ---------------------------------------------------------------------------
// Insights
// ---------------------------------------------------------------------------

export interface MetaInsight {
  campaign_name?: string;
  campaign_id?: string;
  adset_name?: string;
  adset_id?: string;
  ad_name?: string;
  ad_id?: string;
  impressions: string;
  reach?: string;
  clicks?: string;
  cpc?: string;
  cpm?: string;
  ctr?: string;
  spend: string;
  actions?: MetaAction[];
  cost_per_action_type?: MetaAction[];
  conversions?: MetaAction[];
  conversion_values?: MetaAction[];
  frequency?: string;
  date_start: string;
  date_stop: string;
}

export interface MetaAction {
  action_type: string;
  value: string;
}

export interface InsightsParams {
  since?: string;
  until?: string;
  date_preset?: string;
  breakdowns?: string;
  level?: string;
}

// ---------------------------------------------------------------------------
// Media
// ---------------------------------------------------------------------------

export interface MetaAdImage {
  id: string;
  name: string;
  hash: string;
  url: string;
  url_128?: string;
  width?: number;
  height?: number;
  created_time?: string;
}

export interface MetaAdVideo {
  id: string;
  title: string;
  source?: string;
  picture?: string;
  length?: number;
  created_time?: string;
  updated_time?: string;
}

// ---------------------------------------------------------------------------
// Wizard state
// ---------------------------------------------------------------------------

export interface CampaignWizardState {
  // Step 1: Objective
  objective: CampaignObjective;
  campaignName: string;
  // Step 2: Ad Set
  adSetName: string;
  budgetType: 'daily' | 'lifetime';
  budget: number;
  startDate: string;
  endDate: string;
  placements: 'automatic' | 'manual';
  manualPlacements: string[];
  // Step 3: Audience
  targeting: MetaTargeting;
  // Step 4: Creative
  mediaType: 'image' | 'video' | 'remotion';
  mediaUrl: string;
  mediaId: string;
  headline: string;
  primaryText: string;
  description: string;
  ctaType: string;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
}

// ---------------------------------------------------------------------------
// Tab types
// ---------------------------------------------------------------------------

export type MetaCampaignsTab = 'overview' | 'campaigns' | 'audiences' | 'analytics';
