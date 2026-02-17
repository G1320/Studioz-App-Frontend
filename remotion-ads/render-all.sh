#!/bin/bash
set -e

# B2C ads (customer-facing)
B2C_ADS=(
  "BookYourSession"
  "TheStudiozEffect"
  "Categories"
  "InstantBooking"
  "StudioHero"
  "SocialProof"
  "ClientReviews"
  "BookingDemo"
)

# B2B ads (studio owner-facing)
B2B_ADS=(
  "StudioOwnersDream"
  "BookingFlow"
  "GoogleRanking"
  "RemoteProjects"
  "PricingTiers"
  "BeforeAfter"
  "AutomationMagic"
  "DarkLightShowcase"
  "FeatureCollage"
  "NoCalls"
  "NoShowProtection"
  "CalendarSync"
  "EarlyBirdDiscount"
  "MultiLocation"
  "EquipmentList"
  "PaymentSecure"
  "StudioAnalytics"
  "MobileFirst"
  "CustomBranding"
  "TeamManagement"
  "WaitlistFeature"
  "RecurringBookings"
  "ClientCRM"
  "SmartNotifications"
  "RevenueGrowth"
  "StudioComparison"
  "InstantSetup"
  "LiveAvailability"
  "ProPhotographers"
  "MusicProducers"
  "PodcastStudios"
  "ContentCreators"
  "DanceStudios"
  "ArtStudios"
  "FitnessStudios"
  "CancelProtection"
  "GroupBooking"
  "StudioPortfolio"
  "QuickOnboarding"
  "ClientRetention"
  "WeekendWarrior"
  "NightOwl"
  "SplitPayment"
  "StudioNetwork"
  "TimeIsMoney"
  "FinalCTA"
  "BuiltByOwners"
  "DashboardInAction"
  "ProductLaunch4K"
)

mkdir -p out/b2c out/b2b

TOTAL=$(( ${#B2C_ADS[@]} + ${#B2B_ADS[@]} ))
COUNT=0

echo "=== Rendering $TOTAL ads ==="

for id in "${B2C_ADS[@]}"; do
  COUNT=$((COUNT + 1))
  echo "[$COUNT/$TOTAL] Rendering B2C: $id"
  npx remotion render src/index.ts "$id" "out/b2c/${id}.mp4"
done

for id in "${B2B_ADS[@]}"; do
  COUNT=$((COUNT + 1))
  echo "[$COUNT/$TOTAL] Rendering B2B: $id"
  npx remotion render src/index.ts "$id" "out/b2b/${id}.mp4"
done

echo ""
echo "=== Done! ==="
echo "B2C ads: out/b2c/ (${#B2C_ADS[@]} files)"
echo "B2B ads: out/b2b/ (${#B2B_ADS[@]} files)"
