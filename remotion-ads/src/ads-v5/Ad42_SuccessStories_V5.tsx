/**
 * Ad42_SuccessStories_V5
 * Theme: Benefits — why studio owners choose Studioz (no fake metrics)
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
import { Clock, CreditCard, Globe, Zap } from "lucide-react";
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
  useScale,
} from "./shared";

/* ─── Scene 1: Benefits Feature Cards ─── */
const SceneBenefits: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={s(500)} opacity={0.07} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(50)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(28),
        }}
      >
        <SectionLabel text="WHY STUDIOZ" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(40),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            lineHeight: 1.3,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          {"למה בעלי אולפנים בוחרים "}
          <GoldText>{"Studioz?"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ display: "flex", flexDirection: "column", gap: s(16), marginTop: s(10) }}>
          <FeatureCard
            Icon={Clock}
            title="חיסכון בזמן"
            desc="הזמנות אוטומטיות, בלי שיחות טלפון"
            delay={15}
          />
          <FeatureCard
            Icon={CreditCard}
            title="תשלומים מסודרים"
            desc="חשבוניות אוטומטיות ומקדמות"
            delay={25}
          />
          <FeatureCard
            Icon={Globe}
            title="נוכחות אונליין"
            desc="דף אולפן מקצועי עם SEO"
            delay={35}
          />
          <FeatureCard
            Icon={Zap}
            title="ניהול פשוט"
            desc="דשבורד אחד לכל האולפנים"
            delay={45}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Statistics Screenshot ─── */
const SceneDashboard: React.FC = () => {
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
          justifyContent: "center",
          gap: s(25),
        }}
      >
        <SectionLabel text="REAL RESULTS" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(42),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-20), 0])}px)`,
          }}
        >
          {"תוצאות "}
          <GoldText>{"אמיתיות"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Statistics.png"
            cropTop={13}
            delay={8}
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
        {"הצטרפו ל"}
        <GoldText>{"Studioz"}</GoldText>
        {" היום"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad42_SuccessStories_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneBenefits />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneDashboard />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
