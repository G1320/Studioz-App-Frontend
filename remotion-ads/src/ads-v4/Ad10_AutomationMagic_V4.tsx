/**
 * Ad10_AutomationMagic_V4
 * Theme: Automation features
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
import { Zap, FileText, Bell, RefreshCcw } from "lucide-react";
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
  ScreenshotFrame,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Automation Features ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <SectionLabel text="AUTOMATION" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 46,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"אוטומציה "}
          <GoldText>{"שעובדת בשבילך"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
          <FeatureCard Icon={Zap} title="אישור הזמנות אוטומטי" desc="הזמנות מאושרות מיידית" delay={15} />
          <FeatureCard Icon={FileText} title="חשבוניות אוטומטיות" desc="חשבונית מס נשלחת אוטומטית" delay={25} />
          <FeatureCard Icon={Bell} title="תזכורות אוטומטיות" desc="הלקוח מקבל תזכורת לפני המפגש" delay={35} />
          <FeatureCard Icon={RefreshCcw} title="סנכרון יומן" desc="סנכרון עם Google Calendar" delay={45} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Screenshot ─── */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="40%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="DASHBOARD" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"הכל "}
          <GoldText>{"בלוח בקרה אחד"}</GoldText>
        </h2>

        <div style={{ marginTop: 15 }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Dashboard-Calendar.webp"
            delay={10}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const SceneCTA: React.FC = () => (
  <CTAScene
    headline={
      <>
        {"תן לאוטומציה "}
        <GoldText>{"לעבוד"}</GoldText>
        {"\n"}
        {"במקומך"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad10_AutomationMagic_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
