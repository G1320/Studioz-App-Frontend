#!/bin/bash
set -e

# ═══════════════════════════════════════════════════════════════════
# Studioz V2 Ads — Render All (B2C + B2B)
# ═══════════════════════════════════════════════════════════════════
#
# B2C = Customer-facing (people looking to book studios)
# B2B = Studio-owner-facing (studio owners joining the platform)
#
# Usage:
#   chmod +x render-all-v2.sh
#   ./render-all-v2.sh              # render all
#   ./render-all-v2.sh --b2c-only   # render only B2C
#   ./render-all-v2.sh --b2b-only   # render only B2B
#   ./render-all-v2.sh --organize   # just copy existing renders into b2c/b2b folders
# ═══════════════════════════════════════════════════════════════════

# ── B2C Ads (Customer-facing) ────────────────────────────────────
# These target end-users who want to discover and book studio sessions.
B2C_ADS=(
  "V2-Ad1-BookYourSession"       # Book your session CTA
  "V2-Ad3-TheStudiozEffect"      # Platform experience showcase
  "V2-Ad5-Categories"            # Browse studio categories
  "V2-Ad12-InstantBooking"       # Instant booking experience
  "V2-Ad17-StudioHero"           # Showcase a featured studio
  "V2-Ad18-SocialProof"          # Customer reviews & social proof
  "V2-Ad43-PlatformStats"        # Platform credibility (500+ studios, 50K bookings)
  "V2-Ad56-BookingDemo"          # Booking flow demo
  "V2-Ad57-ProductLaunch"        # General product launch
)

# ── B2B Ads (Studio owner-facing) ────────────────────────────────
# These target studio owners to join the platform and use its tools.
B2B_ADS=(
  "V2-Ad2-StudioOwnersDream"     # Studio owner value prop
  "V2-Ad4-BookingFlow"           # Automated booking flow for owners
  "V2-Ad6-GoogleRanking"         # SEO / Google ranking boost
  "V2-Ad7-RemoteProjects"        # Remote project management
  "V2-Ad8-PricingTiers"          # Pricing & plan tiers
  "V2-Ad9-BeforeAfter"           # Before/after joining platform
  "V2-Ad10-AutomationMagic"      # Automation features
  "V2-Ad11-DarkLightShowcase"    # Dark/light theme showcase
  "V2-Ad13-FeatureCollage"       # Feature overview collage
  "V2-Ad14-NoCalls"              # No phone calls needed
  "V2-Ad15-NoShowProtection"     # No-show protection for owners
  "V2-Ad16-CalendarSync"         # Calendar sync feature
  "V2-Ad19-EarlyBirdDiscount"    # Early bird pricing for owners
  "V2-Ad20-MultiLocation"        # Multi-location management
  "V2-Ad21-PaymentMethods"       # Payment methods setup
  "V2-Ad22-InvoiceGenerator"     # Invoice generation tool
  "V2-Ad23-PaymentSecure"        # Secure payment processing
  "V2-Ad24-StudioAnalytics"      # Analytics dashboard for owners
  "V2-Ad25-MobileFirst"          # Mobile management for owners
  "V2-Ad26-CustomBranding"       # Custom branding options
  "V2-Ad27-TeamManagement"       # Team/staff management
  "V2-Ad28-WaitlistFeature"      # Waitlist feature
  "V2-Ad29-RecurringBookings"    # Recurring booking setup
  "V2-Ad30-ClientCRM"            # Client CRM for owners
  "V2-Ad31-SmartNotifications"   # Smart notification system
  "V2-Ad32-RevenueGrowth"        # Revenue growth metrics
  "V2-Ad33-StudioComparison"     # Platform vs competitors
  "V2-Ad34-InstantSetup"         # Quick platform setup
  "V2-Ad35-LiveAvailability"     # Live availability management
  "V2-Ad36-EquipmentList"        # Equipment listing feature
  "V2-Ad37-StudioTour"           # Studio tour / gallery feature
  "V2-Ad38-QuickSetup"           # Quick onboarding
  "V2-Ad39-Support247"           # 24/7 support
  "V2-Ad40-StudioSpotlight"      # Studio spotlight / profile
  "V2-Ad41-ReferralProgram"      # Referral program for owners
  "V2-Ad42-SuccessStories"       # Owner success stories
  "V2-Ad44-StudioComparison2"    # Platform comparison (extended)
  "V2-Ad45-MobileApp"            # Mobile app for studio management
  "V2-Ad46-Community"            # Community of studio owners
  "V2-Ad47-TimeSavings"          # Time savings metrics
  "V2-Ad48-ProfessionalLook"     # Professional studio presence
  "V2-Ad49-SmartPricing"         # Smart pricing tools
  "V2-Ad50-InstantNotifications" # Instant notification system
  "V2-Ad51-StudioNetwork"        # Studio network / directory
  "V2-Ad52-TimeIsMoney"          # Time is money value prop
  "V2-Ad53-FinalCTA"             # Final CTA for owners
  "V2-Ad54-BuiltByOwners"        # Built by studio owners
  "V2-Ad55-DashboardDemo"        # Dashboard demo for owners
)

