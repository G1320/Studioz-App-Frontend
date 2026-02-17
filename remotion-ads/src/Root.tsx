import React from 'react';
import { Composition, Still } from 'remotion';
import { Ad1_BookYourSession } from './ads/Ad1_BookYourSession';
import { Ad2_StudioOwnersDream } from './ads/Ad2_StudioOwnersDream';
import { Ad3_TheStudiozEffect } from './ads/Ad3_TheStudiozEffect';
import { Ad4_BookingFlow } from './ads/Ad4_BookingFlow';
import { Ad5_Categories } from './ads/Ad5_Categories';
import { Ad6_GoogleRanking } from './ads/Ad6_GoogleRanking';
import { Ad7_RemoteProjects } from './ads/Ad7_RemoteProjects';
import { Ad8_PricingTiers } from './ads/Ad8_PricingTiers';
import { Ad9_BeforeAfter } from './ads/Ad9_BeforeAfter';
import { Ad10_AutomationMagic } from './ads/Ad10_AutomationMagic';
import { Ad11_DarkLightShowcase } from './ads/Ad11_DarkLightShowcase';
import { Ad12_InstantBooking } from './ads/Ad12_InstantBooking';
import { Ad13_FeatureCollage } from './ads/Ad13_FeatureCollage';
import { Ad14_NoCalls } from './ads/Ad14_NoCalls';
import { Ad15_NoShowProtection } from './ads/Ad15_NoShowProtection';
import { Ad16_CalendarSync } from './ads/Ad16_CalendarSync';
import { Ad17_StudioHero } from './ads/Ad17_StudioHero';
import { Ad18_SocialProof } from './ads/Ad18_SocialProof';
import { Ad19_EarlyBirdDiscount } from './ads/Ad19_EarlyBirdDiscount';
import { Ad20_MultiLocation } from './ads/Ad20_MultiLocation';
import { Ad21_ClientReviews } from './ads/Ad21_ClientReviews';
import { Ad22_EquipmentList } from './ads/Ad22_EquipmentList';
import { Ad23_PaymentSecure } from './ads/Ad23_PaymentSecure';
import { Ad24_StudioAnalytics } from './ads/Ad24_StudioAnalytics';
import { Ad25_MobileFirst } from './ads/Ad25_MobileFirst';
import { Ad26_CustomBranding } from './ads/Ad26_CustomBranding';
import { Ad27_TeamManagement } from './ads/Ad27_TeamManagement';
import { Ad28_WaitlistFeature } from './ads/Ad28_WaitlistFeature';
import { Ad29_RecurringBookings } from './ads/Ad29_RecurringBookings';
import { Ad30_ClientCRM } from './ads/Ad30_ClientCRM';
import { Ad31_SmartNotifications } from './ads/Ad31_SmartNotifications';
import { Ad32_RevenueGrowth } from './ads/Ad32_RevenueGrowth';
import { Ad33_StudioComparison } from './ads/Ad33_StudioComparison';
import { Ad34_InstantSetup } from './ads/Ad34_InstantSetup';
import { Ad35_LiveAvailability } from './ads/Ad35_LiveAvailability';
import { Ad36_ProPhotographers } from './ads/Ad36_ProPhotographers';
import { Ad37_MusicProducers } from './ads/Ad37_MusicProducers';
import { Ad38_PodcastStudios } from './ads/Ad38_PodcastStudios';
import { Ad39_ContentCreators } from './ads/Ad39_ContentCreators';
import { Ad40_DanceStudios } from './ads/Ad40_DanceStudios';
import { Ad41_ArtStudios } from './ads/Ad41_ArtStudios';
import { Ad42_FitnessStudios } from './ads/Ad42_FitnessStudios';
import { Ad43_CancelProtection } from './ads/Ad43_CancelProtection';
import { Ad44_GroupBooking } from './ads/Ad44_GroupBooking';
import { Ad45_StudioPortfolio } from './ads/Ad45_StudioPortfolio';
import { Ad46_QuickOnboarding } from './ads/Ad46_QuickOnboarding';
import { Ad47_ClientRetention } from './ads/Ad47_ClientRetention';
import { Ad48_WeekendWarrior } from './ads/Ad48_WeekendWarrior';
import { Ad49_NightOwl } from './ads/Ad49_NightOwl';
import { Ad50_SplitPayment } from './ads/Ad50_SplitPayment';
import { Ad51_StudioNetwork } from './ads/Ad51_StudioNetwork';
import { Ad52_TimeIsMoney } from './ads/Ad52_TimeIsMoney';
import { Ad53_FinalCTA } from './ads/Ad53_FinalCTA';
import { Ad54_BuiltByOwners } from './ads/Ad54_BuiltByOwners';
import { Ad55_DashboardInAction } from './ads/Ad55_DashboardInAction';
import { Ad56_BookingDemo } from './ads/Ad56_BookingDemo';
import { Ad57_ProductLaunch4K } from './ads/Ad57_ProductLaunch4K';
import { Ad58_ProductLaunchV2 } from './ads/Ad58_ProductLaunchV2';
// ── V2 Ads ──
import { Ad1_BookYourSession_V2 } from './ads-v2/Ad1_BookYourSession_V2';
import { Ad2_StudioOwnersDream_V2 } from './ads-v2/Ad2_StudioOwnersDream_V2';
import { Ad3_TheStudiozEffect_V2 } from './ads-v2/Ad3_TheStudiozEffect_V2';
import { Ad4_BookingFlow_V2 } from './ads-v2/Ad4_BookingFlow_V2';
import { Ad5_Categories_V2 } from './ads-v2/Ad5_Categories_V2';
import { Ad6_GoogleRanking_V2 } from './ads-v2/Ad6_GoogleRanking_V2';
import { Ad7_RemoteProjects_V2 } from './ads-v2/Ad7_RemoteProjects_V2';
import { Ad8_PricingTiers_V2 } from './ads-v2/Ad8_PricingTiers_V2';
import { Ad9_BeforeAfter_V2 } from './ads-v2/Ad9_BeforeAfter_V2';
import { Ad10_AutomationMagic_V2 } from './ads-v2/Ad10_AutomationMagic_V2';
import { Ad11_DarkLightShowcase_V2 } from './ads-v2/Ad11_DarkLightShowcase_V2';
import { Ad12_InstantBooking_V2 } from './ads-v2/Ad12_InstantBooking_V2';
import { Ad13_FeatureCollage_V2 } from './ads-v2/Ad13_FeatureCollage_V2';
import { Ad14_NoCalls_V2 } from './ads-v2/Ad14_NoCalls_V2';
import { Ad15_NoShowProtection_V2 } from './ads-v2/Ad15_NoShowProtection_V2';
import { Ad16_CalendarSync_V2 } from './ads-v2/Ad16_CalendarSync_V2';
import { Ad17_StudioHero_V2 } from './ads-v2/Ad17_StudioHero_V2';
import { Ad18_SocialProof_V2 } from './ads-v2/Ad18_SocialProof_V2';
import { Ad19_EarlyBirdDiscount_V2 } from './ads-v2/Ad19_EarlyBirdDiscount_V2';
import { Ad20_MultiLocation_V2 } from './ads-v2/Ad20_MultiLocation_V2';
import { Ad21_PaymentMethods_V2 } from './ads-v2/Ad21_PaymentMethods_V2';
import { Ad22_InvoiceGenerator_V2 } from './ads-v2/Ad22_InvoiceGenerator_V2';
import { Ad23_PaymentSecure_V2 } from './ads-v2/Ad23_PaymentSecure_V2';
import { Ad24_StudioAnalytics_V2 } from './ads-v2/Ad24_StudioAnalytics_V2';
import { Ad25_MobileFirst_V2 } from './ads-v2/Ad25_MobileFirst_V2';
import { Ad26_CustomBranding_V2 } from './ads-v2/Ad26_CustomBranding_V2';
import { Ad27_TeamManagement_V2 } from './ads-v2/Ad27_TeamManagement_V2';
import { Ad28_WaitlistFeature_V2 } from './ads-v2/Ad28_WaitlistFeature_V2';
import { Ad29_RecurringBookings_V2 } from './ads-v2/Ad29_RecurringBookings_V2';
import { Ad30_ClientCRM_V2 } from './ads-v2/Ad30_ClientCRM_V2';
import { Ad31_SmartNotifications_V2 } from './ads-v2/Ad31_SmartNotifications_V2';
import { Ad32_RevenueGrowth_V2 } from './ads-v2/Ad32_RevenueGrowth_V2';
import { Ad33_StudioComparison_V2 } from './ads-v2/Ad33_StudioComparison_V2';
import { Ad34_InstantSetup_V2 } from './ads-v2/Ad34_InstantSetup_V2';
import { Ad35_LiveAvailability_V2 } from './ads-v2/Ad35_LiveAvailability_V2';
import { Ad36_EquipmentList_V2 } from './ads-v2/Ad36_EquipmentList_V2';
import { Ad37_StudioTour_V2 } from './ads-v2/Ad37_StudioTour_V2';
import { Ad38_QuickSetup_V2 } from './ads-v2/Ad38_QuickSetup_V2';
import { Ad39_Support247_V2 } from './ads-v2/Ad39_Support247_V2';
import { Ad40_StudioSpotlight_V2 } from './ads-v2/Ad40_StudioSpotlight_V2';
import { Ad41_ReferralProgram_V2 } from './ads-v2/Ad41_ReferralProgram_V2';
import { Ad42_SuccessStories_V2 } from './ads-v2/Ad42_SuccessStories_V2';
import { Ad43_PlatformStats_V2 } from './ads-v2/Ad43_PlatformStats_V2';
import { Ad44_StudioComparison2_V2 } from './ads-v2/Ad44_StudioComparison2_V2';
import { Ad45_MobileApp_V2 } from './ads-v2/Ad45_MobileApp_V2';
import { Ad46_Community_V2 } from './ads-v2/Ad46_Community_V2';
import { Ad47_TimeSavings_V2 } from './ads-v2/Ad47_TimeSavings_V2';
import { Ad48_ProfessionalLook_V2 } from './ads-v2/Ad48_ProfessionalLook_V2';
import { Ad49_SmartPricing_V2 } from './ads-v2/Ad49_SmartPricing_V2';
import { Ad50_InstantNotifications_V2 } from './ads-v2/Ad50_InstantNotifications_V2';
import { Ad51_StudioNetwork_V2 } from './ads-v2/Ad51_StudioNetwork_V2';
import { Ad52_TimeIsMoney_V2 } from './ads-v2/Ad52_TimeIsMoney_V2';
import { Ad53_FinalCTA_V2 } from './ads-v2/Ad53_FinalCTA_V2';
import { Ad54_BuiltByOwners_V2 } from './ads-v2/Ad54_BuiltByOwners_V2';
import { Ad55_DashboardDemo_V2 } from './ads-v2/Ad55_DashboardDemo_V2';
import { Ad56_BookingDemo_V2 } from './ads-v2/Ad56_BookingDemo_V2';
import { Ad57_ProductLaunch_V2 } from './ads-v2/Ad57_ProductLaunch_V2';
// ── V3 Ads (B2B Premium — V1 screenshots + V2 polish) ──
import { Ad2_StudioOwnersDream_V3 } from './ads-v3/Ad2_StudioOwnersDream_V3';
import { Ad4_BookingFlow_V3 } from './ads-v3/Ad4_BookingFlow_V3';
import { Ad6_GoogleRanking_V3 } from './ads-v3/Ad6_GoogleRanking_V3';
import { Ad7_RemoteProjects_V3 } from './ads-v3/Ad7_RemoteProjects_V3';
import { Ad8_PricingTiers_V3 } from './ads-v3/Ad8_PricingTiers_V3';
import { Ad9_BeforeAfter_V3 } from './ads-v3/Ad9_BeforeAfter_V3';
import { Ad10_AutomationMagic_V3 } from './ads-v3/Ad10_AutomationMagic_V3';
import { Ad11_DarkLightShowcase_V3 } from './ads-v3/Ad11_DarkLightShowcase_V3';
import { Ad13_FeatureCollage_V3 } from './ads-v3/Ad13_FeatureCollage_V3';
import { Ad14_NoCalls_V3 } from './ads-v3/Ad14_NoCalls_V3';
import { Ad15_NoShowProtection_V3 } from './ads-v3/Ad15_NoShowProtection_V3';
import { Ad16_CalendarSync_V3 } from './ads-v3/Ad16_CalendarSync_V3';
import { Ad19_EarlyBirdDiscount_V3 } from './ads-v3/Ad19_EarlyBirdDiscount_V3';
import { Ad20_MultiLocation_V3 } from './ads-v3/Ad20_MultiLocation_V3';
import { Ad21_PaymentMethods_V3 } from './ads-v3/Ad21_PaymentMethods_V3';
import { Ad22_InvoiceGenerator_V3 } from './ads-v3/Ad22_InvoiceGenerator_V3';
import { Ad23_PaymentSecure_V3 } from './ads-v3/Ad23_PaymentSecure_V3';
import { Ad24_StudioAnalytics_V3 } from './ads-v3/Ad24_StudioAnalytics_V3';
import { Ad25_MobileFirst_V3 } from './ads-v3/Ad25_MobileFirst_V3';
import { Ad26_CustomBranding_V3 } from './ads-v3/Ad26_CustomBranding_V3';
import { Ad27_TeamManagement_V3 } from './ads-v3/Ad27_TeamManagement_V3';
import { Ad28_WaitlistFeature_V3 } from './ads-v3/Ad28_WaitlistFeature_V3';
import { Ad29_RecurringBookings_V3 } from './ads-v3/Ad29_RecurringBookings_V3';
import { Ad30_ClientCRM_V3 } from './ads-v3/Ad30_ClientCRM_V3';
import { Ad31_SmartNotifications_V3 } from './ads-v3/Ad31_SmartNotifications_V3';
import { Ad32_RevenueGrowth_V3 } from './ads-v3/Ad32_RevenueGrowth_V3';
import { Ad33_StudioComparison_V3 } from './ads-v3/Ad33_StudioComparison_V3';
import { Ad34_InstantSetup_V3 } from './ads-v3/Ad34_InstantSetup_V3';
import { Ad35_LiveAvailability_V3 } from './ads-v3/Ad35_LiveAvailability_V3';
import { Ad36_EquipmentList_V3 } from './ads-v3/Ad36_EquipmentList_V3';
import { Ad37_StudioTour_V3 } from './ads-v3/Ad37_StudioTour_V3';
import { Ad38_QuickSetup_V3 } from './ads-v3/Ad38_QuickSetup_V3';
import { Ad39_Support247_V3 } from './ads-v3/Ad39_Support247_V3';
import { Ad40_StudioSpotlight_V3 } from './ads-v3/Ad40_StudioSpotlight_V3';
import { Ad41_ReferralProgram_V3 } from './ads-v3/Ad41_ReferralProgram_V3';
import { Ad42_SuccessStories_V3 } from './ads-v3/Ad42_SuccessStories_V3';
import { Ad44_StudioComparison2_V3 } from './ads-v3/Ad44_StudioComparison2_V3';
import { Ad45_MobileApp_V3 } from './ads-v3/Ad45_MobileApp_V3';
import { Ad46_Community_V3 } from './ads-v3/Ad46_Community_V3';
import { Ad47_TimeSavings_V3 } from './ads-v3/Ad47_TimeSavings_V3';
import { Ad48_ProfessionalLook_V3 } from './ads-v3/Ad48_ProfessionalLook_V3';
import { Ad49_SmartPricing_V3 } from './ads-v3/Ad49_SmartPricing_V3';
import { Ad50_InstantNotifications_V3 } from './ads-v3/Ad50_InstantNotifications_V3';
import { Ad51_StudioNetwork_V3 } from './ads-v3/Ad51_StudioNetwork_V3';
import { Ad52_TimeIsMoney_V3 } from './ads-v3/Ad52_TimeIsMoney_V3';
import { Ad53_FinalCTA_V3 } from './ads-v3/Ad53_FinalCTA_V3';
import { Ad54_BuiltByOwners_V3 } from './ads-v3/Ad54_BuiltByOwners_V3';
import { Ad55_DashboardDemo_V3 } from './ads-v3/Ad55_DashboardDemo_V3';
import { Post1_CancellationPain } from './posts/Post1_CancellationPain';
import { Post2_EmptySlots } from './posts/Post2_EmptySlots';
import { Post3_BookingOutcome } from './posts/Post3_BookingOutcome';
import { Post4_DashboardOutcome } from './posts/Post4_DashboardOutcome';
import { Post5_FounderCredibility } from './posts/Post5_FounderCredibility';
import { Post6_WhyWeBuilt } from './posts/Post6_WhyWeBuilt';
import { Post7_FreeTrial } from './posts/Post7_FreeTrial';
import { Post1_CancellationPain_Light } from './posts/Post1_CancellationPain_Light';
import { Post2_EmptySlots_Light } from './posts/Post2_EmptySlots_Light';
import { Post3_BookingOutcome_Light } from './posts/Post3_BookingOutcome_Light';
import { Post4_DashboardOutcome_Light } from './posts/Post4_DashboardOutcome_Light';
import { Post5_FounderCredibility_Light } from './posts/Post5_FounderCredibility_Light';
import { Post6_WhyWeBuilt_Light } from './posts/Post6_WhyWeBuilt_Light';
import { Post7_FreeTrial_Light } from './posts/Post7_FreeTrial_Light';
import { Post1_CancellationPain_V2 } from './posts-v2/Post1_CancellationPain_V2';
import { Post2_EmptySlots_V2 } from './posts-v2/Post2_EmptySlots_V2';
import { Post3_BookingOutcome_V2 } from './posts-v2/Post3_BookingOutcome_V2';
import { Post4_DashboardOutcome_V2 } from './posts-v2/Post4_DashboardOutcome_V2';
import { Post5_FounderCredibility_V2 } from './posts-v2/Post5_FounderCredibility_V2';
import { Post6_WhyWeBuilt_V2 } from './posts-v2/Post6_WhyWeBuilt_V2';
import { Post7_FreeTrial_V2 } from './posts-v2/Post7_FreeTrial_V2';
import { Post1_CancellationPain_V2_Light } from './posts-v2/Post1_CancellationPain_V2_Light';
import { Post2_EmptySlots_V2_Light } from './posts-v2/Post2_EmptySlots_V2_Light';
import { Post3_BookingOutcome_V2_Light } from './posts-v2/Post3_BookingOutcome_V2_Light';
import { Post4_DashboardOutcome_V2_Light } from './posts-v2/Post4_DashboardOutcome_V2_Light';
import { Post5_FounderCredibility_V2_Light } from './posts-v2/Post5_FounderCredibility_V2_Light';
import { Post6_WhyWeBuilt_V2_Light } from './posts-v2/Post6_WhyWeBuilt_V2_Light';
import { Post7_FreeTrial_V2_Light } from './posts-v2/Post7_FreeTrial_V2_Light';
import { Post8_RevenueDashboard_V2 } from './posts-v2/Post8_RevenueDashboard_V2';
import { Post9_CalendarView_V2 } from './posts-v2/Post9_CalendarView_V2';
import { Post10_LiveActivity_V2 } from './posts-v2/Post10_LiveActivity_V2';
import { Post11_DocumentManagement_V2 } from './posts-v2/Post11_DocumentManagement_V2';
import { Post12_RevenueCharts_V2 } from './posts-v2/Post12_RevenueCharts_V2';
import { Post13_StudioPageShowcase_V2 } from './posts-v2/Post13_StudioPageShowcase_V2';
import { Post14_BookingExperience_V2 } from './posts-v2/Post14_BookingExperience_V2';
import { Post15_GoogleRanking_V2 } from './posts-v2/Post15_GoogleRanking_V2';
import { Post16_BeforeAfter_V2 } from './posts-v2/Post16_BeforeAfter_V2';
import { Post17_NoShowCost_V2 } from './posts-v2/Post17_NoShowCost_V2';
import { Post18_TimeSaved_V2 } from './posts-v2/Post18_TimeSaved_V2';
import { Post19_DailyRoutine_V2 } from './posts-v2/Post19_DailyRoutine_V2';
import { Post21_PlatformStats_V2 } from './posts-v2/Post21_PlatformStats_V2';
import { Post22_QuickSetup_V2 } from './posts-v2/Post22_QuickSetup_V2';
import { Post23_MultiStudio_V2 } from './posts-v2/Post23_MultiStudio_V2';
import { Post24_InvoiceTable_V2 } from './posts-v2/Post24_InvoiceTable_V2';
import { Post25_AvailabilityControl_V2 } from './posts-v2/Post25_AvailabilityControl_V2';
import { Post26_StopStart_V2 } from './posts-v2/Post26_StopStart_V2';
import { Post27_AlwaysOpen_V2 } from './posts-v2/Post27_AlwaysOpen_V2';
// ── V4 Ads (B2B — Lucide icons, real features only, accurate data) ──
import { Ad2_StudioOwnersDream_V4 } from './ads-v4/Ad2_StudioOwnersDream_V4';
import { Ad4_BookingFlow_V4 } from './ads-v4/Ad4_BookingFlow_V4';
import { Ad6_GoogleRanking_V4 } from './ads-v4/Ad6_GoogleRanking_V4';
import { Ad7_RemoteProjects_V4 } from './ads-v4/Ad7_RemoteProjects_V4';
import { Ad8_PricingTiers_V4 } from './ads-v4/Ad8_PricingTiers_V4';
import { Ad9_BeforeAfter_V4 } from './ads-v4/Ad9_BeforeAfter_V4';
import { Ad10_AutomationMagic_V4 } from './ads-v4/Ad10_AutomationMagic_V4';
import { Ad11_DarkLightShowcase_V4 } from './ads-v4/Ad11_DarkLightShowcase_V4';
import { Ad13_FeatureCollage_V4 } from './ads-v4/Ad13_FeatureCollage_V4';
import { Ad14_NoCalls_V4 } from './ads-v4/Ad14_NoCalls_V4';
import { Ad15_NoShowProtection_V4 } from './ads-v4/Ad15_NoShowProtection_V4';
import { Ad16_CalendarSync_V4 } from './ads-v4/Ad16_CalendarSync_V4';
import { Ad19_EarlyBirdDiscount_V4 } from './ads-v4/Ad19_EarlyBirdDiscount_V4';
import { Ad20_MultiLocation_V4 } from './ads-v4/Ad20_MultiLocation_V4';
import { Ad21_PaymentMethods_V4 } from './ads-v4/Ad21_PaymentMethods_V4';
import { Ad22_InvoiceGenerator_V4 } from './ads-v4/Ad22_InvoiceGenerator_V4';
import { Ad23_PaymentSecure_V4 } from './ads-v4/Ad23_PaymentSecure_V4';
import { Ad24_StudioAnalytics_V4 } from './ads-v4/Ad24_StudioAnalytics_V4';
import { Ad25_MobileFirst_V4 } from './ads-v4/Ad25_MobileFirst_V4';
import { Ad26_CustomBranding_V4 } from './ads-v4/Ad26_CustomBranding_V4';
import { Ad27_MultiStudio_V4 } from './ads-v4/Ad27_TeamManagement_V4';
import { Ad28_AvailabilityManagement_V4 } from './ads-v4/Ad28_WaitlistFeature_V4';
import { Ad29_FlexibleBooking_V4 } from './ads-v4/Ad29_RecurringBookings_V4';
import { Ad30_ClientBookingInfo_V4 } from './ads-v4/Ad30_ClientCRM_V4';
import { Ad31_SmartNotifications_V4 } from './ads-v4/Ad31_SmartNotifications_V4';
import { Ad32_RevenueGrowth_V4 } from './ads-v4/Ad32_RevenueGrowth_V4';
import { Ad33_StudioComparison_V4 } from './ads-v4/Ad33_StudioComparison_V4';
import { Ad34_InstantSetup_V4 } from './ads-v4/Ad34_InstantSetup_V4';
import { Ad35_LiveAvailability_V4 } from './ads-v4/Ad35_LiveAvailability_V4';
import { Ad36_EquipmentList_V4 } from './ads-v4/Ad36_EquipmentList_V4';
import { Ad37_StudioGallery_V4 } from './ads-v4/Ad37_StudioGallery_V4';
import { Ad38_QuickSetup_V4 } from './ads-v4/Ad38_QuickSetup_V4';
import { Ad39_Support_V4 } from './ads-v4/Ad39_Support_V4';
import { Ad40_StudioSpotlight_V4 } from './ads-v4/Ad40_StudioSpotlight_V4';
import { Ad41_FreeTrial_V4 } from './ads-v4/Ad41_FreeTrial_V4';
import { Ad42_SuccessStories_V4 } from './ads-v4/Ad42_SuccessStories_V4';
import { Ad44_StudioComparison2_V4 } from './ads-v4/Ad44_StudioComparison2_V4';
import { Ad45_MobileResponsive_V4 } from './ads-v4/Ad45_MobileApp_V4';
import { Ad46_GetDiscovered_V4 } from './ads-v4/Ad46_Community_V4';
import { Ad47_TimeSavings_V4 } from './ads-v4/Ad47_TimeSavings_V4';
import { Ad48_ProfessionalLook_V4 } from './ads-v4/Ad48_ProfessionalLook_V4';
import { Ad49_FlexiblePricing_V4 } from './ads-v4/Ad49_SmartPricing_V4';
import { Ad50_Notifications_V4 } from './ads-v4/Ad50_InstantNotifications_V4';
import { Ad51_StudioNetwork_V4 } from './ads-v4/Ad51_StudioNetwork_V4';
import { Ad52_TimeIsMoney_V4 } from './ads-v4/Ad52_TimeIsMoney_V4';
import { Ad53_FinalCTA_V4 } from './ads-v4/Ad53_FinalCTA_V4';
import { Ad54_BuiltByOwners_V4 } from './ads-v4/Ad54_BuiltByOwners_V4';
import { Ad55_DashboardDemo_V4 } from './ads-v4/Ad55_DashboardDemo_V4';
// ── V5 Ads (B2B — new dashboard screenshots per feature tab) ──
import { Ad2_StudioOwnersDream_V5 } from './ads-v5/Ad2_StudioOwnersDream_V5';
import { Ad4_BookingFlow_V5 } from './ads-v5/Ad4_BookingFlow_V5';
import { Ad6_GoogleRanking_V5 } from './ads-v5/Ad6_GoogleRanking_V5';
import { Ad7_RemoteProjects_V5 } from './ads-v5/Ad7_RemoteProjects_V5';
import { Ad8_PricingTiers_V5 } from './ads-v5/Ad8_PricingTiers_V5';
import { Ad9_BeforeAfter_V5 } from './ads-v5/Ad9_BeforeAfter_V5';
import { Ad10_AutomationMagic_V5 } from './ads-v5/Ad10_AutomationMagic_V5';
import { Ad11_DarkLightShowcase_V5 } from './ads-v5/Ad11_DarkLightShowcase_V5';
import { Ad13_FeatureCollage_V5 } from './ads-v5/Ad13_FeatureCollage_V5';
import { Ad14_NoCalls_V5 } from './ads-v5/Ad14_NoCalls_V5';
import { Ad15_NoShowProtection_V5 } from './ads-v5/Ad15_NoShowProtection_V5';
import { Ad16_CalendarSync_V5 } from './ads-v5/Ad16_CalendarSync_V5';
import { Ad19_EarlyBirdDiscount_V5 } from './ads-v5/Ad19_EarlyBirdDiscount_V5';
import { Ad20_MultiLocation_V5 } from './ads-v5/Ad20_MultiLocation_V5';
import { Ad21_PaymentMethods_V5 } from './ads-v5/Ad21_PaymentMethods_V5';
import { Ad22_InvoiceGenerator_V5 } from './ads-v5/Ad22_InvoiceGenerator_V5';
import { Ad23_PaymentSecure_V5 } from './ads-v5/Ad23_PaymentSecure_V5';
import { Ad24_StudioAnalytics_V5 } from './ads-v5/Ad24_StudioAnalytics_V5';
import { Ad25_MobileFirst_V5 } from './ads-v5/Ad25_MobileFirst_V5';
import { Ad26_CustomBranding_V5 } from './ads-v5/Ad26_CustomBranding_V5';
import { Ad27_MultiStudio_V5 } from './ads-v5/Ad27_MultiStudio_V5';
import { Ad28_AvailabilityManagement_V5 } from './ads-v5/Ad28_AvailabilityManagement_V5';
import { Ad29_FlexibleBooking_V5 } from './ads-v5/Ad29_FlexibleBooking_V5';
import { Ad30_ClientBookingInfo_V5 } from './ads-v5/Ad30_ClientBookingInfo_V5';
import { Ad31_SmartNotifications_V5 } from './ads-v5/Ad31_SmartNotifications_V5';
import { Ad32_RevenueGrowth_V5 } from './ads-v5/Ad32_RevenueGrowth_V5';
import { Ad33_StudioComparison_V5 } from './ads-v5/Ad33_StudioComparison_V5';
import { Ad34_InstantSetup_V5 } from './ads-v5/Ad34_InstantSetup_V5';
import { Ad35_LiveAvailability_V5 } from './ads-v5/Ad35_LiveAvailability_V5';
import { Ad36_EquipmentList_V5 } from './ads-v5/Ad36_EquipmentList_V5';
import { Ad37_StudioGallery_V5 } from './ads-v5/Ad37_StudioGallery_V5';
import { Ad38_QuickSetup_V5 } from './ads-v5/Ad38_QuickSetup_V5';
import { Ad39_Support_V5 } from './ads-v5/Ad39_Support_V5';
import { Ad40_StudioSpotlight_V5 } from './ads-v5/Ad40_StudioSpotlight_V5';
import { Ad41_FreeTrial_V5 } from './ads-v5/Ad41_FreeTrial_V5';
import { Ad42_SuccessStories_V5 } from './ads-v5/Ad42_SuccessStories_V5';
import { Ad44_StudioComparison2_V5 } from './ads-v5/Ad44_StudioComparison2_V5';
import { Ad45_MobileResponsive_V5 } from './ads-v5/Ad45_MobileApp_V5';
import { Ad46_GetDiscovered_V5 } from './ads-v5/Ad46_Community_V5';
import { Ad47_TimeSavings_V5 } from './ads-v5/Ad47_TimeSavings_V5';
import { Ad48_ProfessionalLook_V5 } from './ads-v5/Ad48_ProfessionalLook_V5';
import { Ad49_FlexiblePricing_V5 } from './ads-v5/Ad49_SmartPricing_V5';
import { Ad50_Notifications_V5 } from './ads-v5/Ad50_InstantNotifications_V5';
import { Ad51_StudioNetwork_V5 } from './ads-v5/Ad51_StudioNetwork_V5';
import { Ad52_TimeIsMoney_V5 } from './ads-v5/Ad52_TimeIsMoney_V5';
import { Ad53_FinalCTA_V5 } from './ads-v5/Ad53_FinalCTA_V5';
import { Ad54_BuiltByOwners_V5 } from './ads-v5/Ad54_BuiltByOwners_V5';
import { Ad55_DashboardDemo_V5 } from './ads-v5/Ad55_DashboardDemo_V5';
import { Post1_CancellationPain_V3 } from './posts-v3/Post1_CancellationPain_V3';
import { Post2_EmptySlots_V3 } from './posts-v3/Post2_EmptySlots_V3';
import { Post3_BookingOutcome_V3 } from './posts-v3/Post3_BookingOutcome_V3';
import { Post4_DashboardOutcome_V3 } from './posts-v3/Post4_DashboardOutcome_V3';
import { Post5_FounderCredibility_V3 } from './posts-v3/Post5_FounderCredibility_V3';
import { Post6_WhyWeBuilt_V3 } from './posts-v3/Post6_WhyWeBuilt_V3';
import { Post7_FreeTrial_V3 } from './posts-v3/Post7_FreeTrial_V3';
import { Post1_CancellationPain_V4 } from './posts-v4/Post1_CancellationPain_V4';
import { Post2_EmptySlots_V4 } from './posts-v4/Post2_EmptySlots_V4';
import { Post3_BookingOutcome_V4 } from './posts-v4/Post3_BookingOutcome_V4';
import { Post4_DashboardOutcome_V4 } from './posts-v4/Post4_DashboardOutcome_V4';
import { Post5_FounderCredibility_V4 } from './posts-v4/Post5_FounderCredibility_V4';
import { Post6_WhyWeBuilt_V4 } from './posts-v4/Post6_WhyWeBuilt_V4';
import { Post7_FreeTrial_V4 } from './posts-v4/Post7_FreeTrial_V4';

