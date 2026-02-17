/**
 * Ad13_FeatureCollage_V4
 * Theme: Feature overview — ONLY REAL features
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
import { Calendar, CreditCard, BarChart3, Bell, Globe, FileText } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  RTL,
  FONT_HEADING,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  FeatureCard,
  ScreenshotCTAScene,
} from "./shared";

/* ─── Scene 1: Feature Grid ─── */
const SceneGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="30%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "90px 40px 60px",
          height: "100%",
          gap: 22,
        }}
      >
        <SectionLabel text="FEATURES" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"הכל מה שצריך "}
          <GoldText>{"במקום אחד"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
            marginTop: 10,
          }}
        >
          <FeatureCard Icon={Calendar} title="הזמנות" delay={12} />
          <FeatureCard Icon={CreditCard} title="תשלומים" delay={20} />
          <FeatureCard Icon={BarChart3} title="אנליטיקס" delay={28} />
          <FeatureCard Icon={Bell} title="התראות" delay={36} />
          <FeatureCard Icon={Globe} title="נוכחות אונליין" delay={44} />
          <FeatureCard Icon={FileText} title="חשבוניות" delay={52} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Screenshot + CTA ─── */
const SceneFinal: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Studioz-Dashboard-Calendar.webp"
    headline={
      <>
        {"נהל את האולפן שלך"}
        {"\n"}
        <GoldText>{"כמו מקצוען"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad13_FeatureCollage_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120} premountFor={15}>
      <SceneGrid />
    </Sequence>
    <Sequence from={120} durationInFrames={120} premountFor={15}>
      <SceneFinal />
    </Sequence>
  </AbsoluteFill>
);
