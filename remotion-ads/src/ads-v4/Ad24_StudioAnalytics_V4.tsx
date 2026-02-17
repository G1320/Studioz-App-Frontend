/**
 * Ad24 — Analytics Dashboard (Pro)
 * 240 frames (8s) at 30fps, 1080x1920 (9:16 portrait)
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
import { BarChart3, TrendingUp, Users } from "lucide-react";
import {
  GOLD,
  DARK_BG,
  LIGHT_TEXT,
  SUBTLE_TEXT,
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
  FeatureCard,
  ScreenshotFrame,
  Badge,
  CTAScene,
  Footer,
} from "./shared";

/* ─── Scene 1: Analytics + Dashboard Screenshot ─── */
const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={18} />
      <RadialGlow x="50%" y="25%" size={500} opacity={0.1} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
        }}
      >
        <SectionLabel text="ANALYTICS" delay={0} />
        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 50,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.25,
            margin: "25px 0 10px",
            paddingRight: 10,
            paddingLeft: 10,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [30, 0])}px)`,
          }}
        >
          <GoldText>אנליטיקס</GoldText> לאולפן שלך
        </h1>
        <p
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: SUBTLE_TEXT,
            margin: "10px 10px 25px",
            lineHeight: 1.5,
            opacity: interpolate(frame, [8, 22], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }),
          }}
        >
          הבן את הביצועים, קבל החלטות חכמות
        </p>
        <div style={{ padding: "0 0" }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Dashboard-Calendar.webp"
            delay={12}
          />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={35} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Feature Cards ─── */
const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={16} />
      <RadialGlow x="50%" y="35%" size={450} opacity={0.08} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "120px 50px 60px",
          height: "100%",
        }}
      >
        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 44,
            fontWeight: 700,
            color: LIGHT_TEXT,
            lineHeight: 1.3,
            margin: "0 0 35px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [25, 0])}px)`,
          }}
        >
          מה תקבל <GoldText>בדשבורד</GoldText>
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <FeatureCard
            Icon={BarChart3}
            title="דוחות הזמנות"
            desc="צפה בכל ההזמנות במקום אחד"
            delay={10}
          />
          <FeatureCard
            Icon={TrendingUp}
            title="מגמות הכנסה"
            desc="עקוב אחרי הרווחים שלך"
            delay={20}
          />
          <FeatureCard
            Icon={Users}
            title="ניתוח לקוחות"
            desc="הכר את הקהל שלך"
            delay={30}
          />
        </div>
        <div style={{ marginTop: 30 }}>
          <Badge text="בתוכנית Pro" color={GOLD} delay={40} />
        </div>
        <div style={{ marginTop: "auto" }}>
          <Footer delay={50} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 3: CTA ─── */
const Scene3: React.FC = () => (
  <CTAScene
    headline={
      <>
        קבל <GoldText>תמונה מלאה</GoldText> על האולפן
      </>
    }
    badgeText="תוכנית Pro — ₪99/חודש"
  />
);

/* ─── Main Export ─── */
export const Ad24_StudioAnalytics_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={95} premountFor={15}>
      <Scene1 />
    </Sequence>
    <Sequence from={80} durationInFrames={105} premountFor={15}>
      <Scene2 />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <Scene3 />
    </Sequence>
  </AbsoluteFill>
);
