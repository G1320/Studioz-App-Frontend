/**
 * Ad8 — Pricing Tiers V3
 * Three pricing cards with gold highlight on recommended plan
 * 240 frames / 8s @ 30fps
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  DARK_CARD_HOVER,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  FONT_MONO,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  CTAScene,
  SectionLabel,
} from "./shared";

/* ─── Pricing Card ─── */
const PricingCard: React.FC<{
  name: string;
  price: string;
  period: string;
  features: string[];
  isRecommended?: boolean;
  delay: number;
}> = ({ name, price, period, features, isRecommended = false, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame: frame - delay,
    fps,
    config: isRecommended ? SPRING_BOUNCY : SPRING_SMOOTH,
  });

  const pulse = isRecommended
    ? interpolate(Math.sin(frame * 0.06), [-1, 1], [0.98, 1.02])
    : 1;

  return (
    <div
      style={{
        backgroundColor: isRecommended ? DARK_CARD_HOVER : DARK_CARD,
        borderRadius: 24,
        padding: "32px 24px",
        border: isRecommended
          ? `2px solid ${GOLD}`
          : `1px solid rgba(255,209,102,0.08)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [80, 0])}px) scale(${enter * pulse})`,
        boxShadow: isRecommended
          ? `0 0 40px ${GOLD}20, 0 12px 40px rgba(0,0,0,0.4)`
          : "0 6px 28px rgba(0,0,0,0.25)",
        flex: 1,
        position: "relative",
      }}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <div
          style={{
            position: "absolute",
            top: -16,
            backgroundColor: GOLD,
            borderRadius: 50,
            padding: "6px 22px",
            boxShadow: `0 0 20px ${GOLD}30`,
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 14,
              fontWeight: 700,
              color: DARK_BG,
            }}
          >
            מומלץ ⭐
          </span>
        </div>
      )}

      {/* Plan name */}
      <span
        style={{
          fontFamily: FONT_HEADING,
          fontSize: 22,
          fontWeight: 600,
          color: isRecommended ? GOLD : SUBTLE_TEXT,
          marginTop: isRecommended ? 8 : 0,
        }}
      >
        {name}
      </span>

      {/* Price */}
      <div style={{ textAlign: "center" }}>
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 46,
            fontWeight: 700,
            color: isRecommended ? GOLD : LIGHT_TEXT,
            filter: isRecommended
              ? `drop-shadow(0 0 12px ${GOLD}20)`
              : "none",
          }}
        >
          {price}
        </span>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 15,
            color: SUBTLE_TEXT,
            marginTop: 2,
          }}
        >
          {period}
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: "80%",
          height: 1,
          backgroundColor: isRecommended
            ? `${GOLD}30`
            : "rgba(255,255,255,0.06)",
        }}
      />

      {/* Features */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: "100%",
        }}
      >
        {features.map((feat, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: SUCCESS,
                flexShrink: 0,
              }}
            >
              ✓
            </span>
            <span
              style={{
                fontFamily: FONT_BODY,
                fontSize: 16,
                color: LIGHT_TEXT,
              }}
            >
              {feat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Scene 1: Pricing Tiers ─── */
const PricingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={600} opacity={0.08} />

      <div
        style={{
          padding: "70px 36px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <SectionLabel text="תוכניות מחירים" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "14px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          תוכנית ל<GoldText>כל אולפן</GoldText>
        </h2>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}>
          <GoldLine width={120} delay={10} />
        </div>

        {/* Pricing cards */}
        <div
          style={{
            display: "flex",
            gap: 16,
            flex: 1,
            alignItems: "stretch",
          }}
        >
          <PricingCard
            name="חינמי"
            price="₪0"
            period="לחודש"
            features={["דף אולפן", "5 הזמנות/חודש", "תמיכה בצ׳אט"]}
            delay={20}
          />
          <PricingCard
            name="בסיסי"
            price="₪99"
            period="לחודש"
            features={[
              "הזמנות ללא הגבלה",
              "תשלומים אונליין",
              "סנכרון יומן",
              "דוחות בסיסיים",
            ]}
            isRecommended
            delay={30}
          />
          <PricingCard
            name="פרו"
            price="₪249"
            period="לחודש"
            features={[
              "כל הבסיסי +",
              "CRM מתקדם",
              "מיתוג מותאם",
              "API חיצוני",
              "תמיכה VIP",
            ]}
            delay={40}
          />
        </div>

        {/* Bottom note */}
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 20,
            color: SUBTLE_TEXT,
            textAlign: "center",
            marginTop: 24,
            opacity: interpolate(frame, [80, 100], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          ללא התחייבות · בטל בכל עת
        </p>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const PricingCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        בחר את התוכנית{"\n"}
        <GoldText>המתאימה לך</GoldText>
      </>
    }
    buttonText="התחל בחינם"
    freeText="התחל בחינם — ₪0/חודש"
    subText="שדרג בכל עת · ללא התחייבות"
  />
);

/* ─── Main Composition ─── */
export const Ad8_PricingTiers_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <PricingScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <PricingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
