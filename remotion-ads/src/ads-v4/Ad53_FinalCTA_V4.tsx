/**
 * Ad53_FinalCTA_V4
 * Theme: Final call-to-action with real feature list only
 * Duration: 270 frames (9s) at 30fps, 1080x1920
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
import {
  Calendar,
  CreditCard,
  FileText,
  Bell,
  Globe,
  BarChart3,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  RTL,
  FONT_HEADING,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
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

/* ─── Scene 1: Rapid-Fire Features ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 50px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 20,
        }}
      >
        <SectionLabel text="ALL-IN-ONE" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-30, 0])}px)`,
          }}
        >
          {"הכל באולפן שלך — "}
          <GoldText>{"באוטומט"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 10 }}>
          <FeatureCard Icon={Calendar} title="יומן הזמנות" delay={12} />
          <FeatureCard Icon={CreditCard} title="תשלומים מקוונים" delay={20} />
          <FeatureCard Icon={FileText} title="חשבוניות אוטומטיות" delay={28} />
          <FeatureCard Icon={Bell} title="התראות מייל" delay={36} />
          <FeatureCard Icon={Globe} title="דף אולפן + SEO" delay={44} />
          <FeatureCard Icon={BarChart3} title="אנליטיקס (Pro)" delay={52} />
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
      <RadialGlow x="50%" y="45%" size={600} opacity={0.08} />

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
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"הכל "}
          <GoldText>{"במקום אחד"}</GoldText>
        </h2>

        <div style={{ marginTop: 10 }}>
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
        {"פרסם את האולפן שלך "}
        <GoldText>{"עכשיו"}</GoldText>
        {" — חינם"}
      </>
    }
    buttonText="פרסם את האולפן שלך עכשיו"
  />
);

/* ─── Main Export ─── */
export const Ad53_FinalCTA_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={90} durationInFrames={90} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={180} durationInFrames={90} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
