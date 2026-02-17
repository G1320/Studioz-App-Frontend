#!/bin/bash
set -e
cd /Users/dg/Desktop/Studios-App/Frontend/remotion-ads

BASE="/Users/dg/Desktop/B2B Ads V5"
TMP="/tmp/v5-renders"
mkdir -p "$TMP"

get_folder() {
  case "$1" in
    Ad2-*|Ad9-*|Ad14-*|Ad33-*|Ad44-*|Ad47-*|Ad52-*) echo "1-PAIN" ;;
    Ad4-*|Ad10-*|Ad30-*|Ad31-*|Ad32-*|Ad42-*|Ad48-*|Ad55-*) echo "2-OUTCOME" ;;
    Ad13-*|Ad15-*|Ad16-*|Ad20-*|Ad22-*|Ad24-*|Ad25-*|Ad27-*|Ad28-*|Ad35-*|Ad36-*|Ad37-*|Ad45-*|Ad49-*|Ad50-*) echo "3-FEATURES" ;;
    Ad6-*|Ad11-*|Ad26-*|Ad39-*|Ad40-*|Ad46-*|Ad54-*) echo "4-AUTHORITY" ;;
    Ad8-*|Ad19-*|Ad34-*|Ad38-*|Ad41-*|Ad53-*) echo "5-CTA" ;;
    *) echo "" ;;
  esac
}

ADS="Ad2-StudioOwnersDream Ad4-BookingFlow Ad6-GoogleRanking Ad8-PricingTiers Ad9-BeforeAfter Ad10-AutomationMagic Ad11-DarkLightShowcase Ad13-FeatureCollage Ad14-NoCalls Ad15-NoShowProtection Ad16-CalendarSync Ad19-EarlyBirdDiscount Ad20-MultiLocation Ad22-InvoiceGenerator Ad24-StudioAnalytics Ad25-MobileResponsive Ad26-StudioProfile Ad27-MultiStudio Ad28-AvailabilityManagement Ad30-ClientBookingInfo Ad31-SmartNotifications Ad32-RevenueGrowth Ad33-StudioComparison Ad34-InstantSetup Ad35-LiveAvailability Ad36-EquipmentList Ad37-StudioGallery Ad38-QuickSetup Ad39-Support Ad40-StudioSpotlight Ad41-FreeTrial Ad42-SuccessStories Ad44-StudioComparison2 Ad45-MobileResponsive Ad46-GetDiscovered Ad47-TimeSavings Ad48-ProfessionalLook Ad49-FlexiblePricing Ad50-Notifications Ad52-TimeIsMoney Ad53-FinalCTA Ad54-BuiltByOwners Ad55-DashboardDemo"

TOTAL=43
COUNT=0
DONE=0
FAIL=0

echo ""
echo "════════════════════════════════════════"
echo "  Re-rendering ALL 1:1 ads (smaller screenshots)"
echo "════════════════════════════════════════"
echo ""

# Delete old 1:1 renders
for folder in "1-PAIN" "2-OUTCOME" "3-FEATURES" "4-AUTHORITY" "5-CTA"; do
  rm -f "$BASE/$folder/1x1/"*.mp4
done
echo "Cleared old 1:1 renders."
echo ""

for ad in $ADS; do
  folder=$(get_folder "$ad")
  if [ -z "$folder" ]; then
    echo "WARN: No folder for $ad, skipping"
    continue
  fi

  COUNT=$((COUNT + 1))
  comp="V5-${ad}-1x1"
  dest="$BASE/$folder/1x1/V5-${ad}.mp4"
  tmp_out="$TMP/V5-${ad}-1x1.mp4"

  # Remove cached tmp file too
  rm -f "$tmp_out"

  echo "[$COUNT/$TOTAL] $comp → $folder/1x1/"

  if npx remotion render "$comp" "$tmp_out" --concurrency=4 2>&1 | tail -1; then
    cp "$tmp_out" "$dest"
    DONE=$((DONE + 1))
  else
    echo "  FAILED: $comp"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "════════════════════════════════════════"
echo "  1:1 RE-RENDER COMPLETE"
echo "  Success: $DONE / $TOTAL"
echo "  Failed:  $FAIL"
echo "════════════════════════════════════════"
echo ""

# Show final counts
for folder in "1-PAIN" "2-OUTCOME" "3-FEATURES" "4-AUTHORITY" "5-CTA"; do
  echo "$folder:"
  for ratio in "9x16" "4x5" "1x1"; do
    c=$(ls -1 "$BASE/$folder/$ratio/"*.mp4 2>/dev/null | wc -l | tr -d ' ')
    echo "  $ratio: $c videos"
  done
done
total=$(find "$BASE" -name "*.mp4" | wc -l | tr -d ' ')
echo ""
echo "TOTAL: $total videos"
