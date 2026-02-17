/**
 * Ad34_InstantSetup_V4
 * Theme: Quick setup in minutes
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
  Rocket,
  Settings,
  Globe,
} from "lucide-react";
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
  StepCard,
  ConnectingLine,
  ScreenshotFrame,
  CTAScene,
} from "./shared";

/* ─── Scene 1: 3 Steps ─── */
const SceneSteps: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={14} />
      <RadialGlow x="50%" y="30%" size={500} opacity={0.08} />

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
        <SectionLabel text="QUICK START" delay={0} />

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
          {"מתחילים "}
          <GoldText>{"בדקות"}</GoldText>
        </h1>

        <GoldLine delay={8} width={100} />

        <ConnectingLine x={80} y={420} height={420} startFrame={15} endFrame={60} />

        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginTop: 15 }}>
          <StepCard num="1" title="הרשמה חינם" desc="יצירת חשבון תוך שניות" delay={15} />
          <StepCard num="2" title="הגדרת אולפן" desc="שירותים, מחירים, זמינות ותמונות" delay={30} />
          <StepCard
            num="3"
            title="מתחילים לקבל הזמנות"
            desc="דף האולפן שלכם באוויר"
            delay={45}
            isLast
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ─── Scene 2: Landing Screenshot ─── */
const SceneScreenshot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleEnter = spring({ frame, fps, config: SPRING_SMOOTH });

  return (
    <AbsoluteFill style={{ backgroundColor: DARK_BG, ...RTL }}>
      <NoiseOverlay />
      <AmbientParticles count={12} />
      <RadialGlow x="50%" y="45%" size={600} opacity={0.08} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "100px 40px 60px",
          height: "100%",
          gap: 25,
        }}
      >
        <SectionLabel text="YOUR STUDIO" delay={0} />

        <h2
          style={{
            fontFamily: FONT_HEADING,
            fontSize: 42,
            fontWeight: 700,
            color: LIGHT_TEXT,
            margin: 0,
            opacity: titleEnter,
            transform: `translateY(${interpolate(titleEnter, [0, 1], [-20, 0])}px)`,
          }}
        >
          {"האולפן שלכם "}
          <GoldText>{"באוויר"}</GoldText>
        </h2>

        <div style={{ marginTop: 15 }}>
          <ScreenshotFrame
            src="images/optimized/Landing-Studio1320-1.webp"
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
        <GoldText>{"התחל בחינם"}</GoldText>
        {" עכשיו"}
      </>
    }
    buttonText="התחל בחינם עכשיו"
  />
);

/* ─── Main Export ─── */
export const Ad34_InstantSetup_V4: React.FC = () => (
  <AbsoluteFill>
    <Sequence from={0} durationInFrames={80} premountFor={15}>
      <SceneSteps />
    </Sequence>
    <Sequence from={80} durationInFrames={90} premountFor={15}>
      <SceneScreenshot />
    </Sequence>
    <Sequence from={170} durationInFrames={70} premountFor={15}>
      <SceneCTA />
    </Sequence>
  </AbsoluteFill>
);
