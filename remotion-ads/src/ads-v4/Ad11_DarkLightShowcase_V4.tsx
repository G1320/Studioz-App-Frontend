/**
 * Ad11_DarkLightShowcase_V4
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
import { Sun, Moon } from "lucide-react";
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
  PhoneMockup,
  ScreenshotFrame,
  CTAScene,
} from "./shared";

/* ─── Scene 1: Side-by-side Phone Mockups ─── */
const SceneDualMode: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });
  const leftEnter = spring({ frame: frame - 15, fps, config: { damping: 14, stiffness: 60 } });
  const rightEnter = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 60 } });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="30%" y="50%" size={400} opacity={0.07} />
      <RadialGlow x="70%" y="50%" size={400} color="#5b8fb9" opacity={0.06} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="DESIGN" delay={0} />

        <h1
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 48,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-25, 0])}px)`,
          }}
        >
          {"כל מצב, "}
          <GoldText>{"כל סגנון"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            flex: 1,
          }}
        >
          <div
            style={{
              opacity: leftEnter,
              transform: `translateX(${interpolate(leftEnter, [0, 1], [-60, 0])}px) rotate(-3deg)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 12 }}>
              <Moon size={18} color={SUBTLE_TEXT} strokeWidth={1.8} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: SUBTLE_TEXT }}>Dark</span>
            </div>
            <PhoneMockup
              src="images/optimized/Studioz-Studio-Details-1-Dark.webp"
              delay={15}
              width={340}
            />
          </div>

          <div
            style={{
              opacity: rightEnter,
              transform: `translateX(${interpolate(rightEnter, [0, 1], [60, 0])}px) rotate(3deg)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center", marginBottom: 12 }}>
              <Sun size={18} color={GOLD} strokeWidth={1.8} />
              <span style={{ fontFamily: FONT_BODY, fontSize: 16, color: SUBTLE_TEXT }}>Light</span>
            </div>
            <PhoneMockup
              src="images/optimized/Studioz-Studio-Details-1-Light.webp"
              delay={25}
              width={340}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Full Screenshot Crossfade ─── */
const SceneCrossfade: React.FC = () => {
  const frame = useCurrentFrame();
  const crossfadePoint = 45;
  const lightOpacity = interpolate(frame, [crossfadePoint - 10, crossfadePoint + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const darkOpacity = interpolate(frame, [crossfadePoint - 10, crossfadePoint + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={10} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 20,
        }}
      >
        <SectionLabel text="SEAMLESS" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 40,
            fontWeight: 700,
            color: LIGHT_TEXT,
            textAlign: "center",
            margin: 0,
          }}
        >
          {"מעבר "}
          <GoldText>{"חלק"}</GoldText>
          {" בין מצבים"}
        </h2>

        <div style={{ position: "relative", marginTop: 15 }}>
          <div style={{ opacity: lightOpacity }}>
            <ScreenshotFrame
              src="images/optimized/Studioz-Studio-Details-1-Light.webp"
              delay={5}
            />
          </div>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, opacity: darkOpacity }}>
            <ScreenshotFrame
              src="images/optimized/Studioz-Studio-Details-1-Dark.webp"
              delay={5}
            />
          </div>
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
        {"האולפן שלך, "}
        <GoldText>{"הסגנון שלך"}</GoldText>
      </>
    }
  />
);

/* ─── Main Export ─── */
export const Ad11_DarkLightShowcase_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneDualMode />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneCrossfade />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
