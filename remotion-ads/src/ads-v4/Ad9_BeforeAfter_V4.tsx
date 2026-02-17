/**
 * Ad9_BeforeAfter_V4
 * Theme: Before vs After Studioz
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
import { Phone, Clock, X, Calendar, CreditCard, Bell } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
  SUCCESS,
  RED,
  RTL,
  FONT_HEADING,
  FONT_BODY,
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

/* ─── Scene 1: Before ─── */
const SceneBefore: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="30%" size={500} color={RED} opacity={0.06} />

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
        <SectionLabel text="BEFORE" delay={0} color={RED} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          <span style={{ color: RED }}>{"לפני"}</span>
        </h1>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 10 }}>
          <PainCard Icon={Phone} text="שיחות טלפון" delay={15} strikeDelay={70} />
          <PainCard Icon={Clock} text="בזבוז זמן" delay={25} strikeDelay={80} />
          <PainCard Icon={X} text="ביטולים ללא הודעה" delay={35} strikeDelay={90} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: After ─── */
const SceneAfter: React.FC = () => {
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
        <SectionLabel text="AFTER" delay={0} color={SUCCESS} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 52,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          <span style={{ color: SUCCESS }}>{"אחרי"}</span>
          {" Studioz"}
        </h1>

        <GoldLine delay={8} width={100} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 10 }}>
          <FeatureCard Icon={Calendar} title="הזמנות אוטומטיות" desc="24/7 ללא מאמץ" delay={15} accentColor={SUCCESS} />
          <FeatureCard Icon={CreditCard} title="תשלום מיידי" desc="כרטיס, Bit, PayPal, העברה" delay={25} accentColor={SUCCESS} />
          <FeatureCard Icon={Bell} title="התראות מיידיות" desc="הזמנה חדשה, אישור, תזכורת" delay={35} accentColor={SUCCESS} />
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
        {"עבר לעבוד עם"}
        {"\n"}
        <GoldText>{"Studioz"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad9_BeforeAfter_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={100} premountFor={15}>
      <SceneBefore />
    </Sequence>
    <Sequence from={100} durationInFrames={70} premountFor={15}>
      <SceneAfter />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
