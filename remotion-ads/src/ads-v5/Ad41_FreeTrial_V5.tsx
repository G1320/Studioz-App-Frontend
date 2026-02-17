/**
 * Ad41_FreeTrial_V5
 * Theme: Free trial — NOT referral
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
  Gift,
  Rocket,
  Calendar,
  CreditCard,
  BarChart3,
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
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Trial Badges ─── */
const SceneTrial: React.FC = () => {
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
        <SectionLabel text="FREE TRIAL" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(56),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          {"נסו "}
          <GoldText>{"בחינם"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: s(18),
            marginTop: s(20),
            alignItems: "flex-start",
          }}
        >
          <Badge
            text="7 ימי ניסיון — Starter"
            color={SUCCESS}
            delay={18}
            Icon={Rocket}
          />
          <Badge
            text="14 ימי ניסיון — Pro"
            color={GOLD}
            delay={28}
            Icon={Star}
          />
        </div>

        <div
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(22),
            color: LIGHT_TEXT,
            marginTop: s(20),
            opacity: interpolate(frame, [40, 55], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          {"ללא כרטיס אשראי · ללא התחייבות"}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Dashboard Stats Screenshot + Features ─── */
const SceneAccess: React.FC = () => {
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
          gap: s(25),
        }}
      >
        <SectionLabel text="FULL ACCESS" delay={0} />

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
          {"גישה מלאה "}
          <GoldText>{"לכל הכלים"}</GoldText>
        </h2>

        <div style={{ marginTop: s(10) }}>
          <ScreenshotFrame
            src="images/optimized/Dashboard-Statistics.png"
            cropTop={13}
            delay={8}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(20) }}>
          <FeatureCard Icon={Calendar} title="ניהול הזמנות" delay={20} />
          <FeatureCard Icon={CreditCard} title="תשלומים וחשבוניות" delay={30} />
          <FeatureCard Icon={BarChart3} title="סטטיסטיקות ודוחות" delay={40} />
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
        {"התחילו "}
        <GoldText>{"ניסיון חינם"}</GoldText>
      </>
    }
    buttonText="התחל ניסיון חינם"
  />
);

/* ─── Main Export ─── */
export const Ad41_FreeTrial_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneTrial />
    </Sequence>
    <Sequence from={80} durationInFrames={80} premountFor={15}>
      <SceneAccess />
    </Sequence>
    <Sequence from={160} durationInFrames={80} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
