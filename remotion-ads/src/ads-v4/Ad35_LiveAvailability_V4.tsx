/**
 * Ad35_LiveAvailability_V4
 * Theme: Live availability management
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
  ScreenshotFrame,
  BulletList,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Availability Screenshot ─── */
const SceneAvailability: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="35%" size={500} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="AVAILABILITY" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: "0 0 8px",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"זמינות "}
          <GoldText>{"בזמן אמת"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div style={{ marginTop: 15 }}>
          <ScreenshotFrame
            src="images/optimized/Studio-Availability-Controls-desktop-1-V3.webp"
            delay={12}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Bullet List ─── */
const SceneBullets: React.FC = () => {
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
        <SectionLabel text="FEATURES" delay={0} />

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
          {"שליטה מלאה "}
          <GoldText>{"בזמינות"}</GoldText>
        </h2>

        <GoldLine delay={8} width={100} />

        <div style={{ marginTop: 10 }}>
          <BulletList
            items={[
              "שעות פעילות לכל יום",
              "זמני מעבר אוטומטיים",
              "חסימת תאריכים ושעות",
              "אישור מיידי או ידני",
            ]}
            startDelay={12}
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
        {"נהלו את הזמן שלכם "}
        <GoldText>{"בקלות"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad35_LiveAvailability_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneAvailability />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneBullets />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
