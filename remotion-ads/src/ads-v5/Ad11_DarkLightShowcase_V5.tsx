/**
 * Ad11_DarkLightShowcase_V5
 * Theme: Dark/Light mode showcase
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
  PhoneMockup,
  ScreenshotFrame,
  CTAScene,
  useScale,
} from "./shared";

/* ─── Scene 1: Side-by-Side Dark + Light ─── */
const SceneModes: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="30%" y="50%" size={s(400)} opacity={0.06} />
      <RadialGlow x="70%" y="50%" size={s(400)} opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: `${s(100)}px ${s(44)}px ${s(60)}px`,
          height: "100%",
          gap: s(30),
        }}
      >
        <SectionLabel text="DESIGN" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: s(48),
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: `0 0 ${s(8)}px`,
            textAlign: "center",
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [s(-25), 0])}px)`,
          }}
        >
          {"כל מצב, "}
          <GoldText>{"כל סגנון"}</GoldText>
        </h1>

        <GoldLine delay={8} width={120} />

        <div
          style={{
            display: "flex",
            gap: s(20),
            justifyContent: "center",
            alignItems: "center",
            marginTop: s(20),
            flex: 1,
          }}
        >
          <PhoneMockup
            src="images/optimized/Studioz-Studio-Details-1-Dark.webp"
            delay={15}
            width={380}
          />
          <PhoneMockup
            src="images/optimized/Studioz-Studio-Details-1-Light.webp"
            delay={25}
            width={380}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Full Light Mode Screenshot ─── */
const SceneLight: React.FC = () => {
  const frame = useCurrentFrame();
  const s = useScale();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
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
        <SectionLabel text="LIGHT MODE" delay={0} />

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
          {"עיצוב "}
          <GoldText>{"מקצועי"}</GoldText>
        </h2>

        <div style={{ marginTop: s(15) }}>
          <ScreenshotFrame
            src="images/optimized/Studioz-Studio-Detail-2-Light.webp"
            delay={10}
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
        {"עמוד אולפן "}
        <GoldText>{"שמוכר"}</GoldText>
        {"\n"}
        {"בכל סגנון"}
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad11_DarkLightShowcase_V5: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={100} premountFor={15}>
      <SceneModes />
    </Sequence>
    <Sequence from={100} durationInFrames={70} premountFor={15}>
      <SceneLight />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
