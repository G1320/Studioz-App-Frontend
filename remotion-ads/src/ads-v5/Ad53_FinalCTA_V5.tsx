/**
 * Ad53_FinalCTA_V5
 * Theme: Final CTA — real features only
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
  useScale,
} from "./shared";

/* ─── Scene 1: Rapid Feature Cards ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={s(550)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(22),
        }}
      >
        <SectionLabel text="ALL-IN-ONE" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(46),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(6)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"הכל באולפן שלך"}
          {"\n"}
          <GoldText>{"באוטומט"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(12), marginTop: s(10) }}>
          <FeatureCard Icon={Calendar} title="ניהול יומן והזמנות" delay={10} />
          <FeatureCard Icon={CreditCard} title="תשלומים ומקדמות" delay={18} />
          <FeatureCard Icon={FileText} title="חשבוניות אוטומטיות" delay={26} />
          <FeatureCard Icon={Bell} title="התראות במייל" delay={34} />
          <FeatureCard Icon={Globe} title="עמוד אולפן מקצועי" delay={42} />
          <FeatureCard Icon={BarChart3} title="סטטיסטיקות והכנסות" delay={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Full Dashboard Screenshot ─── */
const SceneDashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(30)}px ${s(60)}px`,
          height: "100%",
          gap: s(25),
        }}
      >
        <SectionLabel text="DASHBOARD" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(44),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          {"מרכז הבקרה "}
          <GoldText>{"שלך"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Main.png"
            cropTop={13}
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
        {"פרסם את האולפן שלך"}
        {"\n"}
        <GoldText>{"חינם"}</GoldText>
      </>
    }
    buttonText="פרסם את האולפן שלך — חינם"
  />
);

/* ─── Main Export ─── */
export const Ad53_FinalCTA_V5: React.FC = () => (
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
