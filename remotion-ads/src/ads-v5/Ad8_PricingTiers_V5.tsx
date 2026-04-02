/**
 * Ad8_PricingTiers_V5
 * Theme: Free forever + progressive fee tiers (9% → 7% → 5%)
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

/* ─── Fee Tier Card Component ─── */
const FeeTierCard: React.FC<{
  rate: string;
  range: string;
  label: string;
  delay: number;
  highlight?: boolean;
  accentColor?: string;
}> = ({ rate, range, label, delay, highlight = false, accentColor = GOLD }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = useScale();
  const enter = spring({ frame: frame - delay, fps, config: SPRING_BOUNCY });

  return (
    <div
      style={{
        backgroundColor: DARK_CARD,
        borderRadius: 22,
        padding: `${s(28)}px ${s(26)}px`,
        border: highlight
          ? `2px solid ${accentColor}`
          : `1px solid rgba(255,209,102,0.08)`,
        transform: `scale(${enter})`,
        opacity: enter,
        boxShadow: highlight
          ? `0 0 40px ${accentColor}20, 0 8px 32px rgba(0,0,0,0.3)`
          : "0 6px 28px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: s(20),
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
          fontSize: s(48),
          fontWeight: 800,
          color: highlight ? accentColor : LIGHT_TEXT,
          minWidth: s(90),
          textAlign: "center",
        }}
      >
        {rate}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: s(4) }}>
        <span style={{ fontFamily: FONT_HEADING, fontSize: s(22), fontWeight: 700, color: LIGHT_TEXT }}>
          {label}
        </span>
        <span style={{ fontFamily: FONT_BODY, fontSize: s(18), color: SUBTLE_TEXT }}>
          {range}
        </span>
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
          <GoldText>{"חינם לתמיד"}</GoldText>
        </h1>

        <GoldLine delay={10} width={140} />
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Fee Tier Cards ─── */
const ScenePricing: React.FC = () => {
  const s = useScale();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const subtitleEnter = spring({ frame: frame - 5, fps, config: SPRING_SMOOTH });

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
        gap: s(18),
      }}
    >
      <div
        style={{
          fontFamily: FONT_HEADING,
          fontSize: s(28),
          fontWeight: 700,
          color: LIGHT_TEXT,
          textAlign: "center",
          marginBottom: s(10),
          opacity: subtitleEnter,
        }}
      >
        {"עמלות פרוגרסיביות"}
      </div>

      <FeeTierCard
        rate="9%"
        range="₪0 – ₪15,000"
        label="בהתחלה"
        delay={8}
      />

      <FeeTierCard
        rate="7%"
        range="₪15,001 – ₪40,000"
        label="בצמיחה"
        delay={16}
        accentColor={ACCENT_BLUE}
      />

      <FeeTierCard
        rate="5%"
        range="₪40,001+"
        label="בשיא"
        delay={24}
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
        <GoldText>{"חינם לתמיד"}</GoldText>
        {"\n"}
        {"אנחנו מרוויחים רק כשאתה מרוויח"}
      </>
    }
    buttonText="התחל עכשיו"
    badgeText="₪0 דמי מנוי — כל התכונות כלולות"
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
