/**
 * Ad15_NoShowProtection_V5
 * Theme: No-show deposit protection
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
import { UserX, Shield, CreditCard, FileText } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  RED,
  RTL,
  FONT_HEADING,
  SPRING_SMOOTH,
  NoiseOverlay,
  AmbientParticles,
  RadialGlow,
  GoldLine,
  GoldText,
  SectionLabel,
  PainCard,
  FeatureCard,
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Pain Point ─── */
const ScenePain: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="40%" size={s(500)} color={RED} opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(120)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          justifyContent: "center",
          gap: s(30),
        }}
      >
        <SectionLabel text="PROTECTION" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(10)}px`,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-30), 0])}px)`,
          }}
        >
          {"הגנה מ"}
          <GoldText>{"ביטולים"}</GoldText>
        </h1>

        <GoldLine delay={10} width={120} />

        <div style={{ marginTop: s(20) }}>
          <PainCard Icon={UserX} text="לקוח לא הגיע" delay={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Solution + Order Screenshot ─── */
const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={s(600)} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(40)}px ${s(60)}px`,
          height: "100%",
          gap: s(22),
        }}
      >
        <SectionLabel text="DEPOSIT" delay={0} />

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
          {"מקדמה "}
          <GoldText>{"שמגנה עליך"}</GoldText>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14), marginTop: s(10) }}>
          <FeatureCard
            Icon={Shield}
            title="מדיניות ביטולים"
            desc="הגדר חלון ביטול ומקדמה"
            delay={12}
          />
          <FeatureCard
            Icon={CreditCard}
            title="גביית מקדמה"
            desc="תשלום מראש שמבטיח הגעה"
            delay={22}
          />
          <FeatureCard
            Icon={FileText}
            title="תיעוד מלא"
            desc="חשבונית ואישור לכל עסקה"
            delay={32}
          />
        </div>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Details-Order-1-Light.webp"
            delay={40}
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
        {"הגן על ההכנסות"}
        {"\n"}
        <GoldText>{"שלך"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad15_NoShowProtection_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneSolution />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
