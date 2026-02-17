/**
 * Ad15_NoShowProtection_V4
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
  SUCCESS,
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
  CTAScene,
} from "./shared";

/* ─── Scene 1: Pain — No-shows ─── */
const ScenePain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="35%" size={500} color={RED} opacity={0.07} />

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
        <SectionLabel text="PROTECTION" delay={0} color={RED} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"הגנה מ"}
          <span style={{ color: RED }}>{"ביטולים"}</span>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ marginTop: 15 }}>
          <PainCard Icon={UserX} text="לקוח לא הגיע, הפסדת הכנסה" delay={15} strikeDelay={55} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Protection Features ─── */
const SceneProtection: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={600} color={SUCCESS} opacity={0.06} />

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
        <SectionLabel text="SOLUTION" delay={0} color={SUCCESS} />

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
          <GoldText>{"הגנה מלאה"}</GoldText>
          {" על ההכנסות"}
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={Shield} title="מקדמה מראש" desc="הלקוח משלם מקדמה בעת ההזמנה" delay={15} accentColor={SUCCESS} />
          <FeatureCard Icon={CreditCard} title="תשלום מאובטח" desc="כרטיס, Bit, PayPal, העברה" delay={25} accentColor={SUCCESS} />
          <FeatureCard Icon={FileText} title="מדיניות ביטולים" desc="תנאי ביטול ברורים ומוגדרים" delay={35} accentColor={SUCCESS} />
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
        {"הגן על "}
        <GoldText>{"ההכנסות שלך"}</GoldText>
        {"\n"}
        {"עם מקדמה מראש"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad15_NoShowProtection_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <ScenePain />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneProtection />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
