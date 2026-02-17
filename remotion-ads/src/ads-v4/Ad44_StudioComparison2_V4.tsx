/**
 * Ad44_StudioComparison2_V4
 * Theme: Why Studioz vs doing it yourself — only real features
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
  EyeOff,
  CalendarCheck,
  FileText,
  Search,
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
} from "./shared";

/* ─── Scene 1: Comparison ─── */
const SceneComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="25%" size={500} color={RED} opacity={0.06} />
      <RadialGlow x="50%" y="75%" size={500} color={GOLD} opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 50px 60px",
          height: "100%",
          gap: 20,
        }}
      >
        <SectionLabel text="COMPARISON" delay={0} />

        {/* Without Studioz */}
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 40,
            fontWeight: 700,
            color: RED,
            margin: "10px 0 0",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"בלי Studioz"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <PainCard Icon={Phone} text="תיאום ידני בטלפון" delay={10} />
          <PainCard Icon={CalendarX} text="יומן מבולגן וכפילויות" delay={20} />
          <PainCard Icon={EyeOff} text="אפס נוכחות אונליין" delay={30} />
        </div>

        <GoldLine delay={40} width={120} />

        {/* With Studioz */}
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 40,
            fontWeight: 700,
            color: GOLD,
            margin: "10px 0 0",
            opacity: interpolate(frame, [45, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {"עם "}
          <GoldText>{"Studioz"}</GoldText>
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FeatureCard
            Icon={CalendarCheck}
            title="הזמנות אונליין"
            desc="מיידי או באישור ידני"
            delay={50}
          />
          <FeatureCard
            Icon={FileText}
            title="חשבוניות אוטומטיות"
            desc="Sumit / Green Invoice"
            delay={60}
          />
          <FeatureCard
            Icon={Search}
            title="דף אולפן עם SEO"
            desc="הופעה בתוצאות גוגל"
            delay={70}
          />
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
        {"זה הזמן לשדרג את "}
        <GoldText>{"האולפן שלך"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad44_StudioComparison2_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={120} premountFor={15}>
      <SceneComparison />
    </Sequence>
    <Sequence from={120} durationInFrames={120} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
