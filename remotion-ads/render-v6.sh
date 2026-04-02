#!/bin/bash
# Render all V6 ads (dark + light) in all aspect ratios
set -e

ENTRY="src/index.ts"
OUT="out/v6"

DARK_ADS=(
  "V6-Ad1-HeroIntro"
  "V6-Ad2-PainPoints"
  "V6-Ad3-ProductShowcase"
  "V6-Ad4-BookingFlow"
  "V6-Ad5-Analytics"
  "V6-Ad6-CalendarSync"
  "V6-Ad7-Payments"
  "V6-Ad8-FreeForever"
  "V6-Ad9-BeforeAfter"
  "V6-Ad10-FinalCTA"
)

LIGHT_ADS=(
  "V6-Ad1-HeroIntro-Light"
  "V6-Ad2-PainPoints-Light"
  "V6-Ad3-ProductShowcase-Light"
  "V6-Ad4-BookingFlow-Light"
  "V6-Ad5-Analytics-Light"
  "V6-Ad6-CalendarSync-Light"
  "V6-Ad7-Payments-Light"
  "V6-Ad8-FreeForever-Light"
  "V6-Ad9-BeforeAfter-Light"
  "V6-Ad10-FinalCTA-Light"
)

ALL_ADS=("${DARK_ADS[@]}" "${LIGHT_ADS[@]}")
RATIOS=("" "-4x5" "-1x1")

TOTAL=$(( ${#ALL_ADS[@]} * ${#RATIOS[@]} ))
COUNT=0

for ad in "${ALL_ADS[@]}"; do
  for ratio in "${RATIOS[@]}"; do
    COMP="${ad}${ratio}"
    FILENAME=$(echo "$COMP" | tr '[:upper:]' '[:lower:]')
    COUNT=$((COUNT + 1))
    echo ""
    echo "═══════════════════════════════════════════════════════"
    echo "  [$COUNT/$TOTAL] Rendering: $COMP"
    echo "═══════════════════════════════════════════════════════"
    npx remotion render "$ENTRY" "$COMP" "$OUT/${FILENAME}.mp4" --log=error
  done
done

echo ""
echo "✅ All $TOTAL videos rendered to $OUT/"
