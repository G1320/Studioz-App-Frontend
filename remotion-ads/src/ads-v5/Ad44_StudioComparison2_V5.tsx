/**
 * Ad44_StudioComparison2_V5
 * Theme: Why Studioz vs DIY — real features only
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
  Phone,
  CalendarX,
  FileX,
  Clock,
  Calendar,
  CreditCard,
  FileText,
  Globe,
} from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  ScreenshotCTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Without vs With ─── */
const SceneComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="25%" size={s(500)} color={RED} opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          gap: s(20),
        }}
      >
        <SectionLabel text="COMPARE" delay={0} />

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
          <GoldText>{"בלי Studioz"}</GoldText>
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14) }}>
          <PainCard Icon={Phone} text="תיאום ידני בטלפון" delay={10} />
          <PainCard Icon={CalendarX} text="כפילויות ובלאגן ביומן" delay={18} />
          <PainCard Icon={FileX} text="חשבוניות ידניות" delay={26} />
          <PainCard Icon={Clock} text="בזבוז שעות על ניהול" delay={34} />
        </div>

        <GoldLine delay={42} width={140} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(42),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `${s(10)}px 0 0`,
            opacity: interpolate(frame, [50, 65], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            transform: `translateY(${interpolate(frame, [50, 65], [15, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          }}
        >
          <GoldText>{"עם Studioz"}</GoldText>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: s(14) }}>
          <FeatureCard Icon={Calendar} title="הזמנות אוטומטיות" delay={55} />
          <FeatureCard Icon={CreditCard} title="תשלומים ומקדמות" delay={63} />
          <FeatureCard Icon={FileText} title="חשבוניות אוטומטיות" delay={71} />
          <FeatureCard Icon={Globe} title="עמוד אולפן מקצועי" delay={79} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Screenshot CTA ─── */
const SceneCTA: React.FC = () => (
  <ScreenshotCTAScene
    screenshotSrc="images/optimized/Studioz-Studio-Details-1-Light.webp"
    headline={
      <>
        {"תנהלו את האולפן"}
        {"\n"}
        <GoldText>{"כמו מקצוענים"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad44_StudioComparison2_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120} premountFor={15}>
      <SceneComparison />
    </Sequence>
    <Sequence from={120} durationInFrames={120} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