const FPS = 30;
const W = 1080;
const H = 1920;
const W_4K = 3840;
const H_4K = 2160;
const W_POST = 1920;
const H_POST = 1080;
const W_V2 = 1080;
const H_V2 = 1350;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Original 3 ── */}
      <Composition
        id="BookYourSession"
        component={Ad1_BookYourSession}
        durationInFrames={300}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="StudioOwnersDream"
        component={Ad2_StudioOwnersDream}
        durationInFrames={360}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="TheStudiozEffect"
        component={Ad3_TheStudiozEffect}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── Batch 1 (Ad4–Ad18) ── */}
      <Composition id="BookingFlow" component={Ad4_BookingFlow} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition
        id="GoogleRanking"
        component={Ad6_GoogleRanking}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="RemoteProjects"
        component={Ad7_RemoteProjects}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="PricingTiers"
        component={Ad8_PricingTiers}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="BeforeAfter" component={Ad9_BeforeAfter} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition
        id="AutomationMagic"
        component={Ad10_AutomationMagic}
        durationInFrames={250}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="DarkLightShowcase"
        component={Ad11_DarkLightShowcase}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="InstantBooking"
        component={Ad12_InstantBooking}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="FeatureCollage"
        component={Ad13_FeatureCollage}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="NoCalls" component={Ad14_NoCalls} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition
        id="NoShowProtection"
        component={Ad15_NoShowProtection}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="CalendarSync"
        component={Ad16_CalendarSync}
        durationInFrames={250}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="StudioHero" component={Ad17_StudioHero} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition
        id="SocialProof"
        component={Ad18_SocialProof}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── Batch 2 (Ad19–Ad25) ── */}
      <Composition
        id="EarlyBirdDiscount"
        component={Ad19_EarlyBirdDiscount}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="MultiLocation"
        component={Ad20_MultiLocation}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ClientReviews"
        component={Ad21_ClientReviews}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="EquipmentList"
        component={Ad22_EquipmentList}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="PaymentSecure"
        component={Ad23_PaymentSecure}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="StudioAnalytics"
        component={Ad24_StudioAnalytics}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="MobileFirst"
        component={Ad25_MobileFirst}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── Batch 3 (Ad26–Ad32) ── */}
      <Composition
        id="CustomBranding"
        component={Ad26_CustomBranding}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="TeamManagement"
        component={Ad27_TeamManagement}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="WaitlistFeature"
        component={Ad28_WaitlistFeature}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="RecurringBookings"
        component={Ad29_RecurringBookings}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="ClientCRM" component={Ad30_ClientCRM} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition
        id="SmartNotifications"
        component={Ad31_SmartNotifications}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="RevenueGrowth"
        component={Ad32_RevenueGrowth}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── Batch 4 (Ad33–Ad39) ── */}
      <Composition
        id="StudioComparison"
        component={Ad33_StudioComparison}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="InstantSetup"
        component={Ad34_InstantSetup}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="LiveAvailability"
        component={Ad35_LiveAvailability}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ProPhotographers"
        component={Ad36_ProPhotographers}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="MusicProducers"
        component={Ad37_MusicProducers}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="PodcastStudios"
        component={Ad38_PodcastStudios}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="ContentCreators"
        component={Ad39_ContentCreators}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── Batch 5 (Ad40–Ad46) ── */}
      <Composition
        id="DanceStudios"
        component={Ad40_DanceStudios}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="ArtStudios" component={Ad41_ArtStudios} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition
        id="FitnessStudios"
        component={Ad42_FitnessStudios}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="CancelProtection"
        component={Ad43_CancelProtection}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="GroupBooking"
        component={Ad44_GroupBooking}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="StudioPortfolio"
        component={Ad45_StudioPortfolio}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="QuickOnboarding"
        component={Ad46_QuickOnboarding}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── Batch 6 (Ad47–Ad53) ── */}
      <Composition
        id="ClientRetention"
        component={Ad47_ClientRetention}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="WeekendWarrior"
        component={Ad48_WeekendWarrior}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="NightOwl" component={Ad49_NightOwl} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition
        id="SplitPayment"
        component={Ad50_SplitPayment}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="StudioNetwork"
        component={Ad51_StudioNetwork}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="TimeIsMoney"
        component={Ad52_TimeIsMoney}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition id="FinalCTA" component={Ad53_FinalCTA} durationInFrames={240} fps={FPS} width={W} height={H} />
      {/* ── Special ── */}
      <Composition
        id="BuiltByOwners"
        component={Ad54_BuiltByOwners}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="DashboardInAction"
        component={Ad55_DashboardInAction}
        durationInFrames={908}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="BookingDemo"
        component={Ad56_BookingDemo}
        durationInFrames={727}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── 4K Wide ── */}
      <Composition
        id="ProductLaunch4K"
        component={Ad57_ProductLaunch4K}
        durationInFrames={900}
        fps={FPS}
        width={W_4K}
        height={H_4K}
      />
      <Composition
        id="ProductLaunchV2"
        component={Ad58_ProductLaunchV2}
        durationInFrames={1390}
        fps={FPS}
        width={1920}
        height={1080}
      />
      {/* ── Social Posts (Stills) ── */}
      <Still id="Post-CancellationPain" component={Post1_CancellationPain} width={W_POST} height={H_POST} />
      <Still id="Post-EmptySlots" component={Post2_EmptySlots} width={W_POST} height={H_POST} />
      <Still id="Post-BookingOutcome" component={Post3_BookingOutcome} width={W_POST} height={H_POST} />
      <Still id="Post-DashboardOutcome" component={Post4_DashboardOutcome} width={W_POST} height={H_POST} />
      <Still id="Post-FounderCredibility" component={Post5_FounderCredibility} width={W_POST} height={H_POST} />
      <Still id="Post-WhyWeBuilt" component={Post6_WhyWeBuilt} width={W_POST} height={H_POST} />
      <Still id="Post-FreeTrial" component={Post7_FreeTrial} width={W_POST} height={H_POST} />
      {/* ── Social Posts — Light Theme ── */}
      <Still id="Post-CancellationPain-Light" component={Post1_CancellationPain_Light} width={W_POST} height={H_POST} />
      <Still id="Post-EmptySlots-Light" component={Post2_EmptySlots_Light} width={W_POST} height={H_POST} />
      <Still id="Post-BookingOutcome-Light" component={Post3_BookingOutcome_Light} width={W_POST} height={H_POST} />
      <Still id="Post-DashboardOutcome-Light" component={Post4_DashboardOutcome_Light} width={W_POST} height={H_POST} />
      <Still
        id="Post-FounderCredibility-Light"
        component={Post5_FounderCredibility_Light}
        width={W_POST}
        height={H_POST}
      />
      <Still id="Post-WhyWeBuilt-Light" component={Post6_WhyWeBuilt_Light} width={W_POST} height={H_POST} />
      <Still id="Post-FreeTrial-Light" component={Post7_FreeTrial_Light} width={W_POST} height={H_POST} />
      {/* ── Social Posts V2 (4:5) ── */}
      <Still id="V2-CancellationPain" component={Post1_CancellationPain_V2} width={W_V2} height={H_V2} />
      <Still id="V2-EmptySlots" component={Post2_EmptySlots_V2} width={W_V2} height={H_V2} />
      <Still id="V2-BookingOutcome" component={Post3_BookingOutcome_V2} width={W_V2} height={H_V2} />
      <Still id="V2-DashboardOutcome" component={Post4_DashboardOutcome_V2} width={W_V2} height={H_V2} />
      <Still id="V2-FounderCredibility" component={Post5_FounderCredibility_V2} width={W_V2} height={H_V2} />
      <Still id="V2-WhyWeBuilt" component={Post6_WhyWeBuilt_V2} width={W_V2} height={H_V2} />
      <Still id="V2-FreeTrial" component={Post7_FreeTrial_V2} width={W_V2} height={H_V2} />
      <Still id="V2-RevenueDashboard" component={Post8_RevenueDashboard_V2} width={W_V2} height={H_V2} />
      <Still id="V2-CalendarView" component={Post9_CalendarView_V2} width={W_V2} height={H_V2} />
      <Still id="V2-LiveActivity" component={Post10_LiveActivity_V2} width={W_V2} height={H_V2} />
      <Still id="V2-DocumentManagement" component={Post11_DocumentManagement_V2} width={W_V2} height={H_V2} />
      <Still id="V2-RevenueCharts" component={Post12_RevenueCharts_V2} width={W_V2} height={H_V2} />
      <Still id="V2-StudioPageShowcase" component={Post13_StudioPageShowcase_V2} width={W_V2} height={H_V2} />
      <Still id="V2-BookingExperience" component={Post14_BookingExperience_V2} width={W_V2} height={H_V2} />
      <Still id="V2-GoogleRanking" component={Post15_GoogleRanking_V2} width={W_V2} height={H_V2} />
      <Still id="V2-BeforeAfter" component={Post16_BeforeAfter_V2} width={W_V2} height={H_V2} />
      <Still id="V2-NoShowCost" component={Post17_NoShowCost_V2} width={W_V2} height={H_V2} />
      <Still id="V2-TimeSaved" component={Post18_TimeSaved_V2} width={W_V2} height={H_V2} />
      <Still id="V2-DailyRoutine" component={Post19_DailyRoutine_V2} width={W_V2} height={H_V2} />
      <Still id="V2-PlatformStats" component={Post21_PlatformStats_V2} width={W_V2} height={H_V2} />
      <Still id="V2-QuickSetup" component={Post22_QuickSetup_V2} width={W_V2} height={H_V2} />
      <Still id="V2-MultiStudio" component={Post23_MultiStudio_V2} width={W_V2} height={H_V2} />
      <Still id="V2-InvoiceTable" component={Post24_InvoiceTable_V2} width={W_V2} height={H_V2} />
      <Still id="V2-AvailabilityControl" component={Post25_AvailabilityControl_V2} width={W_V2} height={H_V2} />
      <Still id="V2-StopStart" component={Post26_StopStart_V2} width={W_V2} height={H_V2} />
      <Still id="V2-AlwaysOpen" component={Post27_AlwaysOpen_V2} width={W_V2} height={H_V2} />
      {/* ── Social Posts V2 — Light Theme (4:5) ── */}
      <Still id="V2-CancellationPain-Light" component={Post1_CancellationPain_V2_Light} width={W_V2} height={H_V2} />
      <Still id="V2-EmptySlots-Light" component={Post2_EmptySlots_V2_Light} width={W_V2} height={H_V2} />
      <Still id="V2-BookingOutcome-Light" component={Post3_BookingOutcome_V2_Light} width={W_V2} height={H_V2} />
      <Still id="V2-DashboardOutcome-Light" component={Post4_DashboardOutcome_V2_Light} width={W_V2} height={H_V2} />
      <Still
        id="V2-FounderCredibility-Light"
        component={Post5_FounderCredibility_V2_Light}
        width={W_V2}
        height={H_V2}
      />
      <Still id="V2-WhyWeBuilt-Light" component={Post6_WhyWeBuilt_V2_Light} width={W_V2} height={H_V2} />
      <Still id="V2-FreeTrial-Light" component={Post7_FreeTrial_V2_Light} width={W_V2} height={H_V2} />
      {/* ── Social Posts V3 (4:5) ── */}
      <Still id="V3-CancellationPain" component={Post1_CancellationPain_V3} width={W_V2} height={H_V2} />
      <Still id="V3-EmptySlots" component={Post2_EmptySlots_V3} width={W_V2} height={H_V2} />
      <Still id="V3-BookingOutcome" component={Post3_BookingOutcome_V3} width={W_V2} height={H_V2} />
      <Still id="V3-DashboardOutcome" component={Post4_DashboardOutcome_V3} width={W_V2} height={H_V2} />
      <Still id="V3-FounderCredibility" component={Post5_FounderCredibility_V3} width={W_V2} height={H_V2} />
      <Still id="V3-WhyWeBuilt" component={Post6_WhyWeBuilt_V3} width={W_V2} height={H_V2} />
      <Still id="V3-FreeTrial" component={Post7_FreeTrial_V3} width={W_V2} height={H_V2} />
      {/* ── Social Posts V4 (4:5, proper fonts) ── */}
      <Still id="V4-CancellationPain" component={Post1_CancellationPain_V4} width={W_V2} height={H_V2} />
      <Still id="V4-EmptySlots" component={Post2_EmptySlots_V4} width={W_V2} height={H_V2} />
      <Still id="V4-BookingOutcome" component={Post3_BookingOutcome_V4} width={W_V2} height={H_V2} />
      <Still id="V4-DashboardOutcome" component={Post4_DashboardOutcome_V4} width={W_V2} height={H_V2} />
      <Still id="V4-FounderCredibility" component={Post5_FounderCredibility_V4} width={W_V2} height={H_V2} />
      <Still id="V4-WhyWeBuilt" component={Post6_WhyWeBuilt_V4} width={W_V2} height={H_V2} />
      <Still id="V4-FreeTrial" component={Post7_FreeTrial_V4} width={W_V2} height={H_V2} />
      {/* ── B2B Ads V2 (Premium) ── */}
      <Composition
        id="V2-Ad1-BookYourSession"
        component={Ad1_BookYourSession_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad2-StudioOwnersDream"
        component={Ad2_StudioOwnersDream_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad3-TheStudiozEffect"
        component={Ad3_TheStudiozEffect_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad4-BookingFlow"
        component={Ad4_BookingFlow_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad5-Categories"
        component={Ad5_Categories_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad6-GoogleRanking"
        component={Ad6_GoogleRanking_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad7-RemoteProjects"
        component={Ad7_RemoteProjects_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad8-PricingTiers"
        component={Ad8_PricingTiers_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad9-BeforeAfter"
        component={Ad9_BeforeAfter_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad10-AutomationMagic"
        component={Ad10_AutomationMagic_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad11-DarkLightShowcase"
        component={Ad11_DarkLightShowcase_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad12-InstantBooking"
        component={Ad12_InstantBooking_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad13-FeatureCollage"
        component={Ad13_FeatureCollage_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad14-NoCalls"
        component={Ad14_NoCalls_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad15-NoShowProtection"
        component={Ad15_NoShowProtection_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad16-CalendarSync"
        component={Ad16_CalendarSync_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad17-StudioHero"
        component={Ad17_StudioHero_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad18-SocialProof"
        component={Ad18_SocialProof_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad19-EarlyBirdDiscount"
        component={Ad19_EarlyBirdDiscount_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad20-MultiLocation"
        component={Ad20_MultiLocation_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad21-PaymentMethods"
        component={Ad21_PaymentMethods_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad22-InvoiceGenerator"
        component={Ad22_InvoiceGenerator_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad23-PaymentSecure"
        component={Ad23_PaymentSecure_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad24-StudioAnalytics"
        component={Ad24_StudioAnalytics_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad25-MobileFirst"
        component={Ad25_MobileFirst_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad26-CustomBranding"
        component={Ad26_CustomBranding_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad27-TeamManagement"
        component={Ad27_TeamManagement_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad28-WaitlistFeature"
        component={Ad28_WaitlistFeature_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad29-RecurringBookings"
        component={Ad29_RecurringBookings_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad30-ClientCRM"
        component={Ad30_ClientCRM_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad31-SmartNotifications"
        component={Ad31_SmartNotifications_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad32-RevenueGrowth"
        component={Ad32_RevenueGrowth_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad33-StudioComparison"
        component={Ad33_StudioComparison_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad34-InstantSetup"
        component={Ad34_InstantSetup_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad35-LiveAvailability"
        component={Ad35_LiveAvailability_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad36-EquipmentList"
        component={Ad36_EquipmentList_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad37-StudioTour"
        component={Ad37_StudioTour_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad38-QuickSetup"
        component={Ad38_QuickSetup_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad39-Support247"
        component={Ad39_Support247_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad40-StudioSpotlight"
        component={Ad40_StudioSpotlight_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad41-ReferralProgram"
        component={Ad41_ReferralProgram_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad42-SuccessStories"
        component={Ad42_SuccessStories_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad43-PlatformStats"
        component={Ad43_PlatformStats_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad44-StudioComparison2"
        component={Ad44_StudioComparison2_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad45-MobileApp"
        component={Ad45_MobileApp_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad46-Community"
        component={Ad46_Community_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad47-TimeSavings"
        component={Ad47_TimeSavings_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad48-ProfessionalLook"
        component={Ad48_ProfessionalLook_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad49-SmartPricing"
        component={Ad49_SmartPricing_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad50-InstantNotifications"
        component={Ad50_InstantNotifications_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad51-StudioNetwork"
        component={Ad51_StudioNetwork_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad52-TimeIsMoney"
        component={Ad52_TimeIsMoney_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad53-FinalCTA"
        component={Ad53_FinalCTA_V2}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad54-BuiltByOwners"
        component={Ad54_BuiltByOwners_V2}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad55-DashboardDemo"
        component={Ad55_DashboardDemo_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad56-BookingDemo"
        component={Ad56_BookingDemo_V2}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V2-Ad57-ProductLaunch"
        component={Ad57_ProductLaunch_V2}
        durationInFrames={300}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── B2B Ads V3 (Premium — V1 screenshots + V2 polish) ── */}
      <Composition
        id="V3-Ad2-StudioOwnersDream"
        component={Ad2_StudioOwnersDream_V3}
        durationInFrames={360}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad4-BookingFlow"
        component={Ad4_BookingFlow_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad6-GoogleRanking"
        component={Ad6_GoogleRanking_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad7-RemoteProjects"
        component={Ad7_RemoteProjects_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad8-PricingTiers"
        component={Ad8_PricingTiers_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad9-BeforeAfter"
        component={Ad9_BeforeAfter_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad10-AutomationMagic"
        component={Ad10_AutomationMagic_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad11-DarkLightShowcase"
        component={Ad11_DarkLightShowcase_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad13-FeatureCollage"
        component={Ad13_FeatureCollage_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad14-NoCalls"
        component={Ad14_NoCalls_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad15-NoShowProtection"
        component={Ad15_NoShowProtection_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad16-CalendarSync"
        component={Ad16_CalendarSync_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad19-EarlyBirdDiscount"
        component={Ad19_EarlyBirdDiscount_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad20-MultiLocation"
        component={Ad20_MultiLocation_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad21-PaymentMethods"
        component={Ad21_PaymentMethods_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad22-InvoiceGenerator"
        component={Ad22_InvoiceGenerator_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad23-PaymentSecure"
        component={Ad23_PaymentSecure_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad24-StudioAnalytics"
        component={Ad24_StudioAnalytics_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad25-MobileFirst"
        component={Ad25_MobileFirst_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad26-CustomBranding"
        component={Ad26_CustomBranding_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad27-TeamManagement"
        component={Ad27_TeamManagement_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad28-WaitlistFeature"
        component={Ad28_WaitlistFeature_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad29-RecurringBookings"
        component={Ad29_RecurringBookings_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad30-ClientCRM"
        component={Ad30_ClientCRM_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad31-SmartNotifications"
        component={Ad31_SmartNotifications_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad32-RevenueGrowth"
        component={Ad32_RevenueGrowth_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad33-StudioComparison"
        component={Ad33_StudioComparison_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad34-InstantSetup"
        component={Ad34_InstantSetup_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad35-LiveAvailability"
        component={Ad35_LiveAvailability_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad36-EquipmentList"
        component={Ad36_EquipmentList_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad37-StudioTour"
        component={Ad37_StudioTour_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad38-QuickSetup"
        component={Ad38_QuickSetup_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad39-Support247"
        component={Ad39_Support247_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad40-StudioSpotlight"
        component={Ad40_StudioSpotlight_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad41-ReferralProgram"
        component={Ad41_ReferralProgram_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad42-SuccessStories"
        component={Ad42_SuccessStories_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad44-StudioComparison2"
        component={Ad44_StudioComparison2_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad45-MobileApp"
        component={Ad45_MobileApp_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad46-Community"
        component={Ad46_Community_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad47-TimeSavings"
        component={Ad47_TimeSavings_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad48-ProfessionalLook"
        component={Ad48_ProfessionalLook_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad49-SmartPricing"
        component={Ad49_SmartPricing_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad50-InstantNotifications"
        component={Ad50_InstantNotifications_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad51-StudioNetwork"
        component={Ad51_StudioNetwork_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad52-TimeIsMoney"
        component={Ad52_TimeIsMoney_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad53-FinalCTA"
        component={Ad53_FinalCTA_V3}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad54-BuiltByOwners"
        component={Ad54_BuiltByOwners_V3}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V3-Ad55-DashboardDemo"
        component={Ad55_DashboardDemo_V3}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── B2B Ads V4 (Lucide icons, real features only, accurate data) ── */}
      <Composition
        id="V4-Ad2-StudioOwnersDream"
        component={Ad2_StudioOwnersDream_V4}
        durationInFrames={360}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad4-BookingFlow"
        component={Ad4_BookingFlow_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad6-GoogleRanking"
        component={Ad6_GoogleRanking_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad7-RemoteProjects"
        component={Ad7_RemoteProjects_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad8-PricingTiers"
        component={Ad8_PricingTiers_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad9-BeforeAfter"
        component={Ad9_BeforeAfter_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad10-AutomationMagic"
        component={Ad10_AutomationMagic_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad11-DarkLightShowcase"
        component={Ad11_DarkLightShowcase_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad13-FeatureCollage"
        component={Ad13_FeatureCollage_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad14-NoCalls"
        component={Ad14_NoCalls_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad15-NoShowProtection"
        component={Ad15_NoShowProtection_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad16-CalendarSync"
        component={Ad16_CalendarSync_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad19-EarlyBirdDiscount"
        component={Ad19_EarlyBirdDiscount_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad20-MultiLocation"
        component={Ad20_MultiLocation_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad21-PaymentMethods"
        component={Ad21_PaymentMethods_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad22-InvoiceGenerator"
        component={Ad22_InvoiceGenerator_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad23-PaymentSecure"
        component={Ad23_PaymentSecure_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad24-StudioAnalytics"
        component={Ad24_StudioAnalytics_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad25-MobileResponsive"
        component={Ad25_MobileFirst_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad26-StudioProfile"
        component={Ad26_CustomBranding_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad27-MultiStudio"
        component={Ad27_MultiStudio_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad28-AvailabilityManagement"
        component={Ad28_AvailabilityManagement_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad29-FlexibleBooking"
        component={Ad29_FlexibleBooking_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad30-ClientBookingInfo"
        component={Ad30_ClientBookingInfo_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad31-SmartNotifications"
        component={Ad31_SmartNotifications_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad32-RevenueGrowth"
        component={Ad32_RevenueGrowth_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad33-StudioComparison"
        component={Ad33_StudioComparison_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad34-InstantSetup"
        component={Ad34_InstantSetup_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad35-LiveAvailability"
        component={Ad35_LiveAvailability_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad36-EquipmentList"
        component={Ad36_EquipmentList_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad37-StudioGallery"
        component={Ad37_StudioGallery_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad38-QuickSetup"
        component={Ad38_QuickSetup_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad39-Support"
        component={Ad39_Support_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad40-StudioSpotlight"
        component={Ad40_StudioSpotlight_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad41-FreeTrial"
        component={Ad41_FreeTrial_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad42-SuccessStories"
        component={Ad42_SuccessStories_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad44-StudioComparison2"
        component={Ad44_StudioComparison2_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad45-MobileResponsive"
        component={Ad45_MobileResponsive_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad46-GetDiscovered"
        component={Ad46_GetDiscovered_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad47-TimeSavings"
        component={Ad47_TimeSavings_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad48-ProfessionalLook"
        component={Ad48_ProfessionalLook_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad49-FlexiblePricing"
        component={Ad49_FlexiblePricing_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad50-Notifications"
        component={Ad50_Notifications_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad51-StudioNetwork"
        component={Ad51_StudioNetwork_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad52-TimeIsMoney"
        component={Ad52_TimeIsMoney_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad53-FinalCTA"
        component={Ad53_FinalCTA_V4}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad54-BuiltByOwners"
        component={Ad54_BuiltByOwners_V4}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V4-Ad55-DashboardDemo"
        component={Ad55_DashboardDemo_V4}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── B2B Ads V5 (new dashboard screenshots per feature tab) ── */}
      <Composition
        id="V5-Ad2-StudioOwnersDream"
        component={Ad2_StudioOwnersDream_V5}
        durationInFrames={360}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad4-BookingFlow"
        component={Ad4_BookingFlow_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad6-GoogleRanking"
        component={Ad6_GoogleRanking_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad7-RemoteProjects"
        component={Ad7_RemoteProjects_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad8-PricingTiers"
        component={Ad8_PricingTiers_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad9-BeforeAfter"
        component={Ad9_BeforeAfter_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad10-AutomationMagic"
        component={Ad10_AutomationMagic_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad11-DarkLightShowcase"
        component={Ad11_DarkLightShowcase_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad13-FeatureCollage"
        component={Ad13_FeatureCollage_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad14-NoCalls"
        component={Ad14_NoCalls_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad15-NoShowProtection"
        component={Ad15_NoShowProtection_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad16-CalendarSync"
        component={Ad16_CalendarSync_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad19-EarlyBirdDiscount"
        component={Ad19_EarlyBirdDiscount_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad20-MultiLocation"
        component={Ad20_MultiLocation_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad21-PaymentMethods"
        component={Ad21_PaymentMethods_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad22-InvoiceGenerator"
        component={Ad22_InvoiceGenerator_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad23-PaymentSecure"
        component={Ad23_PaymentSecure_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad24-StudioAnalytics"
        component={Ad24_StudioAnalytics_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad25-MobileResponsive"
        component={Ad25_MobileFirst_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad26-StudioProfile"
        component={Ad26_CustomBranding_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad27-MultiStudio"
        component={Ad27_MultiStudio_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad28-AvailabilityManagement"
        component={Ad28_AvailabilityManagement_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad29-FlexibleBooking"
        component={Ad29_FlexibleBooking_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad30-ClientBookingInfo"
        component={Ad30_ClientBookingInfo_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad31-SmartNotifications"
        component={Ad31_SmartNotifications_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad32-RevenueGrowth"
        component={Ad32_RevenueGrowth_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad33-StudioComparison"
        component={Ad33_StudioComparison_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad34-InstantSetup"
        component={Ad34_InstantSetup_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad35-LiveAvailability"
        component={Ad35_LiveAvailability_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad36-EquipmentList"
        component={Ad36_EquipmentList_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad37-StudioGallery"
        component={Ad37_StudioGallery_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad38-QuickSetup"
        component={Ad38_QuickSetup_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad39-Support"
        component={Ad39_Support_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad40-StudioSpotlight"
        component={Ad40_StudioSpotlight_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad41-FreeTrial"
        component={Ad41_FreeTrial_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad42-SuccessStories"
        component={Ad42_SuccessStories_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad44-StudioComparison2"
        component={Ad44_StudioComparison2_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad45-MobileResponsive"
        component={Ad45_MobileResponsive_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad46-GetDiscovered"
        component={Ad46_GetDiscovered_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad47-TimeSavings"
        component={Ad47_TimeSavings_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad48-ProfessionalLook"
        component={Ad48_ProfessionalLook_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad49-FlexiblePricing"
        component={Ad49_FlexiblePricing_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad50-Notifications"
        component={Ad50_Notifications_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad51-StudioNetwork"
        component={Ad51_StudioNetwork_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad52-TimeIsMoney"
        component={Ad52_TimeIsMoney_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad53-FinalCTA"
        component={Ad53_FinalCTA_V5}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad54-BuiltByOwners"
        component={Ad54_BuiltByOwners_V5}
        durationInFrames={270}
        fps={FPS}
        width={W}
        height={H}
      />
      <Composition
        id="V5-Ad55-DashboardDemo"
        component={Ad55_DashboardDemo_V5}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />
      {/* ── B2B Ads V5 — 4:5 (1080×1350) — natively responsive via useScale() ── */}
      {(() => {
        const W45 = 1080;
        const H45 = 1350;
        const ads: [string, React.FC, number][] = [
          ['V5-Ad2-StudioOwnersDream', Ad2_StudioOwnersDream_V5, 360],
          ['V5-Ad4-BookingFlow', Ad4_BookingFlow_V5, 240],
          ['V5-Ad6-GoogleRanking', Ad6_GoogleRanking_V5, 240],
          ['V5-Ad7-RemoteProjects', Ad7_RemoteProjects_V5, 240],
          ['V5-Ad8-PricingTiers', Ad8_PricingTiers_V5, 240],
          ['V5-Ad9-BeforeAfter', Ad9_BeforeAfter_V5, 240],
          ['V5-Ad10-AutomationMagic', Ad10_AutomationMagic_V5, 240],
          ['V5-Ad11-DarkLightShowcase', Ad11_DarkLightShowcase_V5, 240],
          ['V5-Ad13-FeatureCollage', Ad13_FeatureCollage_V5, 240],
          ['V5-Ad14-NoCalls', Ad14_NoCalls_V5, 240],
          ['V5-Ad15-NoShowProtection', Ad15_NoShowProtection_V5, 240],
          ['V5-Ad16-CalendarSync', Ad16_CalendarSync_V5, 240],
          ['V5-Ad19-EarlyBirdDiscount', Ad19_EarlyBirdDiscount_V5, 240],
          ['V5-Ad20-MultiLocation', Ad20_MultiLocation_V5, 240],
          ['V5-Ad21-PaymentMethods', Ad21_PaymentMethods_V5, 240],
          ['V5-Ad22-InvoiceGenerator', Ad22_InvoiceGenerator_V5, 240],
          ['V5-Ad23-PaymentSecure', Ad23_PaymentSecure_V5, 240],
          ['V5-Ad24-StudioAnalytics', Ad24_StudioAnalytics_V5, 240],
          ['V5-Ad25-MobileResponsive', Ad25_MobileFirst_V5, 240],
          ['V5-Ad26-StudioProfile', Ad26_CustomBranding_V5, 240],
          ['V5-Ad27-MultiStudio', Ad27_MultiStudio_V5, 240],
          ['V5-Ad28-AvailabilityManagement', Ad28_AvailabilityManagement_V5, 240],
          ['V5-Ad29-FlexibleBooking', Ad29_FlexibleBooking_V5, 240],
          ['V5-Ad30-ClientBookingInfo', Ad30_ClientBookingInfo_V5, 240],
          ['V5-Ad31-SmartNotifications', Ad31_SmartNotifications_V5, 240],
          ['V5-Ad32-RevenueGrowth', Ad32_RevenueGrowth_V5, 240],
          ['V5-Ad33-StudioComparison', Ad33_StudioComparison_V5, 240],
          ['V5-Ad34-InstantSetup', Ad34_InstantSetup_V5, 240],
          ['V5-Ad35-LiveAvailability', Ad35_LiveAvailability_V5, 240],
          ['V5-Ad36-EquipmentList', Ad36_EquipmentList_V5, 240],
          ['V5-Ad37-StudioGallery', Ad37_StudioGallery_V5, 240],
          ['V5-Ad38-QuickSetup', Ad38_QuickSetup_V5, 240],
          ['V5-Ad39-Support', Ad39_Support_V5, 240],
          ['V5-Ad40-StudioSpotlight', Ad40_StudioSpotlight_V5, 240],
          ['V5-Ad41-FreeTrial', Ad41_FreeTrial_V5, 240],
          ['V5-Ad42-SuccessStories', Ad42_SuccessStories_V5, 240],
          ['V5-Ad44-StudioComparison2', Ad44_StudioComparison2_V5, 240],
          ['V5-Ad45-MobileResponsive', Ad45_MobileResponsive_V5, 240],
          ['V5-Ad46-GetDiscovered', Ad46_GetDiscovered_V5, 240],
          ['V5-Ad47-TimeSavings', Ad47_TimeSavings_V5, 240],
          ['V5-Ad48-ProfessionalLook', Ad48_ProfessionalLook_V5, 240],
          ['V5-Ad49-FlexiblePricing', Ad49_FlexiblePricing_V5, 240],
          ['V5-Ad50-Notifications', Ad50_Notifications_V5, 240],
          ['V5-Ad51-StudioNetwork', Ad51_StudioNetwork_V5, 240],
          ['V5-Ad52-TimeIsMoney', Ad52_TimeIsMoney_V5, 240],
          ['V5-Ad53-FinalCTA', Ad53_FinalCTA_V5, 270],
          ['V5-Ad54-BuiltByOwners', Ad54_BuiltByOwners_V5, 270],
          ['V5-Ad55-DashboardDemo', Ad55_DashboardDemo_V5, 240],
        ];
        return ads.map(([id, comp, dur]) => (
          <Composition key={`${id}-4x5`} id={`${id}-4x5`} component={comp} durationInFrames={dur} fps={FPS} width={W45} height={H45} />
        ));
      })()}
      {/* ── B2B Ads V5 — 1:1 (1080×1080) — natively responsive via useScale() ── */}
      {(() => {
        const W11 = 1080;
        const H11 = 1080;
        const ads: [string, React.FC, number][] = [
          ['V5-Ad2-StudioOwnersDream', Ad2_StudioOwnersDream_V5, 360],
          ['V5-Ad4-BookingFlow', Ad4_BookingFlow_V5, 240],
          ['V5-Ad6-GoogleRanking', Ad6_GoogleRanking_V5, 240],
          ['V5-Ad7-RemoteProjects', Ad7_RemoteProjects_V5, 240],
          ['V5-Ad8-PricingTiers', Ad8_PricingTiers_V5, 240],
          ['V5-Ad9-BeforeAfter', Ad9_BeforeAfter_V5, 240],
          ['V5-Ad10-AutomationMagic', Ad10_AutomationMagic_V5, 240],
          ['V5-Ad11-DarkLightShowcase', Ad11_DarkLightShowcase_V5, 240],
          ['V5-Ad13-FeatureCollage', Ad13_FeatureCollage_V5, 240],
          ['V5-Ad14-NoCalls', Ad14_NoCalls_V5, 240],
          ['V5-Ad15-NoShowProtection', Ad15_NoShowProtection_V5, 240],
          ['V5-Ad16-CalendarSync', Ad16_CalendarSync_V5, 240],
          ['V5-Ad19-EarlyBirdDiscount', Ad19_EarlyBirdDiscount_V5, 240],
          ['V5-Ad20-MultiLocation', Ad20_MultiLocation_V5, 240],
          ['V5-Ad21-PaymentMethods', Ad21_PaymentMethods_V5, 240],
          ['V5-Ad22-InvoiceGenerator', Ad22_InvoiceGenerator_V5, 240],
          ['V5-Ad23-PaymentSecure', Ad23_PaymentSecure_V5, 240],
          ['V5-Ad24-StudioAnalytics', Ad24_StudioAnalytics_V5, 240],
          ['V5-Ad25-MobileResponsive', Ad25_MobileFirst_V5, 240],
          ['V5-Ad26-StudioProfile', Ad26_CustomBranding_V5, 240],
          ['V5-Ad27-MultiStudio', Ad27_MultiStudio_V5, 240],
          ['V5-Ad28-AvailabilityManagement', Ad28_AvailabilityManagement_V5, 240],
          ['V5-Ad29-FlexibleBooking', Ad29_FlexibleBooking_V5, 240],
          ['V5-Ad30-ClientBookingInfo', Ad30_ClientBookingInfo_V5, 240],
          ['V5-Ad31-SmartNotifications', Ad31_SmartNotifications_V5, 240],
          ['V5-Ad32-RevenueGrowth', Ad32_RevenueGrowth_V5, 240],
          ['V5-Ad33-StudioComparison', Ad33_StudioComparison_V5, 240],
          ['V5-Ad34-InstantSetup', Ad34_InstantSetup_V5, 240],
          ['V5-Ad35-LiveAvailability', Ad35_LiveAvailability_V5, 240],
          ['V5-Ad36-EquipmentList', Ad36_EquipmentList_V5, 240],
          ['V5-Ad37-StudioGallery', Ad37_StudioGallery_V5, 240],
          ['V5-Ad38-QuickSetup', Ad38_QuickSetup_V5, 240],
          ['V5-Ad39-Support', Ad39_Support_V5, 240],
          ['V5-Ad40-StudioSpotlight', Ad40_StudioSpotlight_V5, 240],
          ['V5-Ad41-FreeTrial', Ad41_FreeTrial_V5, 240],
          ['V5-Ad42-SuccessStories', Ad42_SuccessStories_V5, 240],
          ['V5-Ad44-StudioComparison2', Ad44_StudioComparison2_V5, 240],
          ['V5-Ad45-MobileResponsive', Ad45_MobileResponsive_V5, 240],
          ['V5-Ad46-GetDiscovered', Ad46_GetDiscovered_V5, 240],
          ['V5-Ad47-TimeSavings', Ad47_TimeSavings_V5, 240],
          ['V5-Ad48-ProfessionalLook', Ad48_ProfessionalLook_V5, 240],
          ['V5-Ad49-FlexiblePricing', Ad49_FlexiblePricing_V5, 240],
          ['V5-Ad50-Notifications', Ad50_Notifications_V5, 240],
          ['V5-Ad51-StudioNetwork', Ad51_StudioNetwork_V5, 240],
          ['V5-Ad52-TimeIsMoney', Ad52_TimeIsMoney_V5, 240],
          ['V5-Ad53-FinalCTA', Ad53_FinalCTA_V5, 270],
          ['V5-Ad54-BuiltByOwners', Ad54_BuiltByOwners_V5, 270],
          ['V5-Ad55-DashboardDemo', Ad55_DashboardDemo_V5, 240],
        ];
        return ads.map(([id, comp, dur]) => (
          <Composition key={`${id}-1x1`} id={`${id}-1x1`} component={comp} durationInFrames={dur} fps={FPS} width={W11} height={H11} />
        ));
      })()}
    </>
  );
};
