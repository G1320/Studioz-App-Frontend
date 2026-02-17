/**
 * Ad13_FeatureCollage_V5
 * Theme: Feature overview — REAL features only
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
  useScale,
} from "./shared";

/* ─── Scene 1: Feature Grid ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(22),
        }}
      >
        <SectionLabel text="FEATURES" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(8)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"הכל ב"}
          <GoldText>{"מקום אחד"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: s(14),
            marginTop: s(15),
          }}
        >
          <div style={{ display: "flex", gap: s(14) }}>
            <div style={{ flex: 1 }}>
              <FeatureCard Icon={Calendar} title="הזמנות" delay={15} />
            </div>
            <div style={{ flex: 1 }}>
              <FeatureCard Icon={CreditCard} title="תשלומים" delay={22} />
            </div>
          </div>
          <div style={{ display: "flex", gap: s(14) }}>
            <div style={{ flex: 1 }}>
              <FeatureCard Icon={BarChart3} title="אנליטיקס" delay={29} />
            </div>
            <div style={{ flex: 1 }}>
              <FeatureCard Icon={Bell} title="התראות" delay={36} />
            </div>
          </div>
          <div style={{ display: "flex", gap: s(14) }}>
            <div style={{ flex: 1 }}>
              <FeatureCard Icon={Globe} title="נוכחות אונליין" delay={43} />
            </div>
            <div style={{ flex: 1 }}>
              <FeatureCard Icon={FileText} title="חשבוניות" delay={50} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Screenshot + CTA ─── */
const SceneCTA: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Dashboard-Main.png"
    screenshotCropTop={13}
    headline={
      <>
        {"נהל את האולפן"}
        {"\n"}
        <GoldText>{"כמו מקצוען"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad13_FeatureCollage_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={120} durationInFrames={120} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
