/**
 * Ad8_PricingTiers_V5
 * Theme: Pricing tiers — Free, Starter, Pro
 * Duration: 240 frames (8s) at 30fps, 1080x1920
 */
import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { Check } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  DARK_CARD,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  FONT_BODY,
  SPRING_SMOOTH,
  SPRING_BOUNCY,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Pricing Card Component ─── */
const PricingCard: React.FC<{
  name: string;
  price: string;
  period: string;
  features: string[];
  delay: number;
  highlight?: boolean;
  accentColor?: string;
}> = ({ name, price, period, features, delay, highlight = false, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: `${s(32)}px ${s(26)}px`,
        border: highlight
          ? `2px solid ${accentColor}`
          : `1px solid rgba(255,209,102,0.08)`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: highlight
          ? `0 0 40px ${accentColor}20, 0 8px 32px rgba(0,0,0,0.3)`
          : "0 6px 28px rgba(0,0,0,0.25)",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: s(16),
        position: "relative",
        overflow: "hidden",
      }}
    >
      {highlight && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}80)`,
          }}
        />
      )}

      <div
        style={{
          fontFamily: FONT_HEADING,
          fontSize: s(24),
          fontWeight: 700,
          color: highlight ? accentColor : LIGHT_TEXT,
        }}
      >
        {name}
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: s(6) }}>
        <span
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 800,
            color: LIGHT_TEXT,
          }}
        >
          {price}
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: s(16), color: SUBTLE_TEXT }}>
          {period}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: s(10), marginTop: s(8) }}>
        {features.map((feat, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: s(10) }}>
            <Check size={16} color={SUCCESS} strokeWidth={2.5} />
            <span style={{ fontFamily: FONT_BODY, fontSize: s(16), color: SUBTLE_TEXT }}>
              {feat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Scene 1: Title ─── */
const SceneTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="50%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: `${s(60)}px ${s(44)}px`,
          gap: s(20),
        }}
      >
        <SectionLabel text="PRICING" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(56),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          <GoldText>{"תוכניות מחיר"}</GoldText>
        </h1>

        <GoldLine delay={10} width={140} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Pricing Cards ─── */
const ScenePricing: React.FC = () => {
  const s = useScale();
  return (
  <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
    <NoiseOverlay />
    <AmbientParticles count={12} />
    <RadialGlow x="50%" y="50%" size={s(700)} opacity={0.07} />

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: `${s(80)}px ${s(36)}px ${s(60)}px`,
        height: "100%",
        justifyContent: "center",
        gap: s(20),
      }}
    >
      <PricingCard
        name="Free"
        price="₪0"
        period="/חודש"
        features={["מודעה אחת", "3 שירותים", "יומן בסיסי"]}
        delay={5}
      />

      <PricingCard
        name="Starter"
        price="₪49"
        period="/חודש"
        features={[
          "שירותים ללא הגבלה",
          "סנכרון Google Calendar",
          "חשבוניות אוטומטיות",
          "25 תשלומי כרטיס/חודש",
        ]}
        delay={15}
        accentColor={ACCENT_BLUE}
      />

      <PricingCard
        name="Pro"
        price="₪99"
        period="/חודש"
        features={[
          "מודעות ללא הגבלה",
          "אנליטיקס מתקדם",
          "200 תשלומי כרטיס/חודש",
          "תמיכה בעדיפות",
        ]}
        delay={25}
        highlight
      />
    </div>
  </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        <GoldText>{"התחל בחינם"}</GoldText>
        {"\n"}
        {"שדרג כשתרצה"}
      </>
    }
    buttonText="התחל בחינם"
  />
);

/* ─── Main Export ─── */
export const Ad8_PricingTiers_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={70} premountFor={15}>
      <SceneTitle />
    </Sequence>
    <Sequence from={70} durationInFrames={100} premountFor={15}>
      <ScenePricing />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
