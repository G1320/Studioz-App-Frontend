/**
 * Ad19 — Early Bird Discount V3
 * Urgency-driven early bird pricing with countdown + badges
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
  RED,
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
  Badge,
  GoldButton,
  Footer,
  CTAScene,
} from "./shared";

/* ─── Countdown Digit ─── */
const CountdownDigit: React.FC<{
  value: string;
  label: string;
  delay: number;
}> = ({ value, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  const pulse = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.97, 1.03]
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        opacity: enter,
        transform: `scale(${enter * pulse})`,
      }}
    >
      <div
        style={{
          backgroundColor: DARK_CARD_HOVER,
          borderRadius: 18,
          padding: "18px 22px",
          border: `2px solid ${GOLD}25`,
          minWidth: 90,
          textAlign: "center",
          boxShadow: `0 0 25px ${GOLD}08`,
        }}
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 48,
            fontWeight: 700,
            color: GOLD,
            filter: `drop-shadow(0 0 8px ${GOLD}25)`,
          }}
        >
          {value}
        </span>
      </div>
      <span
        style={{
          fontFamily: FONT_BODY,
          fontSize: 14,
          color: SUBTLE_TEXT,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Scene 1: Early Bird Offer ─── */
const EarlyBirdScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  // Urgency flash
  const urgencyFlash = interpolate(
    Math.sin(frame * 0.12),
    [-1, 1],
    [0.85, 1]
  );

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} color={GOLD} />
      <RadialGlow x="50%" y="30%" size={600} opacity={0.1} />
      <RadialGlow x="50%" y="70%" size={400} color={GOLD} opacity={0.05} />

      <div
        style={{
          padding: "70px 44px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          alignItems: "center",
        }}
      >
        {/* Early Bird Badge */}
        <div
          style={{
            opacity: headEnter,
            transform: `scale(${headEnter})`,
            marginBottom: 16,
          }}
        >
          <Badge text="🐦 Early Bird" color={GOLD} delay={0} />
        </div>

        {/* Headline */}
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "10px 0 6px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          <GoldText>הצטרף עכשיו</GoldText>
          {"\n"}בתנאים מיוחדים
        </h2>

        <div style={{ marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Countdown timer */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 30,
            direction: "ltr",
          }}
        >
          <CountdownDigit value="02" label="ימים" delay={15} />
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 44,
              color: GOLD,
              alignSelf: "flex-start",
              marginTop: 18,
              opacity: urgencyFlash,
            }}
          >
            :
          </div>
          <CountdownDigit value="14" label="שעות" delay={20} />
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 44,
              color: GOLD,
              alignSelf: "flex-start",
              marginTop: 18,
              opacity: urgencyFlash,
            }}
          >
            :
          </div>
          <CountdownDigit value="37" label="דקות" delay={25} />
        </div>

        {/* Pricing comparison */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 24,
            padding: "32px 36px",
            border: `2px solid ${GOLD}20`,
            textAlign: "center",
            width: "100%",
            marginBottom: 24,
            boxShadow: `0 0 40px ${GOLD}08`,
            opacity: interpolate(frame, [30, 50], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [30, 50], [30, 0], { extrapolateRight: "clamp" })}px)`,
          }}
        >
          {/* Original price (struck through) */}
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 32,
              color: SUBTLE_TEXT,
              textDecoration: "line-through",
              marginBottom: 6,
            }}
          >
            ₪99/חודש
          </div>
          {/* Early bird price */}
          <div
            style={{
              fontFamily: FONT_MONO,
              fontSize: 62,
              fontWeight: 700,
              color: GOLD,
              filter: `drop-shadow(0 0 15px ${GOLD}30)`,
              marginBottom: 4,
            }}
          >
            ₪0
          </div>
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 20,
              color: SUCCESS,
              fontWeight: 600,
            }}
          >
            חינם לתקופת ההשקה
          </div>
        </div>

        {/* Limited spots badge */}
        <div
          style={{
            opacity: interpolate(frame, [60, 78], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          <Badge text="🔥 מקומות מוגבלים" color={RED} delay={55} />
        </div>

        {/* Features list */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginTop: 24,
            width: "100%",
          }}
        >
          {["הזמנות ללא הגבלה", "תשלומים אונליין", "סנכרון יומן", "דף אולפן מותאם"].map(
            (text, i) => {
              const itemEnter = spring({
                frame: frame - 70 - i * 8,
                fps,
                config: { damping: 12 },
              });
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    opacity: itemEnter,
                    transform: `translateX(${interpolate(itemEnter, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <span style={{ color: SUCCESS, fontSize: 18 }}>✓</span>
                  <span
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: 20,
                      color: LIGHT_TEXT,
                    }}
                  >
                    {text}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const EarlyBirdCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        אל תפספס{"\n"}
        <GoldText>את ההזדמנות</GoldText>
      </>
    }
    buttonText="הצטרף עכשיו בחינם"
    freeText="🐦 מחיר Early Bird — ₪0/חודש"
    subText="מקומות מוגבלים · הצטרף היום"
  />
);

/* ─── Main Composition ─── */
export const Ad19_EarlyBirdDiscount_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={155} premountFor={10}>
        <EarlyBirdScene />
      </Sequence>
      <Sequence from={155} durationInFrames={85} premountFor={15}>
        <EarlyBirdCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
