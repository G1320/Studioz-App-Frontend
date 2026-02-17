/**
 * Ad49 — Smart Pricing Tools V3
 * Dynamic pricing, peak hours, packages, auto-discounts
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
  ACCENT_BLUE,
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
  EmojiFeature,
  CTAScene,
  SectionLabel,
} from "./shared";
import { TrendingUp } from "lucide-react";

/* ─── Pricing Card ─── */
const PricingCard: React.FC<{
  emoji: string;
  title: string;
  example: string;
  delay: number;
  accentColor?: string;
}> = ({ emoji, title, example, delay, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 20,
        padding: "26px 24px",
        border: `1px solid ${accentColor}15`,
        display: "flex",
        alignItems: "center",
        gap: 18,
        opacity: enter,
        transform: `translateX(${interpolate(enter, [0, 1], [50, 0])}px)`,
        boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
      }}
    >
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          backgroundColor: `${accentColor}10`,
          border: `1px solid ${accentColor}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          fontSize: 30,
        }}
      >
        {emoji}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 24,
            fontWeight: 700,
            color: LIGHT_TEXT,
            marginBottom: 6,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 17,
            color: SUBTLE_TEXT,
            lineHeight: 1.4,
          }}
        >
          {example}
        </div>
      </div>
    </div>
  );
};

/* ─── Animated Price Bar ─── */
const PriceBar: React.FC<{
  label: string;
  width: number;
  color: string;
  price: string;
  delay: number;
}> = ({ label, width, color, price, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_SMOOTH });
  const barWidth = interpolate(enter, [0, 1], [0, width]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: enter,
      }}
    >
      <div
        style={{
          fontFamily: FONT_BODY,
          fontSize: 16,
          color: SUBTLE_TEXT,
          width: 90,
          textAlign: "left",
        }}
      >
        {label}
      </div>
      <div
        style={{
          flex: 1,
          height: 28,
          backgroundColor: `${color}10`,
          borderRadius: 14,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            backgroundColor: `${color}50`,
            borderRadius: 14,
            background: `linear-gradient(90deg, ${color}30, ${color}70)`,
          }}
        />
      </div>
      <div
        style={{
          fontFamily: FONT_MONO,
          fontSize: 18,
          fontWeight: 700,
          color,
          width: 70,
          textAlign: "center",
        }}
      >
        {price}
      </div>
    </div>
  );
};

/* ─── Scene 1: Pricing Features ─── */
const PricingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="20%" size={500} opacity={0.07} />

      <div
        style={{
          padding: "70px 42px 60px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <SectionLabel text="כלי תמחור" delay={0} />
        </div>

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: "18px 0 8px",
            lineHeight: 1.3,
            opacity: headEnter,
            transform: `translateY(${interpolate(headEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>תמחור חכם</GoldText>
          {"\n"}שמגדיל הכנסות
        </h2>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <GoldLine width={140} delay={10} />
        </div>

        {/* Pricing cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            flex: 1,
          }}
        >
          <PricingCard
            emoji="💰"
            title="תמחור חכם"
            example="₪200/שעה רגילה · ₪280/שעה בשיא"
            delay={15}
            accentColor={GOLD}
          />
          <PricingCard
            emoji="📊"
            title="מחירי שעות שיא"
            example="ערב שישי +40% · חגים +60%"
            delay={25}
            accentColor={ACCENT_BLUE}
          />
          <PricingCard
            emoji="🎁"
            title="חבילות"
            example="10 שעות = ₪1,800 (חיסכון ₪200)"
            delay={35}
            accentColor={SUCCESS}
          />
          <PricingCard
            emoji="🏷️"
            title="הנחות אוטומטיות"
            example="לקוח חוזר -10% · הזמנה ראשונה -15%"
            delay={45}
            accentColor={GOLD}
          />
        </div>

        {/* Dynamic pricing bars */}
        <div
          style={{
            backgroundColor: DARK_CARD,
            borderRadius: 18,
            padding: "22px 24px",
            marginTop: 20,
            border: `1px solid ${GOLD}10`,
          }}
        >
          <div
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 18,
              fontWeight: 600,
              color: GOLD,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TrendingUp size={18} color={GOLD} strokeWidth={2} />
            תמחור דינמי לפי ביקוש
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <PriceBar label="בוקר" width={40} color={ACCENT_BLUE} price="₪150" delay={55} />
            <PriceBar label="צהריים" width={60} color={GOLD} price="₪200" delay={60} />
            <PriceBar label="ערב" width={90} color={SUCCESS} price="₪280" delay={65} />
            <PriceBar label="סוף שבוע" width={100} color={GOLD} price="₪320" delay={70} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: CTA ─── */
const PricingCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        הגדל הכנסות
        {"\n"}
        <GoldText>עם תמחור חכם</GoldText>
      </>
    }
    buttonText="התחל לתמחר חכם"
    freeText="התחל בחינם — ₪0/חודש"
    subText="ללא עמלות נסתרות"
  />
);

/* ─── Main Composition ─── */
export const Ad49_SmartPricing_V3: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG }}>
      <Sequence from={0} durationInFrames={160} premountFor={10}>
        <PricingScene />
      </Sequence>
      <Sequence from={160} durationInFrames={80} premountFor={15}>
        <PricingCTA />
      </Sequence>
    </AbsoluteFill>
  );
};