# ── Directories ───────────────────────────────────────────────────
OUT_B2C="out/v2-b2c"
OUT_B2B="out/v2-b2b"
SRC_DIR="out/ads-v2"

mkdir -p "$OUT_B2C" "$OUT_B2B"

# ── Handle flags ──────────────────────────────────────────────────
RENDER_B2C=true
RENDER_B2B=true
ORGANIZE_ONLY=false

for arg in "$@"; do
  case $arg in
    --b2c-only) RENDER_B2B=false ;;
    --b2b-only) RENDER_B2C=false ;;
    --organize) ORGANIZE_ONLY=true ;;
  esac
done

# ── Organize existing renders ────────────────────────────────────
if [ "$ORGANIZE_ONLY" = true ]; then
  echo "=== Organizing existing V2 renders into B2C / B2B ==="
  echo ""

  COUNT=0
  for id in "${B2C_ADS[@]}"; do
    src="$SRC_DIR/${id}.mp4"
    # Special case: Ad57 was rendered to root out/
    if [ "$id" = "V2-Ad57-ProductLaunch" ] && [ ! -f "$src" ] && [ -f "out/product-launch-v2.mp4" ]; then
      src="out/product-launch-v2.mp4"
    fi
    if [ -f "$src" ]; then
      cp "$src" "$OUT_B2C/${id}.mp4"
      COUNT=$((COUNT + 1))
      echo "  [B2C] $id ✓"
    else
      echo "  [B2C] $id ✗ (not found: $src)"
    fi
  done
  echo ""
  echo "B2C: $COUNT / ${#B2C_ADS[@]} copied to $OUT_B2C/"
  echo ""

  COUNT=0
  for id in "${B2B_ADS[@]}"; do
    src="$SRC_DIR/${id}.mp4"
    if [ -f "$src" ]; then
      cp "$src" "$OUT_B2B/${id}.mp4"
      COUNT=$((COUNT + 1))
      echo "  [B2B] $id ✓"
    else
      echo "  [B2B] $id ✗ (not found: $src)"
    fi
  done
  echo ""
  echo "B2B: $COUNT / ${#B2B_ADS[@]} copied to $OUT_B2B/"
  echo ""
  echo "=== Organization complete! ==="
  echo "B2C folder: $OUT_B2C/ (${#B2C_ADS[@]} ads)"
  echo "B2B folder: $OUT_B2B/ (${#B2B_ADS[@]} ads)"
  exit 0
fi

# ── Render ────────────────────────────────────────────────────────
TOTAL=0
[ "$RENDER_B2C" = true ] && TOTAL=$((TOTAL + ${#B2C_ADS[@]}))
[ "$RENDER_B2B" = true ] && TOTAL=$((TOTAL + ${#B2B_ADS[@]}))
COUNT=0

echo "═══════════════════════════════════════════════════════════"
echo "  Studioz V2 Ads — Rendering $TOTAL ads"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ "$RENDER_B2C" = true ]; then
  echo "── B2C Ads (Customer-facing): ${#B2C_ADS[@]} ads ──"
  for id in "${B2C_ADS[@]}"; do
    COUNT=$((COUNT + 1))
    echo "[$COUNT/$TOTAL] B2C: $id"
    npx remotion render src/index.ts "$id" "$OUT_B2C/${id}.mp4"
  done
  echo ""
fi

if [ "$RENDER_B2B" = true ]; then
  echo "── B2B Ads (Studio owner-facing): ${#B2B_ADS[@]} ads ──"
  for id in "${B2B_ADS[@]}"; do
    COUNT=$((COUNT + 1))
    echo "[$COUNT/$TOTAL] B2B: $id"
    npx remotion render src/index.ts "$id" "$OUT_B2B/${id}.mp4"
  done
  echo ""
fi

echo "═══════════════════════════════════════════════════════════"
echo "  Done!"
echo "  B2C: $OUT_B2C/ (${#B2C_ADS[@]} customer-facing ads)"
echo "  B2B: $OUT_B2B/ (${#B2B_ADS[@]} studio-owner-facing ads)"
echo "  Total: $((${#B2C_ADS[@]} + ${#B2B_ADS[@]})) V2 ads"
echo "═══════════════════════════════════════════════════════════"
