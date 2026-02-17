#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════════════
# Studioz V3 B2B Ads — Render All
# V3 = V1 screenshots + V2 premium polish
# ═══════════════════════════════════════════════════════════════════

V3_B2B_ADS=(
  "V3-Ad2-StudioOwnersDream"
  "V3-Ad4-BookingFlow"
  "V3-Ad6-GoogleRanking"
  "V3-Ad7-RemoteProjects"
  "V3-Ad8-PricingTiers"
  "V3-Ad9-BeforeAfter"
  "V3-Ad10-AutomationMagic"
  "V3-Ad11-DarkLightShowcase"
  "V3-Ad13-FeatureCollage"
  "V3-Ad14-NoCalls"
  "V3-Ad15-NoShowProtection"
  "V3-Ad16-CalendarSync"
  "V3-Ad19-EarlyBirdDiscount"
  "V3-Ad20-MultiLocation"
  "V3-Ad21-PaymentMethods"
  "V3-Ad22-InvoiceGenerator"
  "V3-Ad23-PaymentSecure"
  "V3-Ad24-StudioAnalytics"
  "V3-Ad25-MobileFirst"
  "V3-Ad26-CustomBranding"
  "V3-Ad27-TeamManagement"
  "V3-Ad28-WaitlistFeature"
  "V3-Ad29-RecurringBookings"
  "V3-Ad30-ClientCRM"
  "V3-Ad31-SmartNotifications"
  "V3-Ad32-RevenueGrowth"
  "V3-Ad33-StudioComparison"
  "V3-Ad34-InstantSetup"
  "V3-Ad35-LiveAvailability"
  "V3-Ad36-EquipmentList"
  "V3-Ad37-StudioTour"
  "V3-Ad38-QuickSetup"
  "V3-Ad39-Support247"
  "V3-Ad40-StudioSpotlight"
  "V3-Ad41-ReferralProgram"
  "V3-Ad42-SuccessStories"
  "V3-Ad44-StudioComparison2"
  "V3-Ad45-MobileApp"
  "V3-Ad46-Community"
  "V3-Ad47-TimeSavings"
  "V3-Ad48-ProfessionalLook"
  "V3-Ad49-SmartPricing"
  "V3-Ad50-InstantNotifications"
  "V3-Ad51-StudioNetwork"
  "V3-Ad52-TimeIsMoney"
  "V3-Ad53-FinalCTA"
  "V3-Ad54-BuiltByOwners"
  "V3-Ad55-DashboardDemo"
)

OUT_DIR="out/v3-b2b"
mkdir -p "$OUT_DIR"

TOTAL=${#V3_B2B_ADS[@]}
COUNT=0

echo "═══════════════════════════════════════════════════════════"
echo "  Studioz V3 B2B Ads — Rendering $TOTAL ads"
echo "═══════════════════════════════════════════════════════════"
echo ""

for id in "${V3_B2B_ADS[@]}"; do
  COUNT=$((COUNT + 1))
  echo "[$COUNT/$TOTAL] Rendering: $id"
  npx remotion render src/index.ts "$id" "$OUT_DIR/${id}.mp4"
done

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  Done! $TOTAL V3 B2B ads rendered to $OUT_DIR/"
echo "═══════════════════════════════════════════════════════════"
