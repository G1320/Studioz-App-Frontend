/**
 * Ad41_FreeTrial_V4
 * Theme: Free trial — NOT referral program
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
import {
  CreditCard,
  Clock,
  ArrowRight,
  Gift,
  Star,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUCCESS,
  ACCENT_BLUE,
  RTL,
  FONT_HEADING,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  Badge,
  FeatureCard,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Trial Badges ─── */
const SceneTrial: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={600} opacity={0.1} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 28,
          alignItems: "center",
        }}
      >
        <SectionLabel text="FREE TRIAL" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"נסו בחינם, "}
          <GoldText>{"ללא סיכון"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Badge text="7 ימי ניסיון Starter" color={SUCCESS} delay={15} Icon={Gift} />
          <Badge text="14 ימי ניסיון Pro" color={GOLD} delay={25} Icon={Star} />
        </div>

        <div
          style={{
            marginTop: 30,
            opacity: interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" }),
          }}
        >
          <span
            style={{
              fontFamily: FONT_HEADING,
              fontSize: 24,
              color: ACCENT_BLUE,
              fontWeight: 600,
            }}
          >
            {"ללא התחייבות"}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Cards ─── */
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 44px 60px",
          height: "100%",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <SectionLabel text="NO RISK" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"מתחילים "}
          <GoldText>{"בלי דאגות"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
          <FeatureCard Icon={CreditCard} title="ללא כרטיס אשראי" desc="לא נדרש אמצעי תשלום" delay={10} />
          <FeatureCard Icon={Clock} title="התחילו מייד" desc="הרשמה בדקות ספורות" delay={22} />
          <FeatureCard Icon={ArrowRight} title="שדרגו כשתרצו" desc="עברו ל-Starter או Pro בכל זמן" delay={34} />
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
        <GoldText>{"התחל ניסיון חינם"}</GoldText>
      </>
    }
    buttonText="התחל ניסיון חינם"
    badgeText="התחל בחינם — ₪0/חודש"
  />
);

/* ─── Main Export ─── */
export const Ad41_FreeTrial_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneTrial />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneFeatures />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
