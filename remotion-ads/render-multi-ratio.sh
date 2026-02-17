#!/bin/bash
# Render all V5 ads in 4:5 and 1:1 ratios, then sort into campaign folders
set -e

REMOTION_DIR="/Users/dg/Desktop/Studios-App/Frontend/remotion-ads"
OUTPUT_BASE="/Users/dg/Desktop/B2B Ads V5"
TEMP_DIR="/tmp/v5-multi-ratio"
mkdir -p "$TEMP_DIR"

cd "$REMOTION_DIR"

# ─── Ad lists per campaign folder ───
PAIN_ADS="Ad2-StudioOwnersDream Ad9-BeforeAfter Ad14-NoCalls Ad33-StudioComparison Ad44-StudioComparison2 Ad47-TimeSavings Ad52-TimeIsMoney"
OUTCOME_ADS="Ad4-BookingFlow Ad10-AutomationMagic Ad30-ClientBookingInfo Ad31-SmartNotifications Ad32-RevenueGrowth Ad42-SuccessStories Ad48-ProfessionalLook Ad55-DashboardDemo"
FEATURES_ADS="Ad13-FeatureCollage Ad15-NoShowProtection Ad16-CalendarSync Ad20-MultiLocation Ad22-InvoiceGenerator Ad24-StudioAnalytics Ad25-MobileResponsive Ad27-MultiStudio Ad28-AvailabilityManagement Ad35-LiveAvailability Ad36-EquipmentList Ad37-StudioGallery Ad45-MobileResponsive Ad49-FlexiblePricing Ad50-Notifications"
AUTHORITY_ADS="Ad6-GoogleRanking Ad11-DarkLightShowcase Ad26-StudioProfile Ad39-Support Ad40-StudioSpotlight Ad46-GetDiscovered Ad54-BuiltByOwners"
CTA_ADS="Ad8-PricingTiers Ad19-EarlyBirdDiscount Ad34-InstantSetup Ad38-QuickSetup Ad41-FreeTrial Ad53-FinalCTA"

# All 43 ads
ALL_ADS="$PAIN_ADS $OUTCOME_ADS $FEATURES_ADS $AUTHORITY_ADS $CTA_ADS"

# ─── Ratios ───
RATIOS="4x5 1x1"

echo "=== Starting multi-ratio render for 43 ads × 2 ratios = 86 videos ==="
echo ""

# Render function
render_ad() {
  local ad_name="$1"
  local ratio="$2"
  local comp_id="V5-${ad_name}-${ratio}"
  local out_file="${TEMP_DIR}/V5-${ad_name}-${ratio}.mp4"
  
  if [ -f "$out_file" ]; then
    echo "[SKIP] $comp_id already exists"
    return 0
  fi
  
  echo "[RENDER] $comp_id ..."
  npx remotion render "$comp_id" "$out_file" --concurrency=4 2>/dev/null
  if [ $? -eq 0 ]; then
    echo "[DONE] $comp_id"
  else
    echo "[FAIL] $comp_id"
    return 1
  fi
}

# Render all in sequence (Remotion has its own parallelism via --concurrency)
TOTAL=0
DONE=0
FAILED=0

for ratio in $RATIOS; do
  for ad in $ALL_ADS; do
    TOTAL=$((TOTAL + 1))
  done
done

COUNT=0
for ratio in $RATIOS; do
  echo ""
  echo "═══ Rendering $ratio ratio ═══"
  echo ""
  for ad in $ALL_ADS; do
    COUNT=$((COUNT + 1))
    echo "[$COUNT/$TOTAL] Rendering V5-${ad}-${ratio}..."
    
    comp_id="V5-${ad}-${ratio}"
    out_file="${TEMP_DIR}/V5-${ad}-${ratio}.mp4"
    
    if [ -f "$out_file" ]; then
      echo "  -> SKIP (already exists)"
      DONE=$((DONE + 1))
      continue
    fi
    
    if npx remotion render "$comp_id" "$out_file" --concurrency=4 2>&1 | tail -1; then
      DONE=$((DONE + 1))
    else
      echo "  -> FAILED"
      FAILED=$((FAILED + 1))
    fi
  done
done

echo ""
echo "═══ Render complete: $DONE/$TOTAL succeeded, $FAILED failed ═══"
echo ""

# ─── Sort into campaign folders ───
echo "=== Sorting into campaign folders ==="

sort_ads() {
  local folder="$1"
  shift
  local ads="$@"
  
  for ad in $ads; do
    for ratio in $RATIOS; do
      local src="${TEMP_DIR}/V5-${ad}-${ratio}.mp4"
      local dst="${OUTPUT_BASE}/${folder}/V5-${ad}-${ratio}.mp4"
      if [ -f "$src" ]; then
        cp "$src" "$dst"
        echo "  -> ${folder}/V5-${ad}-${ratio}.mp4"
      fi
    done
  done
}

sort_ads "1-PAIN" $PAIN_ADS
sort_ads "2-OUTCOME" $OUTCOME_ADS
sort_ads "3-FEATURES" $FEATURES_ADS
sort_ads "4-AUTHORITY" $AUTHORITY_ADS
sort_ads "5-CTA" $CTA_ADS

echo ""
echo "=== All done! ==="
echo ""

# Final count
for folder in "1-PAIN" "2-OUTCOME" "3-FEATURES" "4-AUTHORITY" "5-CTA"; do
  count=$(ls -1 "${OUTPUT_BASE}/${folder}/"*.mp4 2>/dev/null | wc -l)
  echo "${folder}: ${count} videos"
done
echo ""
echo "Total: $(ls -1 "${OUTPUT_BASE}/"*/*.mp4 2>/dev/null | wc -l) videos"
